import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    // 1. Fetch all mutual matches involving the demo user
    const { data: matches, error: matchesError } = await supabaseAdmin
      .from("matches")
      .select("id, user_one_id, user_two_id, matched_at")
      .or(
        `user_one_id.eq.${DEMO_USER_ID},user_two_id.eq.${DEMO_USER_ID}`
      )
      .order("matched_at", { ascending: false });

    if (matchesError) {
      throw matchesError;
    }

    // 2. Get the IDs of the people matched with the demo user
    const matchedProfileIds = (matches || []).map((match) =>
      match.user_one_id === DEMO_USER_ID
        ? match.user_two_id
        : match.user_one_id
    );

    // 3. Handle empty matches
    if (matchedProfileIds.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        matches: [],
      });
    }

    // 4. Fetch profile details of matched people
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, name, age, photo_url, bio, city, college, interests"
      )
      .in("id", matchedProfileIds);

    if (profilesError) {
      throw profilesError;
    }

    // 5. Combine match information with profile information
    const formattedMatches = (matches || []).map((match) => {
      const profileId =
        match.user_one_id === DEMO_USER_ID
          ? match.user_two_id
          : match.user_one_id;

      return {
        matchId: match.id,
        matchedAt: match.matched_at,
        profile: profiles?.find((p) => p.id === profileId) || null,
      };
    }).filter((match) => match.profile !== null);

    // 6. Return mutual matches only
    return NextResponse.json({
      success: true,
      count: formattedMatches.length,
      matches: formattedMatches,
    });

  } catch (error) {
    console.error("Matches API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch matches.",
      },
      { status: 500 }
    );
  }
}