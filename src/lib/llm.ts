// 'src/lib/llm.ts'
import { ChatOpenAI } from "@langchain/openai";
import { FormatBillingTheResponse, FormatTheResponse } from "./helpers";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
  // other params...
});

const modelWithFormatResponse = model.bindTools([
  {
    type: "function",
    function: FormatTheResponse,
    description:
      "Categorize the conversation into: \n- BILLING (for payments, subscriptions, refunds)\n- TECHNICAL (for hardware/software issues, troubleshooting, and product defects)\n- RESPOND (for general inquiries).",
  },
]);

const modelWithBillngFormatResponse = model.bindTools([
  {
    type: "function",
    function: FormatBillingTheResponse,
    description:
      "Categorize the conversation into REFUND, or RESPOND.",
  },
]);

// console.log("modelWithFormatResponse:", modelWithFormatResponse);

export { modelWithFormatResponse, model,modelWithBillngFormatResponse }; // Explicitly export it
