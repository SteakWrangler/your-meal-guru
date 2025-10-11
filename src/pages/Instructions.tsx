import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Instructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dishName, setDishName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    if (location.state?.dishName) {
      setDishName(location.state.dishName);
      getRecipe(location.state.dishName);
    }
  }, [location.state]);

  const getRecipe = async (dish?: string) => {
    const targetDish = dish || dishName;
    if (!targetDish.trim()) {
      toast.error("Please enter a dish name");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: { 
          type: "recipe",
          dishName: targetDish 
        },
      });

      if (error) throw error;

      if (data?.recipe) {
        setRecipe(data.recipe);
      }
    } catch (error: any) {
      console.error("Error getting recipe:", error);
      toast.error("Failed to get recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Recipe Instructions</h1>
            <p className="text-muted-foreground">Get step-by-step cooking guides</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4">
            <Input
              placeholder="Enter dish name (e.g., Spaghetti Carbonara)"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && getRecipe()}
              className="flex-1"
            />
            <Button onClick={() => getRecipe()} disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Get Recipe
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Recipe Display */}
        {recipe && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">{recipe.title || dishName}</h2>
            
            {recipe.ingredients && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.steps && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                <ol className="space-y-4">
                  {recipe.steps.map((step: string, index: number) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <p className="pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {recipe.tips && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Pro Tips</h4>
                <p className="text-sm text-muted-foreground">{recipe.tips}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Instructions;
