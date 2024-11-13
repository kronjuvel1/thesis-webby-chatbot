import { cn } from "@/lib/utils"
import { ModelProvider } from "@/types"
import { IconSparkles } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { FC, HTMLAttributes } from "react"
import { GoogleSVG } from "../icons/google-svg"
import { OpenAISVG } from "../icons/openai-svg"
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
        theme === "dark" ? "bg-black fill-white" : "bg-white fill-black"
      )}
      width={width}
      height={height}
    />
  )
}
