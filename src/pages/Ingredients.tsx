import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

const Ingredients = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState("");

  const handleAnalyze = () => {
    if (!ingredients.trim()) {
      toast.error("Please enter some ingredients");
      return;
    }
    toast.info("Image analysis feature coming soon! For now, try the text input.");
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
            <h1 className="text-3xl font-bold">What Can I Make?</h1>
            <p className="text-muted-foreground">Discover recipes from your ingredients</p>
          </div>
        </div>

        {/* Photo Upload */}
        <Card className="p-8 text-center mb-6">
          <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Take a Photo</h3>
          <p className="text-muted-foreground mb-4">
            Snap a picture of your fridge or pantry (Coming Soon)
          </p>
          <Button variant="outline" disabled>
            <Camera className="w-5 h-5 mr-2" />
            Upload Photo
          </Button>
        </Card>

        {/* Manual Input */}
        <Card className="p-8">
          <h3 className="text-xl font-semibold mb-4">Or List Your Ingredients</h3>
          <Textarea
            placeholder="Enter ingredients separated by commas&#10;Example: chicken, tomatoes, garlic, pasta, olive oil"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="min-h-[150px] mb-4"
          />
          <Button onClick={handleAnalyze} className="w-full">
            Find Recipes
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Ingredients;
