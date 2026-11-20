type ProfileCardProps = {
  name: string;
  age: number;
  city: string;
  college: string;
  bio: string;
  interests: string[];
};

export default function ProfileCard({
  name,
  age,
  city,
  college,
  bio,
  interests,
}: ProfileCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border-2 border-black bg-white shadow-[6px_6px_0px_#000]">

      {/* Profile image placeholder */}
      <div className="relative flex h-[280px] items-center justify-center bg-gradient-to-br from-[#ffd6e7] via-[#f2eaff] to-[#d9f5ed]">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white/70 text-7xl shadow-lg">
          🧑🏻‍🎨
        </div>

        <span className="absolute right-4 top-4 rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-bold">
          ✨ NEW HERE
        </span>
      </div>

      {/* Profile information */}
      <div className="p-5 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">
            {name}, {age}
          </h2>
          <span className="text-xl">💗</span>
        </div>

        <p className="mt-1 text-sm font-semibold text-gray-500">
          📍 {city} · {college}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-gray-700">
          {bio}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-black bg-[#fff0f6] px-3 py-1 text-xs font-bold"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}