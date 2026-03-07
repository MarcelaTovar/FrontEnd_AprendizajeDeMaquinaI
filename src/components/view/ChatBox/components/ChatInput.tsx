import { forwardRef, useState, useRef } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import hooks from '@/components/ui/hooks'
import { TbArrowRight, TbPlus, TbPaperclip, TbBook } from 'react-icons/tb'
import type { KeyboardEvent } from 'react'

export type ChatInputProps = {
    placeholder?: string
    onInputChange?: (payload: { value: string; attachments: File[] }) => void
    onReferencesClick?: () => void
}

const { useMergeRef } = hooks

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>((props, ref) => {
    const [attachments, setAttachments] = useState<File[]>([])
    const [menuOpen, setMenuOpen] = useState(false)

    const { placeholder, onInputChange, onReferencesClick } = props

    const inputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const handleInputClear = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        setAttachments([])
    }

    const handleChange = () => {
        if (inputRef.current?.value) {
            onInputChange?.({
                value: inputRef.current?.value || '',
                attachments,
            })
            handleInputClear()
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onInputChange?.({
                value: inputRef.current?.value || '',
                attachments,
            })
            handleInputClear()
        }
    }

    return (
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl min-h-[50px] px-3 flex flex-col">
            {attachments.length > 0 && (
                <Upload
                    fileList={attachments}
                    fileListClass="flex gap-4"
                    fileItemClass="flex gap-8"
                    onFileRemove={setAttachments}
                >
                    <></>
                </Upload>
            )}

            {/* Input row */}
            <div className="flex items-center gap-2 w-full h-[50px]">
                <input
                    ref={useMergeRef(inputRef, ref)}
                    className="flex-1 h-full placeholder:text-gray-400 bg-transparent focus:outline-none heading-text"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    size="xs"
                    shape="circle"
                    variant="solid"
                    icon={<TbArrowRight />}
                    onClick={handleChange}
                />
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center gap-1 pb-2 border-t border-gray-200 dark:border-gray-700 pt-2 relative">

                {/* + Button */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-all duration-200"
                    style={menuOpen ? {
                        transform: 'rotate(45deg)',
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                    } : undefined}
                >
                    <TbPlus />
                </button>

                {/* Popup menu */}
                {menuOpen && (
                    <div
                        ref={menuRef}
                        className="absolute bottom-full left-0 mb-2 rounded-xl shadow-lg overflow-hidden z-50 min-w-[180px] border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: 'var(--neutral)', }}
                    >
                        {/* Insertar archivo */}
                        <Upload
                            fileList={attachments}
                            showList={false}
                            onChange={(files) => {
                                setAttachments(files)
                                setMenuOpen(false)
                            }}
                        >
                            <button
                                type="button"
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm heading-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <TbPaperclip className="text-lg text-gray-400 dark:text-gray-500" />
                                <span>Insertar archivo</span>
                            </button>
                        </Upload>

                        {/* Divider */}
                        <hr />

                        {/* Referencias */}
                        <button
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm heading-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => {
                                onReferencesClick?.()
                                setMenuOpen(false)
                            }}
                        >
                            <TbBook className="text-lg text-gray-400 dark:text-gray-500" />
                            <span>Referencias</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
})

ChatInput.displayName = 'ChatInput'

export default ChatInput