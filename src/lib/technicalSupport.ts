import { TECHNICAL_SUPPORT_SYSTEM_TEMPLATE } from "@/constants/prompts";
import { StateAnnotation } from "./helpers";
import { model } from "./llm";

export const technicalSupport = async (state: typeof StateAnnotation.State) => {
    
  
    let trimmedHistory = state.messages;
    // Make the user's question the most recent message in the history.
    // This helps small models stay focused.
    if (trimmedHistory.length > 0 && trimmedHistory.at(-1)?._getType() === "ai") {
      trimmedHistory = trimmedHistory.slice(0, -1);
    }
  
    const response = await model.invoke([
      {
        role: "system",
        content: TECHNICAL_SUPPORT_SYSTEM_TEMPLATE,
      },
      ...trimmedHistory,
    ]);
  
    return {
      messages: response,
    };
  };
  