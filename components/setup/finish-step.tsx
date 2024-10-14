import { FC } from "react"

interface FinishStepProps {
  displayName: string
}

export const FinishStep: FC<FinishStepProps> = ({ displayName }) => {
  return (
    <div className="space-y-4">
      <div>
        You&apos;re almost done{" "}
        {displayName.length > 0 ? `, ${displayName.split(" ")[0]}` : ""}!
      </div>

      <div>Click next to meet Webby.</div>
    </div>
  )
}
