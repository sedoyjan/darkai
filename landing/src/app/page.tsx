import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24 bg-black">
      <h1 className="font-extrabold text-white text-5xl">Dark AI</h1>
      <div className="flex flex-row gap-4">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/support">Support</Link>
      </div>
    </div>
  );
}
