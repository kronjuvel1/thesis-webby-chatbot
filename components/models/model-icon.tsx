import { cn } from "@/lib/utils"
import { ModelProvider } from "@/types"
import { useTheme } from "next-themes"
import { FC, HTMLAttributes } from "react"
import { WebbySVG } from "../icons/webby-svg"

interface ModelIconProps extends HTMLAttributes<HTMLDivElement> {
  provider: ModelProvider
  height: number
  width: number
}

export const ModelIcon: FC<ModelIconProps> = ({
  provider,
  height,
  width,
  ...props
}) => {
  const { theme } = useTheme()
  return (
    <WebbySVG
      className={cn(
        "rounded-sm p-1",
        props.className,
        theme === "dark"
          ? "bg-white fill-black stroke-black"
          : "bg-black fill-white stroke-white"
      )}
      width={width}
      height={height}
    />
  )
}
