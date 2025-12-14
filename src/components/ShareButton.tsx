import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { share } from "@/lib/mobile";
import { toast } from "sonner";
import { haptics } from "@/lib/mobile";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    const result = await share.content({
      title: title || "Kitchen Companion",
      text: text || "Check out this recipe from Kitchen Companion!",
      url: url || window.location.href,
      dialogTitle: "Share Recipe",
    });

    if (result.success) {
      haptics.success();
    } else {
      // Fallback: copy to clipboard
      try {
        const shareText = `${title || "Kitchen Companion"}\n\n${text || ""}\n\n${url || window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied to clipboard!");
        haptics.success();
      } catch (error) {
        toast.error("Unable to share");
        haptics.error();
      }
    }
  };

  // Only show share button if sharing is available
  if (!share.canShare()) {
    return null;
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}
