import { Tables } from "@/supabase/types"

export type DataListType =
  | Tables<"chats">[]
  | Tables<"assistants">[]
  | Tables<"models">[]

export type DataItemType =
  | Tables<"chats">
  | Tables<"assistants">
  | Tables<"models">
