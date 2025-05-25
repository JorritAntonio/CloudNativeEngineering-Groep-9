import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";

const Header: React.FC = () => {
  const router = useRouter();
  const pathName = router.pathname;

  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleSearch = (event: FormEvent) => {
      event.preventDefault()
      router.push(`/threads?search=${searchFilter}`);
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center hover:bg-gray-200 hover:rounded hover:cursor-pointer p-1">
            <img
              src="/favicon.ico"
              alt="Main Logo"
              width={40}
              height={40}
              onClick={() => router.push("/")}
            />
            <a href="/" className="text-xl font-semibold text-orange-500">
              BadOverflow
            </a>
          </div>
          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href={"/threads"} className="hover:text-black hover:bg-gray-200 hover:rounded p-1">Threads</a>
            <a href="#" className="hover:text-black hover:bg-gray-200 hover:rounded p-1">Tags</a>
            <a href="#" className="hover:text-black hover:bg-gray-200 hover:rounded p-1">Users</a>
            <a href="#" className="hover:text-black hover:bg-gray-200 hover:rounded p-1">Companies</a>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:flex">
          <form className="relative w-full" onSubmit={(e) => handleSearch(e)}>
            <input
              type="text"
              placeholder="Search…"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </form>
        </div>

        {/* Auth Links */}
        {pathName != "/login" && pathName != "/signup" && !loggedInUser && (
          <div className="flex items-center gap-2 text-sm">
            <a
              href={"/login"}
              className="px-3 py-1 border border-orange-500 text-orange-500 rounded hover:bg-orange-50"
            >
              Log in
            </a>
            <a
              href={"/signup"}
              className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Sign up
            </a>
          </div>
        )}
        {loggedInUser && (
          <div className="flex items-center gap-2 text-sm">
            <a
              href={"/"}
              className="px-3 py-1 border border-orange-500 text-orange-500 rounded hover:bg-orange-50"
              onClick={() => localStorage.removeItem("loggedInUser")}
            >
              Log out
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
