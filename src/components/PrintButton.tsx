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
            className="fixed bottom-4 left-4 md:bottom-8 md:left-8 rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg z-50 print:hidden"
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
