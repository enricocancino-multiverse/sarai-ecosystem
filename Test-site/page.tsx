import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
    <main className="flex justify-centertext-3xl font-bold">
      <h1>Hello God!</h1>
    </main>
    
    <div className="flex justify-center space-x-4">
    <Link href="/Document">
    <Button />
    </Link>
    </div>

    <Link href="/Document/Checklist/Attendance">
    <Button2 />
    </Link>

    <Link href="/Document/ColorDash/Minigame">
    <Button3 />
    </Link>

     <Image src="/globe.svg" alt="File Icon" width={50} height={50} />

    </div>
  );
}

export function Button() {
  return (
    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
      Click Me
    </button>
  );
}

export function Button2() {
  return (
    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
      Click Me
    </button>
  );
}

export function Button3() {
  return (
    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
      Click Me
    </button>
  );
    
}