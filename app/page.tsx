import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        {/* 👇 ADD THIS */}
        <Link
          href="/projects"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-black text-white md:w-[158px]"
        >
          View Projects
        </Link>

      </main>
    </div>
  );
}
