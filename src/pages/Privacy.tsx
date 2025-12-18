import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
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
            <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
            <p className="text-sm md:text-base text-muted-foreground">Last Updated: December 14, 2024</p>
          </div>
        </div>

        {/* Content */}
        <Card className="p-6 md:p-8">
          <div className="prose prose-sm md:prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              Your Meal Guru ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">Information We Collect</h2>
            <h3 className="text-lg font-semibold mb-3">Camera and Photo Library Access</h3>
            <p className="mb-4">
              We request access to your device's camera and photo library solely for the purpose of allowing you to scan or select ingredient photos. These images are processed temporarily to identify ingredients and generate recipe suggestions. We do not store, share, or use these images for any other purpose.
            </p>

            <h3 className="text-lg font-semibold mb-3">Usage Information</h3>
            <p className="mb-4">
              We may collect information about how you use the app, including the features you access, recipes you view, and meal plans you create. This information is used solely to improve our AI-powered services and provide you with better recommendations.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">How We Use Your Information</h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Generate personalized recipe suggestions based on your ingredients</li>
              <li>Create customized meal plans based on your dietary preferences</li>
              <li>Provide nutrition analysis and calorie estimates</li>
              <li>Improve our AI algorithms and app functionality</li>
              <li>Respond to your support requests</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 mt-6">Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services to provide our features:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>OpenAI</strong>: For AI-powered recipe generation, meal planning, and nutrition advice</li>
              <li><strong>Supabase</strong>: For secure data storage and user authentication</li>
            </ul>
            <p className="mb-4">
              These services have their own privacy policies and we encourage you to review them. We only share the minimum necessary information with these services to provide our features.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Withdraw consent for data processing</li>
              <li>Revoke camera and photo library permissions at any time through your device settings</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 mt-6">Children's Privacy</h2>
            <p className="mb-4">
              Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">Health Information Disclaimer</h2>
            <p className="mb-4">
              This app provides general nutrition and dietary information for educational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or health condition. Always consult with a qualified healthcare professional before making significant changes to your diet or lifestyle.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy. Your continued use of the app after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-xl font-semibold mb-4 mt-6">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mb-4">
              <strong>Email:</strong>{" "}
              <a href="mailto:linksmarttechllc@gmail.com" className="text-primary hover:underline">
                linksmarttechllc@gmail.com
              </a>
            </p>
            <p className="mb-4">
              <strong>Website:</strong>{" "}
              <a href="https://yourmealguru.com" className="text-primary hover:underline">
                yourmealguru.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
