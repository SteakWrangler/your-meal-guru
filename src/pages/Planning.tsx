import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ChatSection } from "@/components/ChatSection";
import { PrintButton } from "@/components/PrintButton";
import { ShareButton } from "@/components/ShareButton";

interface MealPlan {
  [day: string]: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

const Planning = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("2");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const generateMealPlan = async () => {
    if (!preferences.trim()) {
      toast.error("Please provide some preferences or goals");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: { 
          type: "meal-plan",
          preferences,
          numberOfPeople: parseInt(numberOfPeople),
          dietaryRestrictions
        },
      });

      if (error) {
        console.error("Error generating meal plan:", error);
        toast.error("Failed to generate meal plan. Please check your API configuration.");
        return;
      }

      if (data?.mealPlan) {
        setMealPlan(data.mealPlan);
        toast.success("Meal plan generated!");
      } else {
        toast.error("No meal plan returned. Please try again.");
      }
    } catch (error: any) {
      console.error("Error calling meal plan function:", error);
      toast.error("Failed to connect to the meal planning service.");
    } finally {
      setLoading(false);
    }
  };

  const handleMealClick = (meal: string) => {
    navigate("/instructions", { state: { dishName: meal } });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
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
            <h1 className="text-2xl md:text-3xl font-bold">Meal Planning</h1>
            <p className="text-sm md:text-base text-muted-foreground">Plan your week ahead</p>
          </div>
        </div>

        {/* Input Form */}
        {!mealPlan && (
          <Card className="p-6 md:p-8 mb-6 md:mb-8">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-primary" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-center">AI Meal Prep Assistant</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 text-center">
              Tell us your preferences and we'll create a personalized weekly meal plan
            </p>
            
            <div className="space-y-3 md:space-y-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm md:text-base font-medium mb-2">
                  Number of People
                </label>
                <Input
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  placeholder="2"
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium mb-2">
                  Dietary Restrictions (Optional)
                </label>
                <Input
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="e.g., vegetarian, gluten-free, no dairy"
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm md:text-base font-medium mb-2">
                  Goals & Preferences
                </label>
                <Textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., healthy meals, quick recipes, budget-friendly, high protein, meal variety..."
                  className="min-h-[100px] text-base"
                />
              </div>

              <Button 
                onClick={generateMealPlan} 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Meal Plan...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Generate Weekly Meal Plan
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Weekly Planner */}
        {mealPlan && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">Your Weekly Meal Plan</h2>
              <Button 
                variant="outline" 
                onClick={() => setMealPlan(null)}
                className="w-full sm:w-auto"
                size="sm"
              >
                Create New Plan
              </Button>
            </div>
            <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {daysOfWeek.map((day) => (
                <Card key={day} className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-semibold">{day}</h3>
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  </div>
                  
                  {mealPlan[day] && (
                    <div className="space-y-2 md:space-y-3">
                      <div className="p-2.5 md:p-3 bg-muted rounded-lg">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Breakfast</p>
                        <p 
                          className="text-xs md:text-sm cursor-pointer hover:text-primary transition-colors line-clamp-2"
                          onClick={() => handleMealClick(mealPlan[day].breakfast)}
                        >
                          {mealPlan[day].breakfast}
                        </p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-muted rounded-lg">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Lunch</p>
                        <p 
                          className="text-xs md:text-sm cursor-pointer hover:text-primary transition-colors line-clamp-2"
                          onClick={() => handleMealClick(mealPlan[day].lunch)}
                        >
                          {mealPlan[day].lunch}
                        </p>
                      </div>

                      <div className="p-2.5 md:p-3 bg-muted rounded-lg">
                        <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">Dinner</p>
                        <p 
                          className="text-xs md:text-sm cursor-pointer hover:text-primary transition-colors line-clamp-2"
                          onClick={() => handleMealClick(mealPlan[day].dinner)}
                        >
                          {mealPlan[day].dinner}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {mealPlan && (
          <>
            <div className="flex gap-2">
              <ShareButton
                title="My Weekly Meal Plan"
                text="Check out my meal plan from Your Meal Guru!"
              />
              <PrintButton />
            </div>
            <ChatSection
              context={{ mealPlan, preferences, numberOfPeople, dietaryRestrictions }}
              systemPrompt="You are a helpful cooking assistant. You have access to the user's meal plan to answer specific questions about it, but you can also answer general cooking questions, provide tips, or help with any culinary topics even if they're not directly related to the meal plan shown."
              placeholder="Ask about your meal plan or cooking in general..."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Planning;
