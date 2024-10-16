import { FC, useContext } from "react"
import Lottie from "lottie-react"
import animationData from "./webbylottie.json"
import { useTheme } from "next-themes"

interface WebbylottieProps {
  scale?: number
  filter?: string
}

const Webbylottie: FC<WebbylottieProps> = ({ scale = 1, filter }) => {
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
        <div
          className="text-center text-2xl font-bold"
          style={{ filter: theme === "light" ? filter : "invert(1)" }}
        >
          Hello, I am Webby, the Web Development Learning Buddy.
        </div>
      </div>
    </div>
  )
}

export default Webbylottie
