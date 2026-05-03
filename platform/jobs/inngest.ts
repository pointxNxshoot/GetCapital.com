import { Inngest } from "inngest";

// Single Inngest client for the entire app
// All modules register their functions using this client
export const inngest = new Inngest({ id: "capital" });
