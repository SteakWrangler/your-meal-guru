import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatSection } from "@/components/ChatSection";
import { PrintButton } from "@/components/PrintButton";

const Enhance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dish, setDish] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    additions: Array<{
      ingredient: string;
      instructions?: string;
    }>;
    generalTips?: string;
  } | null>(null);

  const handleEnhance = async () => {
    if (!dish.trim() || !ingredients.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both the dish name and your current ingredients.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: {
          type: "enhance",
          dish: dish.trim(),
          currentIngredients: ingredients.trim(),
        },
      });

      if (error) throw error;

      setSuggestions(data);
    } catch (error) {
      console.error("Error getting enhancement suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get enhancement suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const systemPrompt = `You are a helpful cooking assistant. The user is looking at enhancement suggestions for their ${dish || "dish"}. 
Current ingredients: ${ingredients}
${suggestions ? `Suggested additions: ${suggestions.additions.map(a => a.ingredient).join(", ")}` : ""}

Answer questions about cooking techniques, ingredients, and preparation methods. You can answer both context-specific questions about this dish and general cooking questions.`;

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 md:mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold">Enhance Your Dish</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Tell us what you're making and we'll suggest ways to make it even better
          </p>
        </div>

        <Card className="p-5 md:p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What are you making?
              </label>
              <Input
                placeholder="e.g., Tacos"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                What ingredients are you using?
              </label>
              <Textarea
                placeholder="e.g., Taco shells, ground beef, cheese, sour cream"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleEnhance}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Enhancement Ideas
                </>
              )}
            </Button>
          </div>
        </Card>

        {suggestions && (
          <>
            <Card className="p-5 md:p-6 mb-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Suggested Enhancements
              </h2>

              <div className="space-y-4">
                {suggestions.additions.map((addition, index) => (
                  <div key={index} className="border-l-4 border-accent pl-4">
                    <h3 className="font-semibold text-lg mb-2">{addition.ingredient}</h3>
                    {addition.instructions && (
                      <p className="text-muted-foreground">{addition.instructions}</p>
                    )}
                  </div>
                ))}
              </div>

              {suggestions.generalTips && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">{suggestions.generalTips}</p>
                </div>
              )}
            </Card>

            <PrintButton />
          </>
        )}

        {(dish || ingredients) && (
          <ChatSection
            context={`User is enhancing their ${dish}. Current ingredients: ${ingredients}. ${suggestions ? `Suggestions: ${JSON.stringify(suggestions)}` : ""}`}
            systemPrompt={systemPrompt}
          />
        )}
      </div>
    </div>
  );
};

export default Enhance;
