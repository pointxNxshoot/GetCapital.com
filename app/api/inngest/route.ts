import { serve } from "inngest/next";
import { inngest } from "@/platform/jobs/inngest";
import { helloWorld } from "@/platform/jobs/functions/hello";

// Serve all Inngest functions on this endpoint
// Add new functions to this array as you build them
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});
