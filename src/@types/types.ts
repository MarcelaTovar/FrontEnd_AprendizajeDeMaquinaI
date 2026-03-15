export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
}

// --- Chat Types ---

export type ChatSummary = {
    id: string
    title: string
    ownerId: string
    participantA: string
    participantB: string
}

export type ChatListResponse = {
    chats: ChatSummary[]
}

export type ChatCreate = {
    title: string
}

export type Message = {
    content: string
    senderId: string
    sendTime: string
    isAI: boolean
    role: string
}

export type ChatWithMessages = {
    id: string | number
    title: string
    ownerId: string
    participantA: string
    participantB: string
    messages: Message[]
}

export type ChatMessageRequest = {
    content: string
    chat_history?: string
}

export type ChatMessageResponse = {
    answer: string
    sources: string[]
    chat_history: string
}

export type MessageCreate = {
    content: string
}

export type ChatRoundTripResponse = {
    content: string
    senderId: string
    sendTime: string
    isAI: boolean
    role: string
    chatId: string | number
    userMessage?: Record<string, string | null>
    messages?: Array<Record<string, unknown>>
    sources?: string[]
}

// --- Auth Types ---

export type Register = {
    username: string
    email: string
    password: string
}

export type AuthResponse = {
    access_token: string
    refresh_token: string
    user: User & { chats: ChatSummary[] }
}
