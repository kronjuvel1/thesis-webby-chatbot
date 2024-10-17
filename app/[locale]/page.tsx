"use client"

import Webbylottie from "@/components/icons/webby-lottie"
import { IconArrowRight } from "@tabler/icons-react"

export default function HomePage() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <Webbylottie scale={0.8} />
      </div>
      Start Learning
      <IconArrowRight className="ml-1" size={20} />
    </div>
  )
}
