import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        // flex h-screen bg-slate-950 overflow-hidden text-white
        <div
            className={``}>
            <Outlet />
        </div>
    )
}

export default AuthLayout
