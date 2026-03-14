import Button from '@/components/ui/Button'
import { useChatStore } from '../store/chatStore'
import uniqueId from 'lodash/uniqueId'
import { createChat } from '@/services/ChatService'
import useChat from '../hooks/useChat'


const NewChat = () => {
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)
    const { fetchChats } = useChat()

    const handleStartNewChat = async () => {
        // Aquí puedes personalizar los datos del nuevo chat
        const chatData = {
            title: 'Nuevo chat',
        }
        const newChat = await createChat(chatData)
        await fetchChats()
        setSelectedChat(newChat)
    }

    return (
        <div className="p-2">
            <Button
                block
                variant="solid"
                onClick={handleStartNewChat}
            >
                New chat
            </Button>
        </div>
    )
}

export default NewChat
