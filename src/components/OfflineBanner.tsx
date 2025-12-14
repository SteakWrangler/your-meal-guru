import { WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OfflineBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="ml-2">
          You're offline. Some features may not be available.
        </AlertDescription>
      </Alert>
    </div>
  );
}
