import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { AssignWorkspaces } from "@/components/workspace/assign-workspaces"
import { ChatbotUIContext } from "@/context/context"
import {
  createAssistantFile,
  deleteAssistantFile,
  getAssistantFilesByAssistantId
} from "@/db/assistant-files"
import {
  createAssistantTool,
  deleteAssistantTool,
  getAssistantToolsByAssistantId
} from "@/db/assistant-tools"
import {
  createAssistantWorkspaces,
  deleteAssistantWorkspace,
  getAssistantWorkspacesByAssistantId,
  updateAssistant
} from "@/db/assistants"
import { updateChat } from "@/db/chats"
import {
  createModelWorkspaces,
  deleteModelWorkspace,
  getModelWorkspacesByModelId,
  updateModel
} from "@/db/models"
import {
  getAssistantImageFromStorage,
  uploadAssistantImage
} from "@/db/storage/assistant-images"
import {
  createToolWorkspaces,
  deleteToolWorkspace,
  getToolWorkspacesByToolId,
  updateTool
} from "@/db/tools"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { Tables, TablesUpdate } from "@/supabase/types"
import { CollectionFile, ContentType, DataItemType } from "@/types"
import { FC, useContext, useEffect, useRef, useState } from "react"
import profile from "react-syntax-highlighter/dist/esm/languages/hljs/profile"
import { toast } from "sonner"
import { SidebarDeleteItem } from "./sidebar-delete-item"

interface SidebarUpdateItemProps {
  isTyping: boolean
  item: DataItemType
  contentType: ContentType
  children: React.ReactNode
  renderInputs: (renderState: any) => JSX.Element
  updateState: any
}

