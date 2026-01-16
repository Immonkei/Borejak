import { supabase } from "@/lib/supabase";

async function uploadEventImage(file) {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const path = `events/${fileName}`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("event-images")
    .getPublicUrl(path);

  return data.publicUrl;
}
