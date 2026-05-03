import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const sql = readFileSync(join(__dirname, "triggers.sql"), "utf-8");

  // Split on semicolons but respect $$ blocks
  const statements = splitSQL(sql);

  for (const stmt of statements) {
    const trimmed = stmt.trim();
    if (!trimmed || trimmed.startsWith("--")) continue;
    try {
      await prisma.$executeRawUnsafe(trimmed);
      console.log("✓", trimmed.substring(0, 60).replace(/\n/g, " ") + "...");
    } catch (e: any) {
      console.error("✗ Error:", e.message);
      console.error("  Statement:", trimmed.substring(0, 100));
    }
  }
}

function splitSQL(sql: string): string[] {
  const results: string[] = [];
  let current = "";
  let inDollarQuote = false;

  const lines = sql.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("--") && !inDollarQuote) continue;

    if (line.includes("$$")) {
      const count = (line.match(/\$\$/g) || []).length;
      if (count % 2 === 1) {
        inDollarQuote = !inDollarQuote;
      }
    }

    current += line + "\n";

    if (!inDollarQuote && line.trimEnd().endsWith(";")) {
      results.push(current.trim());
      current = "";
    }
  }

  if (current.trim()) results.push(current.trim());
  return results;
}

main()
  .then(() => {
    console.log("\nAll triggers applied.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
