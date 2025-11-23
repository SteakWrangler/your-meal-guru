import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatSection } from "@/components/ChatSection";

const CalorieEstimator = () => {
  const [foodInput, setFoodInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEstimate = async () => {
    if (!foodInput.trim()) {
      toast({
        title: "Input required",
        description: "Please describe what you ate",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('meal-suggestions', {
        body: { 
          type: 'calorie-estimate',
          foodInput: foodInput.trim()
        }
      });

      if (error) throw error;

      setResult(data.result);
      toast({
        title: "Analysis complete",
        description: "Nutritional information generated",
      });
    } catch (error) {
      console.error('Error estimating calories:', error);
      toast({
        title: "Error",
        description: "Failed to estimate nutritional information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-2xl bg-accent/10 mb-4">
            <Calculator className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Calorie Estimator</h1>
          <p className="text-muted-foreground text-lg">
            Get nutritional information for any food or meal
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                What did you eat?
              </label>
              <Textarea
                placeholder="E.g., 'I had a cheeseburger' or 'I made a cheeseburger from one Bubba Burger patty, one slice of Publix brand American cheese, and one Publix brand cheeseburger bun'"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Be as specific or general as you like. Include brands and quantities for more accurate estimates.
              </p>
            </div>

            <Button
              onClick={handleEstimate}
              disabled={loading || !foodInput.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? "Analyzing..." : "Estimate Nutrition"}
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Nutritional Analysis</h2>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{result}</div>
            </div>
          </Card>
        )}

        {foodInput && (
          <ChatSection 
            context={`User is estimating calories for: ${foodInput}`}
            systemPrompt="You are a nutritionist assistant helping estimate nutritional information for foods and meals. Provide accurate estimates based on typical portion sizes and common brands when mentioned."
          />
        )}
      </div>
    </div>
  );
};

export default CalorieEstimator;