import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './components/SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore(state => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo type="streamline" mode={mode} imgClass="mx-auto" logoWidth={60} />
            </div>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p className="font-semibold heading-text">
                    Prueba nuestro modelo para estudio. Crea una cuenta para acceder a esta herramienta innovadora.
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert> 
            )}
            <SignUpForm disableSubmit={disableSubmit} setMessage={setMessage} />
            <div>
                <div className="mt-6 text-center">
                    <span>Tienes una cuenta todavia? </span>
                    <ActionLink
                        to={signInUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Iniciar Sesión
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
