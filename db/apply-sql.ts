import { Client } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function main() {
  await client.connect();
  const sql = readFileSync(join(__dirname, process.argv[2] || "triggers.sql"), "utf-8");

  // Execute the whole file as one statement (Postgres handles multiple statements)
  try {
    await client.query(sql);
    console.log("✓ SQL applied successfully.");
  } catch (e: any) {
    console.error("✗ Error:", e.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
