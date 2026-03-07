import { useState, useEffect, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import ChatBox from '@/components/view/ChatBox'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import uniqueId from 'lodash/uniqueId'

const ChatBody = () => {
    const scrollRef = useRef<any>(null)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const [conversation, setConversation] = useState<any[]>([])

    useEffect(() => {
        if (selectedChat.id) {
            setConversation([]) 
        }
    }, [selectedChat.id]) 

    const handleInputChange = async ({ value }: { value: string }) => {
        if (!value.trim()) return

        // 2. Crear mensaje del usuario
        const newMessage = {
            id: uniqueId('user-msg-'),
            sender: { id: 'user', name: 'Tú' },
            content: value,
            timestamp: new Date(),
            isMyMessage: true,
        }


        setConversation((prev) => [...prev, newMessage])


        setTimeout(() => {
            const botResponse = {
                id: uniqueId('bot-msg-'),
                sender: { 
                    id: 'bot', 
                    name: 'Asistente IA',
                    avatarImageUrl: '/bot.png' 
                },
                content: "¡Hola! Estoy procesando tu consulta con el sistema RAG. Dame un momento...",
                timestamp: new Date(),
                isMyMessage: false,
            }
            setConversation((prev) => [...prev, botResponse])
        }, 800)
    }

    const cardHeaderProps = {
        header: {
            content: (
                <div className="flex items-center gap-3">
                    <Avatar src={selectedChat.user?.avatarImageUrl} shape="circle" />
                    <div>
                        <div className="font-bold heading-text text-sm md:text-base">
                            {selectedChat.user?.name || 'Asistente IA'}
                        </div>
                        <div className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            En línea
                        </div>
                    </div>
                </div>
            ),
            className: 'bg-gray-50 dark:bg-gray-600 h-[80px] border-b border-gray-200 dark:border-gray-700',
        },
    }

    return (
        <div className={classNames('w-full h-full', !selectedChat.id && 'hidden')}>
            {selectedChat.id ? (
                <Card
                    className="flex flex-col h-full border-none shadow-none"
                    bodyClass="p-0 flex-1 relative overflow-hidden"
                    {...cardHeaderProps}
                >
                    <div className="h-[calc(100vh-250px)] md:h-[600px] flex flex-col"> 
                        <ChatBox
                            containerClass="flex flex-col flex-1 h-full"  
                            messageListClass="flex-1 relative"            
                            ref={scrollRef}
                            messageList={conversation}
                            placeholder="Escribe tu consulta aquí..."
                            onInputChange={handleInputChange}
                        />
                    </div>
                </Card>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                    Selecciona o inicia un nuevo chat para comenzar
                </div>
            )}
        </div>
    )
}

export default ChatBody
