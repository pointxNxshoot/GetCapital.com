import { Client } from "pg";

const client = new Client({ connectionString: process.env.DIRECT_URL });

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'notify_signups'
    ORDER BY ordinal_position
  `);
  console.table(res.rows);
  await client.end();
}

main();
