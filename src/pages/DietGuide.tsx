import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Apple } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DietGuide = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dietInfo, setDietInfo] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!dietInfo.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your current diet",
      });
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const { data, error } = await supabase.functions.invoke('meal-suggestions', {
        body: { 
          type: 'nutrition-analysis',
          dietInfo: dietInfo.trim()
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your nutritional analysis is ready",
      });
    } catch (error) {
      console.error('Error analyzing diet:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your diet. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-accent/10 mb-4">
            <Apple className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nutrition Analysis</h1>
          <p className="text-muted-foreground">
            Discover what might be missing in your diet
          </p>
        </div>

        <Card className="p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            What Are You Currently Eating?
          </label>
          <p className="text-sm text-muted-foreground mb-4">
            Be as general or specific as you like - e.g., "I'm eating carnivore" or provide your detailed weekly meal plan
          </p>
          <Textarea
            placeholder="Example: I'm eating carnivore... or list your typical meals for the week"
            value={dietInfo}
            onChange={(e) => setDietInfo(e.target.value)}
            className="min-h-[150px] mb-4"
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Your Diet...
              </>
            ) : (
              "Analyze My Diet"
            )}
          </Button>
        </Card>

        {analysis && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Nutritional Analysis</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {analysis}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DietGuide;
