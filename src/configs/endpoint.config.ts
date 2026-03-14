export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    signUp: '/auth/register',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
}

export default endpointConfig
