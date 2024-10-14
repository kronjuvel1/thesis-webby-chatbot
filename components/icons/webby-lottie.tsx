import { FC } from "react"
import Lottie from "lottie-react"
import animationData from "./webbylottie.json"

interface WebbylottieProps {
  scale?: number
}

const Webbylottie: FC<WebbylottieProps> = ({ scale = 1 }) => {
  return (
    <div>
      <div style={{ transform: `scale(${scale / 1.5})` }}>
        <Lottie animationData={animationData} loop={true} />
      </div>
      <div className="text-center text-2xl font-bold">
        Hello, I am Webby, your personal learning buddy.
      </div>
    </div>
  )
}

export default Webbylottie
