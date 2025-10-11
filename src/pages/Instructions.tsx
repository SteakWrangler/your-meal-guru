import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatSection } from "@/components/ChatSection";

const Instructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dishName, setDishName] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    // Check if a recipe was passed from Recreate page
    if (location.state?.recipe) {
      setRecipe(location.state.recipe);
    }
    if (location.state?.dishName) {
      setDishName(location.state.dishName);
      // Only fetch if no recipe was provided
      if (!location.state.recipe) {
        getRecipe(location.state.dishName);
      }
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

      if (error) {
        console.error("Error getting recipe:", error);
        toast.error("Failed to get recipe. Please check your API configuration.");
        return;
      }

      if (data?.recipe) {
        setRecipe(data.recipe);
      } else {
        toast.error("No recipe found. Please try again.");
      }
    } catch (error: any) {
      console.error("Error calling recipe function:", error);
      toast.error("Failed to connect to the recipe service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Recipe Instructions</h1>
            <p className="text-sm md:text-base text-muted-foreground">Get step-by-step cooking guides</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Input
              placeholder="Enter dish name (e.g., Spaghetti Carbonara)"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && getRecipe()}
              className="flex-1"
            />
            <Button onClick={() => getRecipe()} disabled={loading} className="w-full sm:w-auto">
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
          <Card className="p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{recipe.title || dishName}</h2>
            
            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="fromScratch">From Scratch</TabsTrigger>
              </TabsList>

              <TabsContent value="standard" className="space-y-6">
                {recipe.standard?.ingredients && (
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {recipe.standard.ingredients.map((ingredient: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm md:text-base">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recipe.standard?.steps && (
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">Instructions</h3>
                    <ol className="space-y-3 md:space-y-4">
                      {recipe.standard.steps.map((step: string, index: number) => (
                        <li key={index} className="flex gap-3 md:gap-4">
                          <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm md:text-base">
                            {index + 1}
                          </span>
                          <p className="pt-0.5 md:pt-1 text-sm md:text-base">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {recipe.standard?.tips && (
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm md:text-base">Pro Tips</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">{recipe.standard.tips}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="fromScratch" className="space-y-6">
                {recipe.fromScratch?.ingredients && (
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {recipe.fromScratch.ingredients.map((ingredient: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm md:text-base">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recipe.fromScratch?.steps && (
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3">Instructions</h3>
                    <ol className="space-y-3 md:space-y-4">
                      {recipe.fromScratch.steps.map((step: string, index: number) => (
                        <li key={index} className="flex gap-3 md:gap-4">
                          <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm md:text-base">
                            {index + 1}
                          </span>
                          <p className="pt-0.5 md:pt-1 text-sm md:text-base">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {recipe.fromScratch?.tips && (
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm md:text-base">Pro Tips</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">{recipe.fromScratch.tips}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {recipe && (
          <ChatSection
            context={recipe}
            systemPrompt="You are a helpful cooking assistant. Help users understand the recipe they're viewing, clarify steps, suggest substitutions, and answer cooking questions."
            placeholder="Ask about this recipe..."
          />
        )}
      </div>
    </div>
  );
};

export default Instructions;
