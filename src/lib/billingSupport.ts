import { BILLING_SUPPORT_CATEGORIZATION_SYSTEM_TEMPLATE, BILLING_SUPPORT_SYSTEM_TEMPLATE } from "@/constants/prompts";
import { model, modelWithBillngFormatResponse, modelWithFormatResponse } from "./llm";
import { StateAnnotation } from "./helpers";

export const billingSupport = async (state: typeof StateAnnotation.State) => {
  console.log("Billing Support Triggered with State:", state); // 🔍 Debug

  let trimmedHistory = state.messages;
  if (trimmedHistory.length > 0 && trimmedHistory.at(-1)?._getType() === "ai") {
    trimmedHistory = trimmedHistory.slice(0, -1);
  }

  const billingRepResponse = await model.invoke([
    {
      role: "system",
      content: BILLING_SUPPORT_SYSTEM_TEMPLATE,
    },
    ...trimmedHistory,
  ]);

  console.log("Billing Rep Response:", billingRepResponse); // 🔍 Debug

  const CATEGORIZATION_HUMAN_TEMPLATE = `The following text is a response from a customer support representative.
    Extract whether they want to refund the user or not.
    Respond with a JSON object containing a single key called "nextRepresentative" with one of the following values:
    
    If they want to refund the user, respond only with the word "REFUND".
    Otherwise, respond only with the word "RESPOND".
    
    Here is the text:
    
    <text>
    ${billingRepResponse.content}
    </text>.`;

  const categorizationResponse = await modelWithBillngFormatResponse.invoke([
    {
      role: "system",
      content: BILLING_SUPPORT_CATEGORIZATION_SYSTEM_TEMPLATE,
    },
    {
      role: "user",
      content: CATEGORIZATION_HUMAN_TEMPLATE,
    },
  ]);

  console.log("Categorization Response:", categorizationResponse); // 🔍 Debug

  const categorizationOutput = categorizationResponse.tool_calls?.[0]?.args;
  console.log("Extracted nextRepresentative:", categorizationOutput?.nextRepresentative); // 🔍 Debug

  if (!categorizationOutput || !categorizationOutput.nextRepresentative) {
    throw new Error("Categorization response is invalid or missing nextRepresentative.");
  }

  return {
    messages: billingRepResponse,
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
};
