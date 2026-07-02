import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 mb-10">
      <div className="max-w-(--content-width) mx-auto px-5 text-center text-gray-600 border-t border-[#D9D9D9] pt-8">
        <nav>
          <ul className="flex justify-center gap-4">
            <li>
              <Link href="/" className="text-sm">
                Home
              </Link>
            </li>
            <li>
              <Link href="/works/" className="text-sm">
                Works
              </Link>
            </li>
            <li>
              <Link href="/activity/" className="text-sm">
                Activity
              </Link>
            </li>
            <li>
              <Link href="/travel/" className="text-sm">
                Travel
              </Link>
            </li>
            <li>
              <Link href="/notes/" className="text-sm">
                Notes
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className="text-sm">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
