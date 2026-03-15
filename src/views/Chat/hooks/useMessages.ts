import { useChatStore } from '../store/chatStore'
import { readChatMessage } from '@/services/ChatService'
import useSWRMutation from 'swr/mutation'

async function getMessage(id: string) {
    const data = await readChatMessage(id)
    return data
}

const useMessage = () => {
    const setMessageFetched = useChatStore((state) => state.setMessagesRecord)
    const setChatsFetched = useChatStore((state) => state.setMessageFetched)

    const { trigger: fetchMessage, isMutating: isChatsFetching } = useSWRMutation(
        `/api/chats/`,
        async (_key, { arg }: { arg: string }) => getMessage(arg),
        {
            onSuccess: (list) => {
                setMessageFetched(list.messages)
                setChatsFetched(true)
            },
        },
    )

    return {
        fetchMessage,
        isChatsFetching,
    }
}

export default useMessage
