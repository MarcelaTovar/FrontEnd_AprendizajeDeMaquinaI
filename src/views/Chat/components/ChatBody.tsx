import { useState, useEffect, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import ChatBox from '@/components/view/ChatBox'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import uniqueId from 'lodash/uniqueId'
import useMessage from '../hooks/useMessages'
import { Message } from '@/@types/types'

const ChatBody = () => {
    const scrollRef = useRef<any>(null)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const [conversation, setConversation] = useState<Message[]>([])
    const messagesRecord = useChatStore((state) => state.MessagesRecord)
    const messageFetched = useChatStore((state) => state.messageFetched)
    const { fetchMessage } = useMessage()

    // Función para adaptar mensajes del backend
    const adaptMessages = (messages: Message[]): any[] =>
        messages.map((msg, idx) => ({
            id: uniqueId('msg-'),
            sender: {
                id: msg.senderId,
                name: msg.senderId === 'user' ? 'Tú' : 'Asistente IA',
                avatarImageUrl: msg.isAI ? '/bot.png' : undefined,
            },
            content: msg.content,
            timestamp: new Date(msg.sendTime),
            isMyMessage: msg.isAI,
            showAvatar: true,
        }));
        

    useEffect(() => {
        const selectedChatId = selectedChat && 'id' in selectedChat ? selectedChat.id : null;
    if (selectedChatId) {
        (async () => {
            await fetchMessage(selectedChatId);
            console.log('Messages record:', adaptMessages(messagesRecord));
            setConversation(messagesRecord ? adaptMessages(messagesRecord) : []);
        })();
    }
    }, [selectedChat && 'id' in selectedChat ? selectedChat.id : null])

    const handleInputChange = async ({ value }: { value: string }) => {
        if (!value.trim()) return
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
                    <Avatar src={'/bot.png'} shape="circle" />
                    <div>
                        <div className="font-bold heading-text text-sm md:text-base">
                            {'title' in selectedChat ? selectedChat.title : 'Asistente IA'}
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
        <div className={classNames('w-full h-full', !(selectedChat && 'id' in selectedChat) && 'hidden')}>
            {(selectedChat && 'id' in selectedChat) ? (
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
