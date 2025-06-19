
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const HelpButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        className="bg-black hover:bg-gray-800 text-white font-medium shadow-lg rounded-full px-4 py-3 h-auto"
        onClick={() => console.log("Help clicked")}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        NEED HELP?
      </Button>
    </div>
  );
};

export default HelpButton;
