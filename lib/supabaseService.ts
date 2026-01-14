import { supabase } from "./supabaseClient";

/* =======================================
   SUPABASE SERVICE WRAPPER
   ======================================= */

export const SupabaseService = {
  /* --------------------------
     CEK SUDAH ABSEN HARI INI
     -------------------------- */
  async hasAttendanceToday(guardianId: number, eventName: string) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const { data } = await supabase
      .from("attendances")
      .select("*")
      .eq("guardian_id", guardianId)
      .eq("event_name", eventName)
      .gte("scanned_at", start.toISOString())
      .lt("scanned_at", end.toISOString())
      .maybeSingle();

    return data !== null;
  },

  /* --------------------------
     GET GUARDIAN BY ID
     -------------------------- */
  async getGuardianById(id_wali: number) {
    const { data } = await supabase
      .from("guardians")
      .select("*")
      .eq("id_wali", id_wali)
      .maybeSingle();

    return data;
  },

  /* --------------------------
     INSERT KEHADIRAN
     -------------------------- */
  async insertAttendance(guardianId: number, eventName: string) {
    await supabase.from("attendances").insert({
      guardian_id: guardianId,
      event_name: eventName,
    });
  },

  /* --------------------------
     TOTAL WALI
     -------------------------- */
  async getTotalGuardians() {
    const { data } = await supabase.from("guardians").select("id_wali");
    return data?.length ?? 0;
  },

  /* --------------------------
     TOTAL HADIR
     -------------------------- */
  async getTotalAttendances() {
    const { data } = await supabase.from("attendances").select("id");
    return data?.length ?? 0;
  },

  /* --------------------------
     LIST HADIR
     -------------------------- */
  async getPresentGuardians() {
    const { data } = await supabase
      .from("attendances")
      .select("guardian_id, scanned_at, event_name, guardians(*)")
      .order("scanned_at", { ascending: false });

    return data ?? [];
  },

  /* --------------------------
     LIST TIDAK HADIR
     -------------------------- */
  async getAbsentGuardians() {
    // ambil ID wali yang hadir
    const { data: present } = await supabase
      .from("attendances")
      .select("guardian_id");

    const presentIds = present?.map((p) => p.guardian_id) ?? [];

    // ambil wali yang ID-nya tidak ada dalam attendances
    const { data: absent } = await supabase
      .from("guardians")
      .select("*")
      .not("id_wali", "in", presentIds)
      .order("id_wali");

    return absent ?? [];
  },
};
