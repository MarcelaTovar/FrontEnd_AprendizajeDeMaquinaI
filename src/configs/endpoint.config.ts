export const apiPrefix = '/api'

const endpointConfig = {
    //auth
    signIn: '/auth/login',
    signOut: '/auth/logout',
    signUp: '/auth/register',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',

    // Chats
    chatList: '/chat/', // GET
    chatCreate: '/chat/', // POST
    chatDelete: '/chat/', // DELETE
    chatMessageDelete: (chatId: string) => `/chat/message/${chatId}/`, // DELETE
    chatHealthList: '/chat/health/', // GET
    // Messages
    chatMessageRead: (chatId: string) => `/chat/message/${chatId}/`, // GET
    chatMessageSend: (chatId: string) => `/chat/message/${chatId}/`, // POST

    agentsBranchesList: '/agents/branches/', // GET
    agentsBranchesCreate: '/agents/branches/create/', // POST
    agentsBranchesDelete: (branch: string) => `/agents/branches/${branch}/`, // DELETE
    agentsBranchesFilesList: (branch: string) => `/agents/branches/${branch}/files/`, // GET
    agentsBranchesFilesDelete: (branch: string, filename: string) => `/agents/branches/${branch}/files/${filename}/`, // DELETE
    agentsRebuildEmbeddings: '/agents/rebuild-embeddings/', // POST
    agentsUploadPdfs: '/agents/upload-pdfs/', // POST
};

export default endpointConfig
