"use client";

import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const AuthButtons = () => {
  const { isSignedIn, user } = useUser(); // Ambil user info

  return (
    <div className="flex items-center gap-x-4">
      {isSignedIn && user ? (
        <>
          {/* Tampilkan Keranjang hanya jika sudah login */}
          <Link href={`/cart/${user.id}`} className="relative p-2">
            <ShoppingCart className="w-6 h-6" />
          </Link>

          {/* User Profile Button */}
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <SignInButton mode="modal">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Login
          </button>
        </SignInButton>
      )}
    </div>
  );
};

export default AuthButtons;