import { Outlet } from "react-router"
import AuthHero from "./parts/AuthHero"

const AuthLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:flex-1 flex">
            <AuthHero />
        </div>
        <div className="flex flex-1 md:flex-[2] items-center py-10 px-4 md:py-0">
            <Outlet />
        </div>
    </div>
  )
}

export default AuthLayout