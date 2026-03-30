import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ROUTES_PATHS } from '../routes/routes_path';
import { useAuthStore } from '../store';
import { canAccess } from '../utilities/allowed_access';
import { AccessDenied } from '../pages';
import { Header, Sidebar } from '../components/shared';


const MainLayout = () => {

    const token = localStorage.getItem("kcn_token")
    const { fetchCurrentUser, isFetched, current_user } = useAuthStore();

    useEffect(() => {
        if (!isFetched) {
            fetchCurrentUser();
        }

    }, [fetchCurrentUser, isFetched])

    const [active, setActive] = useState<string>("dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [notifOpen, setNotifOpen] = useState<boolean>(false);

    if (!token) {
        return <Navigate to={ROUTES_PATHS.AUTH.SIGNIN} />;
    }

    if (!isFetched || !current_user) {
        return <div>Loading...</div>;
    }

    if (!canAccess(["admin"], current_user?.role)) {
        return <AccessDenied />;
    }

    return (
        <div
            className={`flex h-screen bg-slate-950 overflow-hidden`}
            onClick={() => notifOpen && setNotifOpen(false)}
        >
            <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header activePage={active} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;