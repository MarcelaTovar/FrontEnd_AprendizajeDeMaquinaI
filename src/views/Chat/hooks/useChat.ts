import { useChatStore } from '../store/chatStore'
import { getChatList } from '@/services/ChatService'
import useSWRMutation from 'swr/mutation'
import { ChatListResponse } from '@/@types/types'

async function getChats() {
    const data = await getChatList()
    console.log('Fetched chats:', data)
    return data
}

const useChat = () => {
    const setChats = useChatStore((state) => state.setChats)
    const setChatsFetched = useChatStore((state) => state.setChatsFetched)

    const { trigger: fetchChats, isMutating: isChatsFetching } = useSWRMutation(
        `/api/chats/`,
        getChats,
        {
            onSuccess: (list) => {
                setChats(list.chats)
                setChatsFetched(true)
            },
        },
    )

    return {
        fetchChats,
        isChatsFetching,
    }
}

export default useChat
