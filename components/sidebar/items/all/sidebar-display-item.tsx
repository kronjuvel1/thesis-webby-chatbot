import { ChatbotUIContext } from "@/context/context"
import { createChat } from "@/db/chats"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { ContentType, DataItemType } from "@/types"
import { useRouter } from "next/navigation"
import { FC, useContext, useRef, useState } from "react"
import { SidebarUpdateItem } from "./sidebar-update-item"

interface SidebarItemProps {
  item: DataItemType
  isTyping: boolean
  contentType: ContentType
  icon: React.ReactNode
  updateState: any
  renderInputs: (renderState: any) => JSX.Element
}

export const SidebarItem: FC<SidebarItemProps> = ({
  item,
  contentType,
  updateState,
  renderInputs,
  icon,
  isTyping
}) => {
  const { selectedWorkspace, setChats, setSelectedAssistant } =
    useContext(ChatbotUIContext)

  const router = useRouter()

  const itemRef = useRef<HTMLDivElement>(null)

  const [isHovering, setIsHovering] = useState(false)

  const actionMap = {
    chats: async (item: any) => {},
    assistants: async (assistant: Tables<"assistants">) => {
      if (!selectedWorkspace) return

      const createdChat = await createChat({
        user_id: assistant.user_id,
        workspace_id: selectedWorkspace.id,
        assistant_id: assistant.id,
        context_length: assistant.context_length,
        include_profile_context: assistant.include_profile_context,
        include_workspace_instructions:
          assistant.include_workspace_instructions,
        model: assistant.model,
        name: `Chat with Webby`,
        prompt: assistant.prompt,
        temperature: assistant.temperature,
        embeddings_provider: assistant.embeddings_provider
      })

      setChats(prevState => [createdChat, ...prevState])
      setSelectedAssistant(assistant)

      return router.push(`/${selectedWorkspace.id}/chat/${createdChat.id}`)
    },
    models: async (item: any) => {}
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  return (
    <SidebarUpdateItem
      item={item}
      isTyping={isTyping}
      contentType={contentType}
      updateState={updateState}
      renderInputs={renderInputs}
    >
      <div
        ref={itemRef}
        className={cn(
          "hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none"
        )}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {icon}

        <div className="ml-3 flex-1 truncate text-sm font-semibold">
          {item.name}
        </div>
      </div>
    </SidebarUpdateItem>
  )
}
