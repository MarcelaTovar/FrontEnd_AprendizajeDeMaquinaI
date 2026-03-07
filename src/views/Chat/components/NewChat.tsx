import Button from '@/components/ui/Button'
import { useChatStore } from '../store/chatStore'
import uniqueId from 'lodash/uniqueId'

const NewChat = () => {
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)

    const handleStartNewChat = () => {
        // Al hacer clic, definimos un "chat" por defecto que es nuestro Bot
        setSelectedChat({
            id: uniqueId('session-'), // Genera un ID único para la sesión actual
            chatType: 'personal',
            user: {
                id: 'bot-1',
                name: 'IA Assistant', // El nombre que verá el usuario
                avatarImageUrl: '/bot.png', // Cambia por un icono de bot
            }
        })
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
