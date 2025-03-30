// src/lib/builder.ts
import { StateGraph } from "@langchain/langgraph";
import { handleRefund, StateAnnotation } from "./helpers";
import { initialSupport } from "./initialSupport";
import { MemorySaver } from "@langchain/langgraph";
import { billingSupport } from "./billingSupport";
import { technicalSupport } from "./technicalSupport";

let builder = new StateGraph(StateAnnotation)
  .addNode("initial_support", initialSupport)
  .addNode("billing_support", billingSupport)
  .addNode("technical_support", technicalSupport)
  .addNode("handle_refund", handleRefund)
  .addEdge("__start__", "initial_support");

builder = builder.addConditionalEdges(
  "initial_support",
  async (state: typeof StateAnnotation.State) => {
    if (state.nextRepresentative.includes("BILLING")) {
      return "billing";
    } else if (state.nextRepresentative.includes("TECHNICAL")) {
      return "technical";
    } else {
      return "conversational";
    }
  },
  {
    billing: "billing_support",
    technical: "technical_support",
    conversational: "__end__",
  }
);

console.log("Added edges!");

builder = builder
  .addEdge("technical_support", "__end__")
  .addConditionalEdges(
    "billing_support",
    async (state) => {
      console.log("Billing Support State Before Transition:", state); // 🔍 Debug
  
      if (state.nextRepresentative === "REFUND") {
        console.log("Transitioning to handle_refund"); // 🔍 Debug
        return "handle_refund";
      } else {
        console.log("Ending conversation"); // 🔍 Debug
        return "__end__";
      }
    },
    {
      handle_refund: "handle_refund",
      __end__: "__end__",
    }
  ).addEdge("handle_refund", "__end__");

console.log("Added edges!");

const checkpointer = new MemorySaver();

export const graph = builder.compile({
  checkpointer,
});
