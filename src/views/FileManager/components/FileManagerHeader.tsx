import { Fragment, useState } from 'react'
import Segment from '@/components/ui/Segment'
import UploadFile from './UploadFile'
import { useFileManagerStore } from '../store/useFileManagerStore'
import { TbChevronRight, TbLayoutGrid, TbList } from 'react-icons/tb'
import type { Layout } from '../types'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

type FileManagerHeaderProps = {
    onEntryClick: () => void
    onDirectoryClick: (id: string) => void
    onDataUpdated: () => void
    onRebuildEmbeddings: () => Promise<void>
}

const FileManagerHeader = ({
    onEntryClick,
    onDirectoryClick,
    onDataUpdated,
    onRebuildEmbeddings,
}: FileManagerHeaderProps) => {
    const { directories, layout, setLayout } = useFileManagerStore()
    const [rebuildDialogOpen, setRebuildDialogOpen] = useState(false)
    const [isRebuilding, setIsRebuilding] = useState(false)

    const handleEntryClick = () => {
        onEntryClick()
    }

    const handleDirectoryClick = (id: string) => {
        onDirectoryClick(id)
    }

    const handleRebuildDialogClose = () => {
        if (!isRebuilding) {
            setRebuildDialogOpen(false)
        }
    }

    const handleRebuildConfirm = async () => {
        setIsRebuilding(true)
        try {
            await onRebuildEmbeddings()
            setRebuildDialogOpen(false)
        } finally {
            setIsRebuilding(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                {directories.length > 0 ? (
                    <div className="flex items-center gap-2">
                        <h3 className="flex items-center gap-2 text-base sm:text-2xl">
                            <span
                                className="hover:text-primary cursor-pointer"
                                role="button"
                                onClick={handleEntryClick}
                            >
                                Gestor de archivos
                            </span>
                            {directories.map((dir, index) => (
                                <Fragment key={dir.id}>
                                    <TbChevronRight className="text-lg" />
                                    {directories.length - 1 === index ? (
                                        <span>{dir.label}</span>
                                    ) : (
                                        <span
                                            className="hover:text-primary cursor-pointer"
                                            role="button"
                                            onClick={() =>
                                                handleDirectoryClick(dir.id)
                                            }
                                        >
                                            {dir.label}
                                        </span>
                                    )}
                                </Fragment>
                            ))}
                        </h3>
                    </div>
                ) : (
                    <h3>Gestor de archivos</h3>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Segment
                    value={layout}
                    onChange={(val) => setLayout(val as Layout)}
                >
                    <Segment.Item value="grid" className="text-xl px-3">
                        <TbLayoutGrid />
                    </Segment.Item>
                    <Segment.Item value="list" className="text-xl px-3">
                        <TbList />
                    </Segment.Item>
                </Segment>
                <Button
                    variant="default"
                    onClick={() => setRebuildDialogOpen(true)}
                >
                    Reconstruir embeddings
                </Button>
                <UploadFile onDataUpdated={onDataUpdated} />
            </div>
            <Dialog
                isOpen={rebuildDialogOpen}
                onClose={handleRebuildDialogClose}
                onRequestClose={handleRebuildDialogClose}
            >
                <h4>Confirmar reconstruccion de embeddings</h4>
                <p className="mt-4">
                    Esta accion puede tardar varios minutos segun la cantidad
                    de documentos. Queres continuar?
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        size="sm"
                        disabled={isRebuilding}
                        onClick={handleRebuildDialogClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        loading={isRebuilding}
                        onClick={handleRebuildConfirm}
                    >
                        Confirmar
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default FileManagerHeader
