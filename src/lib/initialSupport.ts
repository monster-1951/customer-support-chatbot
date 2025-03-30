// src/lib/initialSupport.ts
import {
  CATEGORIZATION_HUMAN_TEMPLATE,
  CATEGORIZATION_SYSTEM_TEMPLATE,
  SYSTEM_TEMPLATE,
} from "@/constants/prompts";
import {  StateAnnotation } from "./helpers";
import { model, modelWithFormatResponse } from "./llm";

export const initialSupport = async (state: typeof StateAnnotation.State) => {
  const supportResponse = await model.invoke([
    { role: "system", content: SYSTEM_TEMPLATE },
    ...state.messages,
  ]);

  const categorizationResponse = await modelWithFormatResponse.invoke([
    {
      role: "system",
      content: CATEGORIZATION_SYSTEM_TEMPLATE,
    },
    ...state.messages,
    {
      role: "user",
      content: CATEGORIZATION_HUMAN_TEMPLATE,
    },
  ]);
  const categorizationOutput =
    categorizationResponse.tool_calls?.[0]?.args;
  console.log(categorizationOutput?.nextRepresentative);
  if (!categorizationOutput || !categorizationOutput.nextRepresentative) {
    throw new Error(
      "Categorization response is invalid or missing nextRepresentative."
    );
  }

  // Now use categorizationOutput.nextRepresentative safely
  return {
    messages: [supportResponse],
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
};
