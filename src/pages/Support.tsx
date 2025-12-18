import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, FileText } from "lucide-react";

const Support = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl md:text-3xl font-bold">Support</h1>
            <p className="text-sm md:text-base text-muted-foreground">We're here to help</p>
          </div>
        </div>

        {/* Contact Card */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Get in Touch</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Have a question, suggestion, or need help? We'd love to hear from you!
          </p>
          <a
            href="mailto:linksmarttechllc@gmail.com"
            className="inline-block"
          >
            <Button size="lg" className="gap-2">
              <Mail className="w-5 h-5" />
              Email Us
            </Button>
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            Email:{" "}
            <a
              href="mailto:linksmarttechllc@gmail.com"
              className="text-primary hover:underline"
            >
              linksmarttechllc@gmail.com
            </a>
          </p>
        </Card>

        {/* FAQ Card */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How do I scan ingredients?</h3>
              <p className="text-muted-foreground text-sm">
                Use the "What Can I Make?" feature on the home screen. You can either take a photo of your ingredients or select an existing photo from your library. Our AI will analyze the image and suggest recipes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I customize my meal plans?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! When generating a meal plan, you can specify the number of people, dietary restrictions, and your preferences. The AI will create a personalized plan based on your input.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground text-sm">
                Absolutely. We take your privacy seriously. Photos you take are processed temporarily and not stored. Read our{" "}
                <button
                  onClick={() => navigate("/privacy")}
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </button>{" "}
                for more details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Does the app work offline?</h3>
              <p className="text-muted-foreground text-sm">
                The app requires an internet connection to generate recipes and meal plans using AI. However, you can view previously generated content offline.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How accurate is the nutrition information?</h3>
              <p className="text-muted-foreground text-sm">
                Our AI provides estimates based on standard nutritional data. These are approximations and should not be used as a substitute for professional medical or nutritional advice. Always consult with a healthcare professional for personalized guidance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I share my meal plans?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Use the share button on your meal plan to share it via your device's native sharing options (text, email, social media, etc.).
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Resources */}
        <Card className="p-6 md:p-8 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Additional Resources</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/privacy")}
              className="block text-primary hover:underline"
            >
              Privacy Policy →
            </button>
            <a
              href="https://yourmealguru.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary hover:underline"
            >
              Visit Our Website →
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Support;
