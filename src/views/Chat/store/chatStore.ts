import { create } from 'zustand'
import { ChatSummary, ChatWithMessages, Message } from '@/@types/types'

type ContactInfoDrawer = {
    userId: string
    chatId: string
    open: boolean
}

export type ChatState = {
    MessagesRecord: Message[]
    messageFetched: boolean
    selectedChat: ChatSummary | {}
    mobileSideBarExpand: boolean
    chats: ChatSummary[]
    chatsFetched: boolean
    contactListDialog: boolean
    contactInfoDrawer: ContactInfoDrawer
}

type ChatAction = {
    setChats: (payload: ChatSummary[]) => void
    setChatsFetched: (payload: boolean) => void
    setSelectedChat: (payload: ChatSummary | {}) => void
    setContactListDialog: (payload: boolean) => void
    setMobileSidebar: (payload: boolean) => void
    setMessagesRecord: (payload: Message[]) => void
    setMessageFetched: (payload: boolean) => void
    pushConversationMessage: (payload: Message[]) => void
    deleteMessagesRecord: (payload: string) => void
}

const initialState: ChatState = {
    MessagesRecord: [],
    selectedChat: {},
    mobileSideBarExpand: false,
    chats: [],
    chatsFetched: false,
    messageFetched: false,
    contactListDialog: false,
    contactInfoDrawer: {
        userId: '',
        chatId: '',
        open: false,
    },
}

export const useChatStore = create<ChatState & ChatAction>((set, get) => ({
    ...initialState,
    setChats: (payload) =>
        set(() => ({ chats: payload })),
    setChatsFetched: (payload) => set(() => ({ chatsFetched: payload })),
    setSelectedChat: (payload) => set(() => ({ selectedChat: payload })),
    setContactListDialog: (payload) =>
        set(() => ({ contactListDialog: payload })),
    setMobileSidebar: (payload) =>
        set(() => ({ mobileSideBarExpand: payload })),
    setMessagesRecord: (payload) =>
        set(() => ({ MessagesRecord: payload })),
    setMessageFetched: (payload) => set(() => {
        return {
            messageFetched: payload,
        }
    }),
    pushConversationMessage: (payload) =>
        set(() => {
            const previousMessagesRecord = get().MessagesRecord
            const MessagesRecord = structuredClone(
                previousMessagesRecord,
            ).map((record) => {
                if (id === record.id) {
                    record.push(message)
                }
                return record
            })
            return {
                MessagesRecord,
            }
        }),
    setMessageFetched: (payload) => set(() => ({ messageFetched: payload })),
    deleteMessagesRecord: (payload) =>
        set(() => {
            const previousMessagesRecord = get().MessagesRecord
            const previousChats = get().chats
            return {
                MessagesRecord: previousMessagesRecord.filter(
                    (record) => record.id !== payload,
                ),
                chats: previousChats.filter((chat) => chat.id !== payload),
            }
        }),
}))
