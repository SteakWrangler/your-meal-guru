import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";

const Planning = () => {
  const navigate = useNavigate();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleAddMeal = (day: string) => {
    toast.info("Meal planning feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <h1 className="text-3xl font-bold">Meal Planning</h1>
            <p className="text-muted-foreground">Plan your week ahead</p>
          </div>
        </div>

        {/* Weekly Planner */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {daysOfWeek.map((day) => (
            <Card key={day} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{day}</h3>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Breakfast</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-left justify-start"
                    onClick={() => handleAddMeal(day)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add meal
                  </Button>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Lunch</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-left justify-start"
                    onClick={() => handleAddMeal(day)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add meal
                  </Button>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Dinner</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-left justify-start"
                    onClick={() => handleAddMeal(day)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add meal
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planning;
