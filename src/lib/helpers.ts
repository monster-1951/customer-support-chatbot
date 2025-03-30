// src/lib/helpers.ts
import nodemailer from "nodemailer";

import { NodeInterrupt } from "@langchain/langgraph";

import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";


const sendEmail = async (userEmail: string, userMobile: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.BILLING_SUPPORT_EMAIL,
    subject: "Refund Request from Customer",
    text: `A refund request requires human authorization.\n\nCustomer Details:\nEmail: ${userEmail}\nPhone: ${userMobile}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  nextRepresentative: Annotation<string>,
  refundAuthorized: Annotation<boolean>,
});

export const FormatTheResponse = {
  name: "categorize_interaction",
  parameters: {
    type: "object",
    properties: {
      nextRepresentative: {
        type: "string",
        enum: ["BILLING", "TECHNICAL", "RESPOND"],
        description: "The category of the customer support response.",
      },
    },
    required: ["nextRepresentative"],
  },
};

export const FormatBillingTheResponse = {
  name: "categorize_interaction",
  parameters: {
    type: "object",
    properties: {
      nextRepresentative: {
        type: "string",
        enum: ["REFUND", "RESPOND"],
        description: "The category of the customer support response.",
      },
    },
    required: ["nextRepresentative"],
  },
};

export const handleRefund = async (state: typeof StateAnnotation.State) => {
  if (!state.refundAuthorized) {
    console.log("--- HUMAN AUTHORIZATION REQUIRED FOR REFUND ---");

    const session = await getServerSession(authOptions);
    console.log("Session----------");
    console.log(session);
    await sendEmail(session?.user.email, session?.user.mobilenumber);
    throw new NodeInterrupt("Human authorization required.");
  }
  console.log("--- Processing refund ---");

  return {
    messages: {
      role: "assistant",
      content: "Refund processed!",
    },
  };
};
