"use client";

import { AlignJustify, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Headers() {
  const [mobileSection, setMobileSection] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header id="header" className="relative">
      <nav className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="font-bold text-lg md:text-xl text-primary-600 dark:text-white flex items-center"
              >
                AutonAPI
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  href="#"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="#key-features"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#for-developers-providers"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  For Developers
                </Link>
                {/* <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-2"
                >
                  Get Started
                </Link> */}

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src={session?.user?.image || "https://github.com/shadcn.png"} alt="@user" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {status === "loading" ? (
                            <DropdownMenuItem>Loading...</DropdownMenuItem>
                        ) : session ? (
                            <>
                                <DropdownMenuItem>{session.user.name}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuItem>
                                    <Link href="/auth/login">Login</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/auth/signup">Signup</Link>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileSection(!mobileSection)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded={mobileSection}
              >
                <span className="sr-only">Toggle menu</span>
                {mobileSection ? (
                  <X className="h-6 w-6" />
                ) : (
                  <AlignJustify className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileSection && (
          <div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-neutral-900 shadow-md z-50"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Home
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                How It Works
              </Link>
              <Link
                href="#key-features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                Features
              </Link>
              <Link
                href="#for-developers-providers"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                For Developers
              </Link>
              <Link
                href="#final-cta"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-500 to-emerald-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
