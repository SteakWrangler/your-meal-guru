import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ChatSection } from "@/components/ChatSection";

const Recreate = () => {
  const navigate = useNavigate();
  const [dish, setDish] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecreate = async () => {
    if (!dish.trim() || !style.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const dishName = `${dish} in the style of ${style}`;
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: { 
          type: "recipe",
          dishName 
        },
      });

      if (error) {
        console.error("Error getting recipe:", error);
        toast.error("Failed to get recipe. Please check your API configuration.");
        return;
      }

      if (data?.recipe) {
        navigate("/instructions", { state: { dishName, recipe: data.recipe } });
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
            <h1 className="text-2xl md:text-3xl font-bold">Recreate Dishes</h1>
            <p className="text-sm md:text-base text-muted-foreground">Make restaurant favorites at home</p>
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <Target className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 md:mb-6 text-primary" />
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">
            What would you like to recreate?
          </h3>
          
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm md:text-base font-medium mb-2">
                What dish?
              </label>
              <Input
                placeholder="e.g., Chicken"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                className="text-base"
              />
            </div>

            <div>
              <label className="block text-sm md:text-base font-medium mb-2">
                In the style of...
              </label>
              <Input
                placeholder="e.g., KFC, Chipotle, Your favorite restaurant"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="text-base"
              />
            </div>

            <Button onClick={handleRecreate} className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Getting Recipe...
                </>
              ) : (
                'Get Recipe'
              )}
            </Button>
          </div>

          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-muted rounded-lg">
            <p className="text-xs md:text-sm text-muted-foreground">
              💡 Example: "Make chicken that tastes like KFC" or "Create pasta like Olive Garden's Alfredo"
            </p>
          </div>
        </Card>

        {(dish || style) && (
          <ChatSection
            context={{ dish, style }}
            systemPrompt="You are a helpful cooking assistant specializing in recreating restaurant dishes. Help users understand techniques, suggest ingredient substitutions, and provide tips for achieving restaurant-quality results at home."
            placeholder="Ask about recreating this dish..."
          />
        )}
      </div>
    </div>
  );
};

export default Recreate;
