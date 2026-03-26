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

    getfiles: '/files/' //files
};

export default endpointConfig
