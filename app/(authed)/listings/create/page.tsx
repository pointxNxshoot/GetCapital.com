import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Wizard } from "@/components/listing/create/wizard";

export const metadata = {
  title: "Create Listing",
};

export default async function CreateListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/signin");

  return <Wizard />;
}
