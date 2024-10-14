"use client"

import Link from "next/link"
import Webbylottie from "../icons/webby-lottie"

export const Brand = () => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="/"
    >
      <div className="mb-2">
        <Webbylottie />
      </div>

      {/* <div className="text-4xl font-bold tracking-wide">Webby</div> */}
    </Link>
  )
}
