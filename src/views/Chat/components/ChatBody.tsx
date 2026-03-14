import { useState, useEffect, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import ChatBox, { type MessageList as ChatBoxMessageList } from '@/components/view/ChatBox'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import uniqueId from 'lodash/uniqueId'
import useMessage from '../hooks/useMessages'
import type { Message as BackendMessage } from '@/@types/types'

const ChatBody = () => {
    const scrollRef = useRef<any>(null)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const [localMessages, setLocalMessages] = useState<ChatBoxMessageList>([])
    const messagesRecord = useChatStore((state) => state.MessagesRecord)
    const { fetchMessage } = useMessage()

        const adaptMessages = (messages: BackendMessage[]): ChatBoxMessageList =>
            messages.map((msg) => ({
                id: uniqueId('msg-'),
                sender: {
                    id: msg.senderId,
                    name: msg.senderId === 'user' ? 'Tú' : 'Asistente IA',
                    avatarImageUrl: msg.isAI ? '/bot.png' : undefined,
                },
                content: msg.content,
                timestamp: new Date(msg.sendTime),
                type: 'regular',
                isMyMessage: msg.senderId === 'user',
                showAvatar: msg.senderId !== 'user',
                avatarGap: msg.senderId !== 'user',
            }))
        

    useEffect(() => {
        const selectedChatId = selectedChat && 'id' in selectedChat ? selectedChat.id : null
        if (selectedChatId) {
            fetchMessage(selectedChatId)
        }
        setLocalMessages([])
    }, [selectedChat && 'id' in selectedChat ? selectedChat.id : null])

    const handleInputChange = async ({ value }: { value: string }) => {
        if (!value.trim()) return
        const newMessage: ChatBoxMessageList[number] = {
            id: uniqueId('user-msg-'),
            sender: { id: 'user', name: 'Tú' },
            content: value,
            timestamp: new Date(),
            type: 'regular',
            isMyMessage: true,
            showAvatar: false,
            avatarGap: false,
        }
        setLocalMessages((prev) => [...prev, newMessage])
        setTimeout(() => {
            const botResponse: ChatBoxMessageList[number] = {
                id: uniqueId('bot-msg-'),
                sender: {
                    id: 'bot',
                    name: 'Asistente IA',
                    avatarImageUrl: '/bot.png',
                },
                content: "¡Hola! Estoy procesando tu consulta con el sistema RAG. Dame un momento...",
                timestamp: new Date(),
                type: 'regular',
                isMyMessage: false,
                showAvatar: true,
                avatarGap: true,
            }
            setLocalMessages((prev) => [...prev, botResponse])
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

    // Combina mensajes del backend y locales
    const combinedMessages = [
        ...(messagesRecord ? adaptMessages(messagesRecord) : []),
        ...localMessages,
    ]
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
                            messageList={combinedMessages}
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
