"use client"

import Webbylottie from "@/components/icons/webby-lottie"
import { IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <Webbylottie scale={0.8} />
      </div>
      <Link
        className="bg-primary text-secondary mt-4 flex w-[200px] items-center justify-center rounded-md p-2 font-semibold"
        href="/login"
      >
        Start Learning
        <IconArrowRight className="ml-1" size={20} />
      </Link>
    </div>
  )
}
