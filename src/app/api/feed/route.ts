import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    // 1. Fetch profiles already swiped by the demo user
    const { data: swipes, error: swipesError } = await supabaseAdmin
      .from("swipes")
      .select("target_id")
      .eq("swiper_id", DEMO_USER_ID);

    if (swipesError) {
      throw swipesError;
    }

    // 2. Collect IDs of already-swiped profiles
    const swipedIds = new Set(
      (swipes || []).map((swipe) => swipe.target_id)
    );

    // 3. Fetch all profiles except the demo user
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, name, age, photo_url, bio, city, college, interests"
      )
      .neq("id", DEMO_USER_ID)
      .order("created_at", { ascending: true });

    if (profilesError) {
      throw profilesError;
    }

    // 4. Remove profiles that have already been swiped
    const feed = (profiles || []).filter(
      (profile) => !swipedIds.has(profile.id)
    );

    // 5. Return remaining profiles
    return NextResponse.json({
      success: true,
      count: feed.length,
      profiles: feed,
    });
  } catch (error) {
    console.error("Feed API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch discover feed.",
      },
      { status: 500 }
    );
  }
}