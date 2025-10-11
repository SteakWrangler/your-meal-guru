import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Apple, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatSection } from "@/components/ChatSection";

const DietGuide = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<any>(null);

  const getGuide = async () => {
    if (!preferences.trim()) {
      toast.error("Please enter your dietary preferences or goals");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: {
          preferences: preferences,
          type: "diet-guide"
        },
      });

      if (error) throw error;
      
      setGuide(data);
      toast.success("Diet guide generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate diet guide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 md:gap-3">
            <Apple className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Diet Guide</h1>
          </div>
        </div>

        {/* Input Section */}
        <Card className="p-5 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Tell us about your dietary goals
          </h2>
          <Textarea
            placeholder="E.g., I want to lose weight, build muscle, eat more protein, follow a Mediterranean diet, manage diabetes, etc."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="min-h-[120px] mb-4 text-sm md:text-base"
          />
          <Button
            onClick={getGuide}
            disabled={loading || !preferences.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Guide...
              </>
            ) : (
              "Get Personalized Guide"
            )}
          </Button>
        </Card>

        {/* Guide Results */}
        {guide && (
          <Card className="p-5 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{guide.title}</h2>
            
            {guide.overview && (
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3">Overview</h3>
                <p className="text-sm md:text-base text-muted-foreground">{guide.overview}</p>
              </div>
            )}

            {guide.recommendations && guide.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3">Key Recommendations</h3>
                <ul className="space-y-2">
                  {guide.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm md:text-base">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guide.mealPlan && (
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3">Sample Meal Plan</h3>
                <div className="space-y-4">
                  {Object.entries(guide.mealPlan).map(([meal, details]: [string, any]) => (
                    <div key={meal} className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold capitalize mb-2">{meal}</h4>
                      <p className="text-sm md:text-base">{details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.tips && guide.tips.length > 0 && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">Additional Tips</h3>
                <ul className="space-y-2">
                  {guide.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm md:text-base">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Chat Section */}
        {guide && (
          <ChatSection 
            context={`Diet Guide: ${JSON.stringify(guide)}`}
            systemPrompt="You are a helpful nutrition assistant. Answer questions about the diet guide provided in the context."
            placeholder="Ask about your diet plan..."
          />
        )}
      </div>
    </div>
  );
};

export default DietGuide;
