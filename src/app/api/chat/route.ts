// src/app/api/chat/route.ts
import { graph } from "@/lib/builder";

export async function POST(req: Request) {
  const { UserMessage } = await req.json();

  try {
    console.log("User Input:", UserMessage);

    let steps: any[] = [];

    const stream = await graph.stream(
      {
        messages: [
          {
            role: "user",
            content: UserMessage, // Use actual user message
          },
        ],
      },
      {
        configurable: {
          thread_id: "refund_testing_id",
        },
      }
    );

    for await (const value of stream) {
      console.log("---STEP---");
      console.log(value);
      console.log("---END STEP---");

      // Push structured step data
      steps.push(value);
    }

    const currentState = await graph.getState({
      configurable: { thread_id: "refund_testing_id" },
    });

    console.log("CURRENT TASKS", JSON.stringify(currentState.tasks, null, 2));
    console.log("NEXT TASKS", currentState.next);

    // Extract messages and nextRepresentative properly from tasks
    const extractedTasks = currentState.tasks.map((task: any) => {
      return {
        node: task.node, // Task name (e.g., "initial_support", "billing_support")
        messages: task.state?.messages ?? [], // Extract messages safely
        nextRepresentative: task.state?.nextRepresentative ?? null, // Extract nextRepresentative safely
      };
    });

    return Response.json({
      steps, // Contains all structured steps
      currentState: extractedTasks, // Extracted tasks for easier frontend rendering
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({
      error: "Internal Server Error",
      status: 500,
    });
  }
} 