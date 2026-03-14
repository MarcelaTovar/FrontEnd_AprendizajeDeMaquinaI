import ApiService from './ApiService'
import endpointConfig from '../configs/endpoint.config'
import {
    ChatListResponse,
    ChatCreate,
    ChatSummary,
    ChatWithMessages,
    Message,
    ChatMessageRequest,
    ChatMessageResponse,
    MessageCreate,
    ChatRoundTripResponse
} from '@/@types/types'

// --- Chats ---
export async function getChatList() {
    return ApiService.fetchDataWithAxios<ChatListResponse>({
        url: endpointConfig.chatList,
        method: 'get',
    })
}

export async function createChat(data: ChatCreate) {
    return ApiService.fetchDataWithAxios<ChatSummary, ChatCreate>({
        url: endpointConfig.chatCreate,
        method: 'post',
        data,
    })
}

export async function deleteChat(chatId: string | number) {
    return ApiService.fetchDataWithAxios<void>({
        url: endpointConfig.chatDelete,
        method: 'delete',
        data: { chatId },
    })
}

export async function deleteChatMessage(chatId: string | number) {
    return ApiService.fetchDataWithAxios<void>({
        url: endpointConfig.chatMessageDelete(String(chatId)),
        method: 'delete',
    })
}

export async function getChatHealth() {
    return ApiService.fetchDataWithAxios<any>({
        url: endpointConfig.chatHealthList,
        method: 'get',
    })
}

// --- Messages ---
export async function createChatMessage(data: MessageCreate) {
    return ApiService.fetchDataWithAxios<ChatMessageResponse, MessageCreate>({
        url: endpointConfig.chatMessageSend(''), // chatId vacío para POST general
        method: 'post',
        data,
    })
}

export async function readChatMessage(chatId: string | number) {
    return ApiService.fetchDataWithAxios<ChatWithMessages>({
        url: endpointConfig.chatMessageRead(String(chatId)),
        method: 'get',
    })
}

export async function sendChatMessage(chatId: string | number, data: ChatMessageRequest) {
    console.log('Sending message to chatId:', chatId, 'with data:', data)
    return ApiService.fetchDataWithAxios<ChatRoundTripResponse, ChatMessageRequest>({
        url: endpointConfig.chatMessageSend(String(chatId)),
        method: 'post',
        data,
    })
}
