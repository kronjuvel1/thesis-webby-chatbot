import { FC, useContext } from "react"
import Lottie from "lottie-react"
import animationData from "./webbylottie.json"
import { useTheme } from "next-themes"
import { AutoConfig } from "@xenova/transformers"

interface WebbylottieProps {
  filter?: string
}

const Webbylottie: FC<WebbylottieProps> = ({ filter }) => {
  const { theme } = useTheme()
  return (
    <div>
      <div
        style={{
          filter: theme === "light" ? filter : "invert(1)"
        }}
      >
        <Lottie animationData={animationData} loop={true} />
        <div
          className="text-center text-xl font-bold"
          style={{ filter: theme === "light" ? filter : "invert(1)" }}
        >
          WEBBY
        </div>
      </div>
    </div>
  )
}

export default Webbylottie
