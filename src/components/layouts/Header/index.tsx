"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  return (
    <header className="">
      <div className="max-w-(--content-width) px-4 mx-auto flex justify-between items-center py-14">
        <h1 className="font-just-me-again-down-here text-4xl">
          <Link href="/">Takahiro Okada</Link>
        </h1>
        <button
          type="button"
          onClick={toggleMenu}
          className="px-4 py-2 bg-black rounded-md"
          aria-label="Menu"
        >
          <span className="text-sm text-white font-bold">menu</span>
        </button>

        {isOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            onClick={closeMenu}
            aria-label="Close menu overlay"
          />
        )}

        <nav
          className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-40 transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <button
              type="button"
              onClick={closeMenu}
              className="self-end mb-8 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
              aria-label="Close menu"
            >
              <span className="w-6 h-0.5 bg-black rotate-45 translate-y-2" />
              <span className="w-6 h-0.5 bg-black opacity-0" />
              <span className="w-6 h-0.5 bg-black -rotate-45 -translate-y-2" />
            </button>

            <ul className="space-y-6 text-lg">
              <li>
                <Link
                  href="/"
                  className="hover:opacity-60 transition-opacity"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/works/"
                  className="hover:opacity-60 transition-opacity"
                  onClick={closeMenu}
                >
                  Works
                </Link>
              </li>
              <li>
                <Link
                  href="/activity/"
                  className="hover:opacity-60 transition-opacity"
                  onClick={closeMenu}
                >
                  Activity
                </Link>
              </li>
              <li>
                <Link
                  href="/notes/"
                  className="hover:opacity-60 transition-opacity"
                  onClick={closeMenu}
                >
                  Notes
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