export const SidebarUpdateItem: FC<SidebarUpdateItemProps> = ({
  item,
  contentType,
  children,
  renderInputs,
  updateState,
  isTyping
}) => {
  const {
    workspaces,
    selectedWorkspace,
    setChats,
    setAssistants,
    setModels,
    setAssistantImages
  } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [startingWorkspaces, setStartingWorkspaces] = useState<
    Tables<"workspaces">[]
  >([])
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<
    Tables<"workspaces">[]
  >([])

  // Assistants Render State
  const [startingAssistantFiles, setStartingAssistantFiles] = useState<
    Tables<"files">[]
  >([])
  const [startingAssistantCollections, setStartingAssistantCollections] =
    useState<Tables<"collections">[]>([])
  const [startingAssistantTools, setStartingAssistantTools] = useState<
    Tables<"tools">[]
  >([])
  const [selectedAssistantFiles, setSelectedAssistantFiles] = useState<
    Tables<"files">[]
  >([])
  const [selectedAssistantCollections, setSelectedAssistantCollections] =
    useState<Tables<"collections">[]>([])
  const [selectedAssistantTools, setSelectedAssistantTools] = useState<
    Tables<"tools">[]
  >([])

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        if (workspaces.length > 1) {
          const workspaces = await fetchSelectedWorkspaces()
          setStartingWorkspaces(workspaces)
          setSelectedWorkspaces(workspaces)
        }

        const fetchDataFunction = fetchDataFunctions[contentType]
        if (!fetchDataFunction) return
        await fetchDataFunction(item.id)
      }

      fetchData()
    }
  }, [isOpen])

  const renderState = {
    chats: null,
    presets: null,
    prompts: null,
    files: null,
    assistants: {
      startingAssistantFiles,
      setStartingAssistantFiles,
      startingAssistantCollections,
      setStartingAssistantCollections,
      startingAssistantTools,
      setStartingAssistantTools,
      selectedAssistantFiles,
      setSelectedAssistantFiles,
      selectedAssistantCollections,
      setSelectedAssistantCollections,
      selectedAssistantTools,
      setSelectedAssistantTools
    },
    tools: null,
    models: null
  }

  const fetchDataFunctions = {
    chats: null,
    assistants: async (assistantId: string) => {
      const assistantFiles = await getAssistantFilesByAssistantId(assistantId)
      setStartingAssistantFiles(assistantFiles.files)

      const assistantTools = await getAssistantToolsByAssistantId(assistantId)
      setStartingAssistantTools(assistantTools.tools)

      setSelectedAssistantFiles([])
      setSelectedAssistantCollections([])
      setSelectedAssistantTools([])
    },
    tools: null,
    models: null
  }

  const fetchWorkpaceFunctions = {
    chats: null,
    assistants: async (assistantId: string) => {
      const item = await getAssistantWorkspacesByAssistantId(assistantId)
      return item.workspaces
    },
    models: async (modelId: string) => {
      const item = await getModelWorkspacesByModelId(modelId)
      return item.workspaces
    }
  }

  const fetchSelectedWorkspaces = async () => {
    const fetchFunction = fetchWorkpaceFunctions[contentType]

    if (!fetchFunction) return []

    const workspaces = await fetchFunction(item.id)

    return workspaces
  }

  const handleWorkspaceUpdates = async (
    startingWorkspaces: Tables<"workspaces">[],
    selectedWorkspaces: Tables<"workspaces">[],
    itemId: string,
    deleteWorkspaceFn: (
      itemId: string,
      workspaceId: string
    ) => Promise<boolean>,
    createWorkspaceFn: (
      workspaces: { user_id: string; item_id: string; workspace_id: string }[]
    ) => Promise<void>,
    itemIdKey: string
  ) => {
    if (!selectedWorkspace) return

    const deleteList = startingWorkspaces.filter(
      startingWorkspace =>
        !selectedWorkspaces.some(
          selectedWorkspace => selectedWorkspace.id === startingWorkspace.id
        )
    )

    for (const workspace of deleteList) {
      await deleteWorkspaceFn(itemId, workspace.id)
    }

    if (deleteList.map(w => w.id).includes(selectedWorkspace.id)) {
      const setStateFunction = stateUpdateFunctions[contentType]

      if (setStateFunction) {
        setStateFunction((prevItems: any) =>
          prevItems.filter((prevItem: any) => prevItem.id !== item.id)
        )
      }
    }

    const createList = selectedWorkspaces.filter(
      selectedWorkspace =>
        !startingWorkspaces.some(
          startingWorkspace => startingWorkspace.id === selectedWorkspace.id
        )
    )

    await createWorkspaceFn(
      createList.map(workspace => {
        return {
          user_id: workspace.user_id,
          [itemIdKey]: itemId,
          workspace_id: workspace.id
        } as any
      })
    )
  }

  const updateFunctions = {
    chats: updateChat,
    assistants: async (
      assistantId: string,
      updateState: {
        assistantId: string
        image: File
      } & TablesUpdate<"assistants">
    ) => {
      const { image, ...rest } = updateState

      let updatedAssistant = await updateAssistant(assistantId, rest)

      if (image) {
        const filePath = await uploadAssistantImage(updatedAssistant, image)

        updatedAssistant = await updateAssistant(assistantId, {
          image_path: filePath
        })

        const url = (await getAssistantImageFromStorage(filePath)) || ""

        if (url) {
          const response = await fetch(url)
          const blob = await response.blob()
          const base64 = await convertBlobToBase64(blob)

          setAssistantImages(prev => [
            ...prev,
            {
              assistantId: updatedAssistant.id,
              path: filePath,
              base64,
              url
            }
          ])
        }
      }

      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        assistantId,
        deleteAssistantWorkspace,
        createAssistantWorkspaces as any,
        "assistant_id"
      )

      return updatedAssistant
    },
    models: async (modelId: string, updateState: TablesUpdate<"models">) => {
      const updatedModel = await updateModel(modelId, updateState)

      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        modelId,
        deleteModelWorkspace,
        createModelWorkspaces as any,
        "model_id"
      )

      return updatedModel
    }
  }

  const stateUpdateFunctions = {
    chats: setChats,
    assistants: setAssistants,
    models: setModels
  }

  const handleUpdate = async () => {
    try {
      const updateFunction = updateFunctions[contentType]
      const setStateFunction = stateUpdateFunctions[contentType]

      if (!updateFunction || !setStateFunction) return
      if (isTyping) return // Prevent update while typing

      const updatedItem = await updateFunction(item.id, updateState)

      setStateFunction((prevItems: any) =>
        prevItems.map((prevItem: any) =>
          prevItem.id === item.id ? updatedItem : prevItem
        )
      )

      setIsOpen(false)

      toast.success(`${contentType.slice(0, -1)} updated successfully`)
    } catch (error) {
      toast.error(`Error updating ${contentType.slice(0, -1)}. ${error}`)
    }
  }

  const handleSelectWorkspace = (workspace: Tables<"workspaces">) => {
    setSelectedWorkspaces(prevState => {
      const isWorkspaceAlreadySelected = prevState.find(
        selectedWorkspace => selectedWorkspace.id === workspace.id
      )

      if (isWorkspaceAlreadySelected) {
        return prevState.filter(
          selectedWorkspace => selectedWorkspace.id !== workspace.id
        )
      } else {
        return [...prevState, workspace]
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        className="flex min-w-[450px] flex-col justify-between"
        side="left"
        onKeyDown={handleKeyDown}
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">
              Edit {contentType.slice(0, -1)}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {workspaces.length > 1 && (
              <div className="space-y-1">
                <Label>Assigned Workspaces</Label>

                <AssignWorkspaces
                  selectedWorkspaces={selectedWorkspaces}
                  onSelectWorkspace={handleSelectWorkspace}
                />
              </div>
            )}

            {renderInputs(renderState[contentType])}
          </div>
        </div>

        <SheetFooter className="mt-2 flex justify-between">
          <SidebarDeleteItem item={item} contentType={contentType} />

          <div className="flex grow justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button ref={buttonRef} onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
