import { Tables } from "@/supabase/types"

export type DataListType =
  | Tables<"chats">[]
  | Tables<"assistants">[]
  | Tables<"models">[]
  | Tables<"collections">[]
  | Tables<"files">[]

export type DataItemType =
  | Tables<"chats">
  | Tables<"assistants">
  | Tables<"models">
  | Tables<"collections">
  | Tables<"files">
