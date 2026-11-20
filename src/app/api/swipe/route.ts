import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { targetId, direction } = body;

    // 1. Validate request
    if (!targetId || !["like", "pass"].includes(direction)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid targetId or swipe direction.",
        },
        { status: 400 }
      );
    }

    if (targetId === DEMO_USER_ID) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot swipe on yourself.",
        },
        { status: 400 }
      );
    }

    // 2. Check whether target profile exists
    const { data: targetProfile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, name")
        .eq("id", targetId)
        .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!targetProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found.",
        },
        { status: 404 }
      );
    }

    // 3. Save the user's swipe
    const { error: swipeError } = await supabaseAdmin
      .from("swipes")
      .upsert(
        {
          swiper_id: DEMO_USER_ID,
          target_id: targetId,
          direction,
        },
        {
          onConflict: "swiper_id,target_id",
        }
      );

    if (swipeError) {
      throw swipeError;
    }

    // 4. A pass cannot create a match
    if (direction === "pass") {
      return NextResponse.json({
        success: true,
        matched: false,
        message: "Profile passed successfully.",
      });
    }

    // 5. Check whether the other person has already liked the demo user
    const { data: reciprocalLike, error: reciprocalError } =
      await supabaseAdmin
        .from("swipes")
        .select("id")
        .eq("swiper_id", targetId)
        .eq("target_id", DEMO_USER_ID)
        .eq("direction", "like")
        .maybeSingle();

    if (reciprocalError) {
      throw reciprocalError;
    }

    // 6. No mutual like yet
    if (!reciprocalLike) {
      return NextResponse.json({
        success: true,
        matched: false,
        message: "Like recorded successfully.",
      });
    }

    // 7. Both users liked each other: create a match
    const [userOneId, userTwoId] = [
      DEMO_USER_ID,
      targetId,
    ].sort();

    const { error: matchError } = await supabaseAdmin
      .from("matches")
      .upsert(
        {
          user_one_id: userOneId,
          user_two_id: userTwoId,
        },
        {
          onConflict: "user_one_id,user_two_id",
          ignoreDuplicates: true,
        }
      );

    if (matchError) {
      throw matchError;
    }

    // 8. Return match confirmation
    return NextResponse.json({
      success: true,
      matched: true,
      message: "It's a match!",
      profile: targetProfile,
    });

  } catch (error) {
    console.error("Swipe API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process swipe.",
      },
      { status: 500 }
    );
  }
}