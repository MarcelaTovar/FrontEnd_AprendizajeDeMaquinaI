import { useFileManagerStore } from '../store/useFileManagerStore'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiDeleteAgentBranch,
    apiDeleteAgentBranchFile,
} from '@/services/AgentsService'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

type FileManagerDeleteDialogProps = {
    onSuccess?: () => void
}

const FileManagerDeleteDialog = ({ onSuccess }: FileManagerDeleteDialogProps) => {
    const {
        deleteDialog,
        setDeleteDialog,
        deleteFile,
        fileList,
        openedDirectoryId,
    } = useFileManagerStore()

    const handleDeleteDialogClose = () => {
        setDeleteDialog({ id: '', open: false })
    }

    const handleDeleteConfirm = async () => {
        const selected = fileList.find((file) => file.id === deleteDialog.id)

        if (!selected) {
            handleDeleteDialogClose()
            return
        }

        try {
            if (selected.fileType === 'directory') {
                await apiDeleteAgentBranch(selected.name)
            } else if (openedDirectoryId) {
                await apiDeleteAgentBranchFile(openedDirectoryId, selected.name)
            }

            deleteFile(deleteDialog.id)
            setDeleteDialog({ id: '', open: false })
            onSuccess?.()
            toast.push(
                <Notification title="Eliminado correctamente" type="success" />,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Error al eliminar elemento:', error)
            toast.push(
                <Notification title="No se pudo eliminar" type="danger" />,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={deleteDialog.open}
            type="danger"
            title="Eliminar archivo"
            onClose={handleDeleteDialogClose}
            onRequestClose={handleDeleteDialogClose}
            onCancel={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
        >
            <p>
                Estas seguro de que queres eliminar este archivo? Esta accion no
                se puede deshacer.
            </p>
        </ConfirmDialog>
    )
}

export default FileManagerDeleteDialog
