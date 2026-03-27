import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import UploadMedia from '@/assets/svg/UploadMedia'
import { useFileManagerStore } from '../store/useFileManagerStore'
import {
    apiCreateAgentBranch,
    apiUploadPdfs,
} from '@/services/AgentsService'

type UploadFileProps = {
    onDataUpdated: () => void
}

const UploadFile = ({ onDataUpdated }: UploadFileProps) => {
    const { openedDirectoryId } = useFileManagerStore()
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [branchDialogOpen, setBranchDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isCreatingBranch, setIsCreatingBranch] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [targetBranch, setTargetBranch] = useState('')
    const [newBranchName, setNewBranchName] = useState('')

    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false)
        setUploadedFiles([])
        setTargetBranch('')
    }

    const handleBranchDialogClose = () => {
        setBranchDialogOpen(false)
        setNewBranchName('')
    }

    const handleUpload = async () => {
        const branchToUse = (openedDirectoryId || targetBranch).trim()

        if (!branchToUse) {
            toast.push(
                <Notification
                    title={'Una rama es necesaria para subir'}
                    type="danger"
                />,
                { placement: 'top-center' },
            )
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('branch', branchToUse)
            uploadedFiles.forEach((file) => {
                formData.append('files', file)
            })

            await apiUploadPdfs(formData)

            handleUploadDialogClose()
            onDataUpdated()
            toast.push(
                <Notification title={'Successfully uploaded'} type="success" />,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Error al subir archivos:', error)
            toast.push(
                <Notification title={'Upload failed'} type="danger" />,
                { placement: 'top-center' },
            )
        } finally {
            setIsUploading(false)
        }
    }

    const handleCreateBranch = async () => {
        const branch = newBranchName.trim()

        if (!branch) {
            return
        }

        setIsCreatingBranch(true)
        try {
            await apiCreateAgentBranch({ branch })
            handleBranchDialogClose()
            onDataUpdated()
            toast.push(
                <Notification title={'Branch created'} type="success" />,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Error al crear branch:', error)
            toast.push(
                <Notification title={'Branch creation failed'} type="danger" />,
                { placement: 'top-center' },
            )
        } finally {
            setIsCreatingBranch(false)
        }
    }

    return (
        <>
            <Button variant="default" onClick={() => setBranchDialogOpen(true)}>
                New branch
            </Button>
            <Button variant="solid" onClick={() => setUploadDialogOpen(true)}>
                Upload
            </Button>
            <Dialog
                isOpen={branchDialogOpen}
                onClose={handleBranchDialogClose}
                onRequestClose={handleBranchDialogClose}
            >
                <h4>Create Branch</h4>
                <div className="mt-6">
                    <Input
                        value={newBranchName}
                        placeholder="Branch name"
                        onChange={(e) => setNewBranchName(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <Button
                        block
                        loading={isCreatingBranch}
                        variant="solid"
                        disabled={newBranchName.trim().length === 0}
                        onClick={handleCreateBranch}
                    >
                        Create
                    </Button>
                </div>
            </Dialog>
            <Dialog
                isOpen={uploadDialogOpen}
                onClose={handleUploadDialogClose}
                onRequestClose={handleUploadDialogClose}
            >
                <h4>Upload Files</h4>
                {!openedDirectoryId && (
                    <div className="mt-4">
                        <Input
                            value={targetBranch}
                            placeholder="Target branch"
                            onChange={(e) => setTargetBranch(e.target.value)}
                        />
                    </div>
                )}
                <Upload
                    draggable
                    className="mt-6 bg-gray-100"
                    accept=".pdf"
                    multiple={true}
                    onChange={setUploadedFiles}
                    onFileRemove={setUploadedFiles}
                >
                    <div className="my-4 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <UploadMedia height={150} width={200} />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Drop your files here, or{' '}
                            </span>
                            <span className="text-blue-500">browse</span>
                        </p>
                        <p className="mt-1 font-semibold opacity-60 dark:text-white">
                            through your machine
                        </p>
                    </div>
                </Upload>
                <div className="mt-4">
                    <Button
                        block
                        loading={isUploading}
                        variant="solid"
                        disabled={uploadedFiles.length === 0}
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default UploadFile
