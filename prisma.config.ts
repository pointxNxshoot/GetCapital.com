import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "db", "schema.prisma"),
  datasource: {
    url: process.env.DIRECT_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
