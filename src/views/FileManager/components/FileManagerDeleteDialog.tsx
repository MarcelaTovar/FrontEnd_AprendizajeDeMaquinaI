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
                <Notification title="Deleted successfully" type="success" />,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Error al eliminar elemento:', error)
            toast.push(
                <Notification title="Delete failed" type="danger" />,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={deleteDialog.open}
            type="danger"
            title="Delete file"
            onClose={handleDeleteDialogClose}
            onRequestClose={handleDeleteDialogClose}
            onCancel={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
        >
            <p>
                Are you sure you want to delete file? This action can&apos;t be
                undo.{' '}
            </p>
        </ConfirmDialog>
    )
}

export default FileManagerDeleteDialog
