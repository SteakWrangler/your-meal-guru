import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Suggestions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: { type: "suggest" },
      });

      if (error) throw error;

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error: any) {
      console.error("Error getting suggestions:", error);
      toast.error("Failed to get meal suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (meal: string) => {
    navigate("/instructions", { state: { dishName: meal } });
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
            <h1 className="text-3xl font-bold">Meal Suggestions</h1>
            <p className="text-muted-foreground">Can't decide? Let AI inspire you</p>
          </div>
        </div>

        {/* Get Suggestions Button */}
        <Card className="p-8 text-center mb-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-semibold mb-2">Need Inspiration?</h2>
          <p className="text-muted-foreground mb-6">
            Get personalized meal suggestions based on popular dishes and cooking trends
          </p>
          <Button
            onClick={getSuggestions}
            disabled={loading}
            size="lg"
            className="px-8"
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
            <h3 className="text-xl font-semibold mb-4">Here are some ideas:</h3>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-card transition-all cursor-pointer group"
                  onClick={() => handleRecipeClick(suggestion)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium group-hover:text-primary transition-colors">
                        {suggestion}
                      </h4>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Recipe →
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
