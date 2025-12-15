import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSectionProps {
  context: any;
  systemPrompt: string;
  placeholder?: string;
}

export const ChatSection = ({ context, systemPrompt, placeholder = "Ask me anything..." }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("meal-suggestions", {
        body: {
          type: "chat",
          message: input,
          context,
          systemPrompt,
          history: messages,
        },
      });

      if (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to get response. Please try again.");
        return;
      }

      if (data?.response) {
        const assistantMessage: Message = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Error calling chat function:", error);
      toast.error("Failed to connect to chat service.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] md:bottom-8 md:right-8 rounded-full w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 shadow-lg z-50 print:hidden"
              size="icon"
            >
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ask questions about this page</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] md:bottom-8 md:right-8 w-[calc(100vw-2rem)] max-w-sm md:max-w-96 h-[60vh] sm:h-[65vh] md:h-[500px] max-h-[600px] flex flex-col shadow-xl z-50 print:hidden">
      <div className="p-3 md:p-4 border-b flex items-center justify-between flex-shrink-0">
        <h3 className="text-sm md:text-base font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
          AI Assistant
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          ✕
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-6 sm:py-8 space-y-2">
            <p className="text-sm md:text-base font-medium">👋 I'm here to help!</p>
            <p className="text-xs md:text-sm">Ask me questions about what you're viewing, or anything else you'd like to know.</p>
          </div>
        )}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 md:p-3 text-sm md:text-base break-words ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-2.5 md:p-3">
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 md:p-4 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
            className="text-sm md:text-base"
          />
          <Button onClick={sendMessage} disabled={loading} size="icon" className="flex-shrink-0">
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
