import { useRef, useState, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import ScrollBar from '@/components/ui/ScrollBar'
import NewChat from './NewChat'
import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import classNames from '@/utils/classNames'
import useDebounce from '@/utils/hooks/useDebounce'
import { TbVolumeOff, TbSearch, TbX } from 'react-icons/tb'
import { TbTrash } from "react-icons/tb";
import dayjs from 'dayjs'
import type { ChangeEvent } from 'react'
import type { ChatSummary } from '@/@types/types'
import { deleteChat } from '@/services/ChatService'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

const ChatList = () => {

    const [dialogIsOpen, setIsOpen] = useState(false)


    const setChats = useChatStore((state) => state.setChats)
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)
    const setMessagesRecord = useChatStore((state) => state.setMessagesRecord)
    const setMessageFetched = useChatStore((state) => state.setMessageFetched)
    const setChatsFetched = useChatStore((state) => state.setChatsFetched)
    const [deletingId, setDeletingId] = useState<string | number | null>(null)

    const openDialog = (chatId: string | number) => {
        setDeletingId(chatId)
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
        setDeletingId(null)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        if (deletingId !== null) {
            handleDeleteChat(deletingId)
        }
        setIsOpen(false)
    }

    async function handleDeleteChat(chatId: string | number) {
        try {
            await deleteChat(chatId)
            await fetchChats()
            if (selectedChat && 'id' in selectedChat && selectedChat.id === chatId) {
                setSelectedChat({})
                setMessagesRecord([])
                setMessageFetched(false)
            }
            setChatsFetched(false)
        } catch (e) {
            console.error('Error deleting chat:', e)
        }
        setDeletingId(null)
    }
    const chats = useChatStore((state) => state.chats)
    const chatsFetched = useChatStore((state) => state.chatsFetched)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const setMobileSidebar = useChatStore((state) => state.setMobileSidebar)

    const inputRef = useRef<HTMLInputElement>(null)

    const [showSearchBar, setShowSearchBar] = useState(false)
    const [queryText, setQueryText] = useState('')

    const { fetchChats } = useChat()

    useEffect(() => {
        if (!chatsFetched) {
            fetchChats()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (showSearchBar) {
            inputRef.current?.focus()
        } else {
            inputRef.current?.blur()
        }
    }, [showSearchBar])

    const handleChatClick = (chat: ChatSummary) => {
        setSelectedChat(chat)
        setMobileSidebar(false)
    }

    function handleDebounceFn(e: ChangeEvent<HTMLInputElement>) {
        setQueryText(e.target.value)
    }

    const debounceFn = useDebounce(handleDebounceFn, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e)
    }

    const handleSearchToggleClick = () => {
        setShowSearchBar(!showSearchBar)
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    {showSearchBar ? (
                        <input
                            ref={inputRef}
                            className="flex-1 h-full placeholder:text-gray-400 placeholder:text-base placeholder:font-normal bg-transparent focus:outline-none heading-text font-bold"
                            placeholder="Search chat"
                            onChange={handleInputChange}
                        />
                    ) : (
                        <h4>Chat</h4>
                    )}
                    <button
                        className="close-button text-lg"
                        type="button"
                        onClick={handleSearchToggleClick}
                    >
                        {showSearchBar ? <TbX /> : <TbSearch />}
                    </button>
                </div>
            </div>
            <ScrollBar className="h-[calc(100%-150px)] overflow-y-auto">
                <div className="flex flex-col gap-2 h-full">
                    {chats.map((item) => {
                        const selectedChatId = selectedChat && 'id' in selectedChat ? selectedChat.id : null;
                        return (
                            <div
                                key={item.id}
                                className={classNames(
                                    'py-3 px-2 flex items-center gap-2 justify-between rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 relative select-none',
                                    selectedChatId === item.id &&
                                    'bg-gray-100 dark:bg-gray-700',
                                )}
                            >
                                <div
                                    className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                                    role="button"
                                    onClick={() => handleChatClick(item)}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between">
                                            <div className="font-bold heading-text truncate flex gap-2 items-center">
                                                <span>{item.title}</span>
                                            </div>
                                        </div>
                                        <div className="truncate">
                                            {item.id}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <button
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        title="Eliminar chat"
                                        disabled={deletingId === item.id}
                                        onClick={() =>
                                            openDialog(item.id)}
                                    >
                                        <TbTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollBar>
            <NewChat />
            <Dialog
                isOpen={dialogIsOpen}
                style={{
                    content: {
                        marginTop: 250,
                    },
                }}
                contentClassName="pb-0 px-0"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="px-6 pb-6">
                    <h5 className="mb-4">Deseas Eliminar este Chat?</h5>
                    <p>
                        Si eliminas este chat, se borrarán todos los mensajes asociados a él y no podrás recuperarlos. Esta acción es irreversible. Asegúrate de haber guardado cualquier información importante antes de proceder con la eliminación.
                    </p>
                </div>
                <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Okay
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ChatList
