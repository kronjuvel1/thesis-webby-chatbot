import { FC } from "react"
import Lottie from "lottie-react"
import animationData from "./webbylottie.json"

interface WebbylottieProps {
  scale?: number
}

const Webbylottie: FC<WebbylottieProps> = ({ scale = 1 }) => {
  return (
    <div style={{ transform: `scale(${scale / 2})` }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  )
}

export default Webbylottie
