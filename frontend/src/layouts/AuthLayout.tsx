import LoginForm from "../features/auth/components/LoginForm"

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
        <div className="flex flex-1 justify-center items-center">
            <p>KIRI</p>
        </div>
        <div className="flex flex-1 items-center">
            <LoginForm />
        </div>
    </div>
  )
}

export default AuthLayout