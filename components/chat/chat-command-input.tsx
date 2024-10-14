import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { AssistantPicker } from "./assistant-picker"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  useContext(ChatbotUIContext)
  usePromptAndCommand()

  return (
    <>
      <AssistantPicker />
    </>
  )
}
