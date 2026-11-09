import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORE_PATH = path.join(process.cwd(), "data", "cms_store.json");

async function readLocalStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      site_settings: {},
      services: [],
      projects: [],
      commissions: []
    };
  }
}

export async function GET() {
  const localStore = await readLocalStore();

  if (isSupabaseConfigured && supabase) {
    try {
      const [settingsRes, servicesRes, projectsRes, commissionsRes] =
        await Promise.all([
          supabase.from("site_settings").select("*").eq("id", "default").single(),
          supabase.from("services").select("*").order("sort_order"),
          supabase.from("projects").select("*").order("sort_order"),
          supabase
            .from("commissions")
            .select("*")
            .order("created_at", { ascending: false })
        ]);

      return NextResponse.json({
        ...localStore,
        site_settings: settingsRes.data || localStore.site_settings,
        services:
          servicesRes.data && servicesRes.data.length > 0
            ? servicesRes.data
            : localStore.services,
        projects:
          projectsRes.data && projectsRes.data.length > 0
            ? projectsRes.data
            : localStore.projects,
        commissions:
          commissionsRes.data && commissionsRes.data.length > 0
            ? commissionsRes.data
            : localStore.commissions
      });
    } catch {
      // Fallback to local store
    }
  }

  return NextResponse.json(localStore);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(body, null, 2), "utf-8");

    if (isSupabaseConfigured && supabase) {
      if (body.site_settings) {
        await supabase
          .from("site_settings")
          .upsert({ id: "default", ...body.site_settings });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 400 }
    );
  }
}
