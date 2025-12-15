import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handlePrint}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] md:bottom-8 md:left-8 rounded-full w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-lg z-50 print:hidden"
            size="icon"
          >
            <Printer className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Print this page</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
