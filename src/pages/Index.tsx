import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChefHat, Lightbulb, Camera, Target, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-cooking.jpg";

const Index = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: "ingredients",
      title: "What Can I Make?",
      description: "Snap ingredients or list them to discover recipes",
      icon: Camera,
      color: "primary",
      route: "/ingredients",
    },
    {
      id: "instructions",
      title: "Recipe Instructions",
      description: "Step-by-step guides for any dish",
      icon: ChefHat,
      color: "secondary",
      route: "/instructions",
    },
    {
      id: "suggestions",
      title: "Meal Suggestions",
      description: "Get inspired with personalized meal ideas",
      icon: Lightbulb,
      color: "accent",
      route: "/suggestions",
    },
    {
      id: "recreate",
      title: "Recreate Dishes",
      description: "Make your favorite restaurant dishes at home",
      icon: Target,
      color: "primary",
      route: "/recreate",
    },
    {
      id: "planning",
      title: "Meal Planning",
      description: "Plan and prep your weekly meals",
      icon: Calendar,
      color: "secondary",
      route: "/planning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Fresh cooking ingredients" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-3 drop-shadow-lg">
            Forkcast
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 max-w-2xl drop-shadow">
            From ingredients to table - AI-powered cooking made simple
          </p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className="p-6 hover:shadow-card transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                onClick={() => navigate(mode.route)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl bg-${mode.color}/10 group-hover:bg-${mode.color}/20 transition-colors`}>
                    <Icon className={`w-8 h-8 text-${mode.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{mode.title}</h3>
                    <p className="text-muted-foreground text-sm">{mode.description}</p>
                  </div>
                  <Button 
                    variant={mode.color === "primary" ? "default" : mode.color === "secondary" ? "secondary" : "outline"}
                    className="w-full mt-2"
                  >
                    Get Started
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>Powered by AI • All your cooking needs in one place</p>
      </div>
    </div>
  );
};

export default Index;
