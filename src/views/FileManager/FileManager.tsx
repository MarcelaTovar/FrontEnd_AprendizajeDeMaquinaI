import { useEffect } from 'react'
import Table from '@/components/ui/Table'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import FileManagerHeader from './components/FileManagerHeader'
import FileSegment from './components/FileSegment'
import FileList from './components/FileList'
import FileDetails from './components/FileDetails'
import FileManagerDeleteDialog from './components/FileManagerDeleteDialog'
import FileManagerInviteDialog from './components/FileManagerInviteDialog'
import FileManagerRenameDialog from './components/FileManagerRenameDialog'
import { useFileManagerStore } from './store/useFileManagerStore'
import {
    apiGetAgentBranchFiles,
    apiGetAgentsBranches,
    apiRebuildEmbeddings,
} from '@/services/AgentsService'
import useSWRMutation from 'swr/mutation'
import { GetFileListResponse } from './types'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const { THead, Th, Tr } = Table

type BranchesApiResponse = {
    branches: string[]
}

type BranchFilesApiResponse = {
    branch: string
    files: string[]
}

const createBaseFile = (id: string, name: string, fileType: string) => {
    const now = Math.floor(Date.now() / 1000)

    return {
        id,
        name,
        fileType,
        srcUrl: '',
        size: 0,
        author: {
            name: '',
            email: '',
            img: '',
        },
        activities: [
            {
                userName: '',
                userImg: '',
                actionType: 'created',
                timestamp: now,
            },
        ],
        permissions: [],
        uploadDate: now,
        recent: false,
    }
}

const getFileExtension = (fileName: string) => {
    const splitName = fileName.split('.')
    return splitName.length > 1
        ? splitName[splitName.length - 1].toLowerCase()
        : 'doc'
}

async function getBranches(_: string, { arg }: { arg: string }) {
    try {
        if (arg) {
            const data =
                await apiGetAgentBranchFiles<BranchFilesApiResponse>(arg)

            return {
                directory: [{ id: data.branch, label: data.branch }],
                list: data.files.map((fileName) =>
                    createBaseFile(fileName, fileName, getFileExtension(fileName)),
                ),
            } as GetFileListResponse
        }

        const data = await apiGetAgentsBranches<BranchesApiResponse>()

        return {
            directory: [],
            list: data.branches.map((branchName) =>
                createBaseFile(branchName, branchName, 'directory'),
            ),
        } as GetFileListResponse
    } catch (error) {
        console.error('Error al obtener archivos de la branch:', error)
        return {
            directory: [],
            list: [],
        } as GetFileListResponse
    }
}

const FileManager = () => {
    const {
        layout,
        fileList,
        setFileList,
        setDeleteDialog,
        setInviteDialog,
        setRenameDialog,
        openedDirectoryId,
        setOpenedDirectoryId,
        setDirectories,
        setSelectedFile,
    } = useFileManagerStore()

    const { trigger, isMutating } = useSWRMutation(
        `/api/files/${openedDirectoryId}`,
        getBranches,
        {
            onSuccess: (resp) => {
                setDirectories(resp.directory)
                setFileList(resp.list)
            },
        },
    )

    const refreshCurrentView = () => {
        trigger(openedDirectoryId)
    }

    useEffect(() => {
        if (fileList.length === 0) {
            trigger(openedDirectoryId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleShare = (id: string) => {
        setInviteDialog({ id, open: true })
    }

    const handleDelete = (id: string) => {
        setDeleteDialog({ id, open: true })
    }

    const handleDownload = () => {
        const blob = new Blob(
            [
                'Feature not worked',
            ],
            { type: 'text/plain;charset=utf-8' },
        )

        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'sample-dowoad-file'
        document.body.appendChild(link)

        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
    }

    const handleRename = (id: string) => {
        setRenameDialog({ id, open: true })
    }

    const handleOpen = (id: string) => {
        setOpenedDirectoryId(id)
        trigger(id)
    }

    const handleEntryClick = () => {
        setOpenedDirectoryId('')
        trigger('')
    }

    const handleDirectoryClick = (id: string) => {
        setOpenedDirectoryId(id)
        trigger(id)
    }

    const handleClick = (fileId: string) => {
        setSelectedFile(fileId)
    }

    const handleRebuildEmbeddings = async () => {
        try {
            await apiRebuildEmbeddings(
                openedDirectoryId ? { branch: openedDirectoryId } : {},
            )
            toast.push(
                <Notification title="Embeddings rebuilt" type="success" />,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Error al reconstruir embeddings:', error)
            toast.push(
                <Notification
                    title="Failed to rebuild embeddings"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        }
    }

    return (
        <>
            <div>
                <FileManagerHeader
                    onEntryClick={handleEntryClick}
                    onDirectoryClick={handleDirectoryClick}
                    onDataUpdated={refreshCurrentView}
                    onRebuildEmbeddings={handleRebuildEmbeddings}
                />
                <div className="mt-6">
                    {isMutating ? (
                        layout === 'grid' ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
                                {[...Array(4).keys()].map((item) => (
                                    <FileSegment
                                        key={item}
                                        loading={isMutating}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Table>
                                <THead>
                                    <Tr>
                                        <Th>File</Th>
                                        <Th>Size</Th>
                                        <Th>Type</Th>
                                        <Th></Th>
                                    </Tr>
                                </THead>
                                <TableRowSkeleton
                                    avatarInColumns={[0]}
                                    columns={4}
                                    rows={5}
                                    avatarProps={{
                                        width: 30,
                                        height: 30,
                                    }}
                                />
                            </Table>
                        )
                    ) : (
                        <FileList
                            fileList={fileList}
                            layout={layout}
                            onDownload={handleDownload}
                            onShare={handleShare}
                            onDelete={handleDelete}
                            onRename={handleRename}
                            onOpen={handleOpen}
                            onClick={handleClick}
                        />
                    )}
                </div>
            </div>
            <FileDetails onShare={handleShare} />
            <FileManagerDeleteDialog onSuccess={refreshCurrentView} />
            <FileManagerInviteDialog />
            <FileManagerRenameDialog />
        </>
    )
}

export default FileManager
