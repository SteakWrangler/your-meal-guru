import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatSection } from "@/components/ChatSection";
import { PrintButton } from "@/components/PrintButton";

const Suggestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Check if suggestions were passed from Ingredients page
    if (location.state?.suggestions) {
      setSuggestions(location.state.suggestions);
    }
  }, [location.state]);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: { type: "suggest", forceRegenerate: true },
      });

      if (error) {
        console.error("Error getting suggestions:", error);
        toast.error("Failed to get meal suggestions. Please check your API configuration.");
        return;
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        toast.error("No suggestions returned. Please try again.");
      }
    } catch (error: any) {
      console.error("Error calling meal suggestions:", error);
      toast.error("Failed to connect to the meal suggestions service.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (meal: string) => {
    navigate("/instructions", { state: { dishName: meal } });
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
            <h1 className="text-2xl md:text-3xl font-bold">Meal Suggestions</h1>
            <p className="text-sm md:text-base text-muted-foreground">Can't decide? Let AI inspire you</p>
          </div>
        </div>

        {/* Get Suggestions Button */}
        <Card className="p-6 md:p-8 text-center mb-6 md:mb-8">
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-primary" />
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Need Inspiration?</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
            Get personalized meal suggestions based on popular dishes and cooking trends
          </p>
          <Button
            onClick={getSuggestions}
            disabled={loading}
            size="lg"
            className="px-6 md:px-8 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Getting Ideas...
              </>
            ) : (
              "Get Meal Ideas"
            )}
          </Button>
        </Card>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Here are some ideas:</h3>
            <div className="grid gap-3 md:gap-4">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="p-4 md:p-6 hover:shadow-card transition-all cursor-pointer group"
                  onClick={() => handleRecipeClick(suggestion)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-medium group-hover:text-primary transition-colors truncate">
                        {suggestion}
                      </h4>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0 text-xs md:text-sm">
                      View →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <>
            <PrintButton />
            <ChatSection
              context={{ suggestions }}
              systemPrompt="You are a helpful cooking assistant. You have access to these meal suggestions to answer questions about them, but you can also provide cooking tips, recipe ideas, and answer general culinary questions beyond what's shown here."
              placeholder="Ask about these suggestions or cooking in general..."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
