import { FC, useContext } from "react"
import Lottie from "lottie-react"
import animationData from "./webbylottie.json"
import { useTheme } from "next-themes"
import { AutoConfig } from "@xenova/transformers"

interface WebbylottieProps {
  scale?: number
  filter?: string
  className?: number | string
}

const Webbylottie: FC<WebbylottieProps> = ({
  scale = 1,
  filter,
  className
}) => {
  const { theme } = useTheme()
  return (
    <div>
      <div
        style={{
          transform: `scale(${scale / 1.5})`,
          filter: theme === "light" ? filter : "invert(1)"
        }}
      >
        <Lottie animationData={animationData} loop={true} />
        <h1
          className="text-center text-xl font-bold"
          style={{ filter: theme === "light" ? filter : "invert(1)" }}
        >
          WEBBY
        </h1>
      </div>
    </div>
  )
}

export default Webbylottie
