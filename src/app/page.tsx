"use client";

import { useEffect, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useAnimationControls,
} from "framer-motion";

import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";

// ============================================
// TYPES
// ============================================

type Profile = {
  id: string;
  name: string;
  age: number;
  photo_url: string | null;
  bio: string;
  city: string;
  college: string;
  interests: string[];
};

type Match = {
  matchId: string;
  matchedAt: string;
  profile: Profile;
};

// ============================================
// CONSTANTS
// ============================================

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  const [activeTab, setActiveTab] = useState("Discover");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const [error, setError] = useState("");

  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | null
  >(null);

  const [isSwiping, setIsSwiping] = useState(false);

  const [matchedProfile, setMatchedProfile] =
    useState<Profile | null>(null);

  const controls = useAnimationControls();

  const isAnimating = useRef(false);

  const currentProfile = profiles[0];

  // ============================================
  // FETCH DISCOVER FEED
  // ============================================

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/feed");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load profiles.");
      }

      setProfiles(data.profiles || []);

    } catch (err) {
      console.error("Feed Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading profiles."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH MUTUAL MATCHES
  // ============================================

  const fetchMatches = async () => {
    try {
      setMatchesLoading(true);

      const response = await fetch("/api/matches");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load matches.");
      }

      setMatches(data.matches || []);

    } catch (err) {
      console.error("Matches Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your matches."
      );

    } finally {
      setMatchesLoading(false);
    }
  };

  // ============================================
  // INITIAL DATA LOADING
  // ============================================

  useEffect(() => {
    fetchFeed();
  }, []);

  // Fetch matches whenever the Matches tab is opened.

  useEffect(() => {
    if (activeTab === "Matches") {
      fetchMatches();
    }
  }, [activeTab]);

  // ============================================
  // HANDLE SWIPING
  // ============================================

  const handleSwipe = async (
    direction: "left" | "right"
  ) => {
    if (!currentProfile || isAnimating.current || matchedProfile) {
      return;
    }

    isAnimating.current = true;
    setIsSwiping(true);

    setError("");
    setSwipeDirection(direction);

    try {
      // 1. Show the swipe feedback animation.

      await wait(700);

      // 2. Send the swipe to our backend.

      const response = await fetch("/api/swipe", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          targetId: currentProfile.id,
          direction: direction === "right" ? "like" : "pass",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Swipe failed.");
      }

      // 3. Animate the current profile away.

      await controls.start({
        x: direction === "right" ? 850 : -850,
        rotate: direction === "right" ? 30 : -30,
        opacity: 0,
        scale: 0.9,

        transition: {
          type: "spring",
          stiffness: 120,
          damping: 20,
          mass: 0.8,
        },
      });

      // 4. Remove the swiped profile from the feed.

      setProfiles((previousProfiles) =>
        previousProfiles.filter(
          (profile) => profile.id !== currentProfile.id
        )
      );

      setSwipeDirection(null);

      // 5. Reset animation controls.

      controls.set({
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
      });

      // 6. Handle mutual matches.

      if (data.matched) {
        setMatchedProfile(data.profile || currentProfile);

        // Refresh matches from the database.

        await fetchMatches();
      }

    } catch (err) {
      console.error("Swipe Error:", err);

      setSwipeDirection(null);

      // Bring the card back if the API request fails.

      await controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,

        transition: {
          type: "spring",
          stiffness: 180,
          damping: 20,
        },
      });

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );

    } finally {
      isAnimating.current = false;
      setIsSwiping(false);
    }
  };

  // ============================================
  // HANDLE DRAG GESTURES
  // ============================================

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    if (isAnimating.current) return;

    if (info.offset.x > 100) {
      handleSwipe("right");
    } else if (info.offset.x < -100) {
      handleSwipe("left");
    } else {
      controls.start({
        x: 0,
        rotate: 0,

        transition: {
          type: "spring",
          stiffness: 180,
          damping: 20,
          mass: 0.8,
        },
      });
    }
  };

  // ============================================
  // CLOSE MATCH CELEBRATION
  // ============================================

  const closeMatchCelebration = () => {
    setMatchedProfile(null);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <main className="min-h-screen bg-[#fff9fc] text-black">

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <section className="mx-auto flex min-h-[80vh] w-full max-w-6xl flex-col items-center px-3 py-8 sm:px-5 sm:py-10">

        {/* ================================== */}
        {/* HOME TAB */}
        {/* ================================== */}

        {activeTab === "Home" && (

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 text-center"
          >
            <h1 className="text-4xl font-black">
              Welcome to Coy 💖
            </h1>

            <p className="mt-3 text-gray-600">
              Your secret crush journey starts here.
            </p>

            <button
              onClick={() => setActiveTab("Discover")}
              className="mt-7 rounded-full border-2 border-black bg-[#ff3480] px-7 py-3 font-bold text-white shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-1"
            >
              Explore Discover →
            </button>
          </motion.div>

        )}

        {/* ================================== */}
        {/* DISCOVER TAB */}
        {/* ================================== */}

        {activeTab === "Discover" && (

          <div className="w-full max-w-md text-center">

            {/* HEADING */}

            <div className="mb-8">

              <span className="rounded-full bg-[#ffe2ee] px-4 py-2 text-sm font-bold text-[#ff3480]">
                ✨ YOUR NEXT CONNECTION
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-tight">
                Discover{" "}
                <span className="text-[#ff3480]">
                  people.
                </span>
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Swipe secretly. Match mutually. Make the first move.
              </p>

            </div>

            {/* ERROR MESSAGE */}

            {error && (

              <div className="mb-5 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>

            )}

            {/* LOADING STATE */}

            {loading ? (

              <div className="flex flex-col items-center py-20">

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="h-12 w-12 rounded-full border-4 border-[#ffe2ee] border-t-[#ff3480]"
                />

                <p className="mt-5 font-semibold text-gray-500">
                  Finding your connections...
                </p>

              </div>

            ) : currentProfile ? (

              <>

                {/* PROFILE CARD */}

                <div className="relative w-full">

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={currentProfile.id}
                      animate={controls}
                      initial={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                      }}
                      drag={isSwiping ? false : "x"}
                      dragConstraints={{
                        left: 0,
                        right: 0,
                      }}
                      dragElastic={0.65}
                      onDragEnd={handleDragEnd}
                      whileDrag={{
                        cursor: "grabbing",
                        scale: 1.02,
                      }}
                      className="relative cursor-grab touch-pan-y"
                    >

                      {/* PROFILE DETAILS */}

                      <ProfileCard
                        name={currentProfile.name}
                        age={currentProfile.age}
                        city={currentProfile.city}
                        college={currentProfile.college}
                        bio={currentProfile.bio}
                        interests={currentProfile.interests}
                      />

                      {/* SWIPE FEEDBACK */}

                      <AnimatePresence>

                        {swipeDirection && (

                          <motion.div
                            key={swipeDirection}

                            initial={{
                              opacity: 0,
                              scale: 0.3,
                              rotate:
                                swipeDirection === "right"
                                  ? -25
                                  : 25,
                              y: 25,
                            }}

                            animate={{
                              opacity: 1,
                              scale: [0.3, 1.18, 0.95, 1],
                              rotate:
                                swipeDirection === "right"
                                  ? -12
                                  : 12,
                              y: 0,
                            }}

                            transition={{
                              duration: 0.55,
                              times: [0, 0.45, 0.75, 1],
                              ease: "easeOut",
                            }}

                            className={`pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-2xl border-[5px] bg-white px-6 py-4 text-4xl font-black tracking-wider shadow-[7px_7px_0px_#000] sm:px-8 sm:py-5 sm:text-5xl ${
                              swipeDirection === "right"
                                ? "border-[#ff3480] text-[#ff3480]"
                                : "border-red-500 text-red-500"
                            }`}
                          >

                            {swipeDirection === "right" ? (
                              <span>LIKED! ♥</span>
                            ) : (
                              <span>PASSED! ✕</span>
                            )}

                          </motion.div>

                        )}

                      </AnimatePresence>

                    </motion.div>

                  </AnimatePresence>

                </div>

                {/* SWIPE BUTTONS */}

                <div className="mt-7 flex justify-center gap-6">

                  {/* PASS */}

                  <motion.button
                    whileHover={{ scale: 1.12, rotate: -8 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleSwipe("left")}
                    disabled={isSwiping || !!matchedProfile}
                    aria-label="Pass on profile"
                    className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-white text-2xl shadow-[3px_3px_0px_#000] disabled:cursor-not-allowed"
                  >
                    ✕
                  </motion.button>

                  {/* LIKE */}

                  <motion.button
                    whileHover={{ scale: 1.12, rotate: 8 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleSwipe("right")}
                    disabled={isSwiping || !!matchedProfile}
                    aria-label="Like profile"
                    className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[#ff3480] text-2xl text-white shadow-[3px_3px_0px_#000] disabled:cursor-not-allowed"
                  >
                    ♥
                  </motion.button>

                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Your likes are private. Only mutual likes become matches.
                </p>

                <p className="mt-2 text-xs font-semibold text-gray-400">
                  {profiles.length} profiles remaining
                </p>

              </>

            ) : (

              /* EMPTY STATE */

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="rounded-[28px] border-2 border-black bg-[#f2eaff] px-6 py-16 shadow-[6px_6px_0px_#000]"
              >

                <div className="text-6xl">
                  💗
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  You're all caught up!
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  You've discovered everyone for now.
                  Come back soon for new connections!
                </p>

                <button
                  onClick={fetchFeed}
                  className="mt-6 rounded-full border-2 border-black bg-[#ff3480] px-6 py-3 font-bold text-white shadow-[3px_3px_0px_#000]"
                >
                  Refresh feed
                </button>

              </motion.div>

            )}

          </div>

        )}

        {/* ================================== */}
        {/* MATCHES TAB */}
        {/* ================================== */}

        {activeTab === "Matches" && (

          <div className="w-full max-w-2xl">

            <div className="mb-10 text-center">

              <div className="text-6xl">
                💕
              </div>

              <h1 className="mt-5 text-4xl font-black">
                Your Matches
              </h1>

              <p className="mt-3 text-gray-500">
                Only mutual connections appear here.
              </p>

            </div>

            {/* MATCHES LOADING */}

            {matchesLoading ? (

              <div className="flex flex-col items-center py-16">

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="h-10 w-10 rounded-full border-4 border-[#ffe2ee] border-t-[#ff3480]"
                />

                <p className="mt-4 text-sm font-semibold text-gray-500">
                  Finding your matches...
                </p>

              </div>

            ) : matches.length > 0 ? (

              <div className="grid gap-4 sm:grid-cols-2">

                {matches.map((match) => (

                  <motion.div
                    key={match.matchId}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#000]"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#ffe2ee] text-2xl font-black text-[#ff3480]">

                        {match.profile.name.charAt(0)}

                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-xl font-black">
                          {match.profile.name}, {match.profile.age}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          📍 {match.profile.city}
                        </p>

                      </div>

                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                      {match.profile.bio}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-gray-400">
                      🎓 {match.profile.college}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {match.profile.interests.slice(0, 3).map((interest) => (

                        <span
                          key={interest}
                          className="rounded-full bg-[#ffe2ee] px-3 py-1 text-xs font-semibold text-[#ff3480]"
                        >
                          {interest}
                        </span>

                      ))}

                    </div>

                    <div className="mt-5 border-t border-gray-200 pt-3 text-center text-sm font-bold text-[#ff3480]">
                      It's a mutual match! ♥
                    </div>

                  </motion.div>

                ))}

              </div>

            ) : (

              /* NO MATCHES */

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-[28px] border-2 border-black bg-[#f2eaff] px-6 py-14 text-center shadow-[6px_6px_0px_#000]"
              >

                <div className="text-6xl">
                  🥺
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  No matches yet!
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Keep discovering. Your next mutual connection could be just a swipe away!
                </p>

                <button
                  onClick={() => setActiveTab("Discover")}
                  className="mt-6 rounded-full border-2 border-black bg-[#ff3480] px-6 py-3 font-bold text-white shadow-[3px_3px_0px_#000]"
                >
                  Discover people →
                </button>

              </motion.div>

            )}

          </div>

        )}

      </section>

      {/* ====================================== */}
      {/* IT'S A MATCH CELEBRATION */}
      {/* ====================================== */}

      <AnimatePresence>

        {matchedProfile && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-5 backdrop-blur-sm"
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                y: 50,
                rotate: -5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.7,
                y: 30,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              className="relative w-full max-w-sm rounded-[30px] border-[3px] border-black bg-[#fff9fc] px-7 py-10 text-center shadow-[8px_8px_0px_#ff3480]"
            >

              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                className="text-7xl"
              >
                💖
              </motion.div>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-[#ff3480]">
                It's a Match!
              </h2>

              <p className="mt-3 text-gray-600">
                You and{" "}
                <span className="font-black text-black">
                  {matchedProfile.name}
                </span>{" "}
                liked each other!
              </p>

              <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-black bg-[#ffe2ee] text-4xl font-black text-[#ff3480]">
                {matchedProfile.name.charAt(0)}
              </div>

              <p className="mt-5 text-sm font-semibold text-gray-500">
                Sometimes, the feeling is mutual. ✨
              </p>

              <button
                onClick={closeMatchCelebration}
                className="mt-8 w-full rounded-full border-2 border-black bg-[#ff3480] px-6 py-3 font-black text-white shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-1"
              >
                Continue Discovering ♥
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}