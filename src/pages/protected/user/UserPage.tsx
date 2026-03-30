import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useUserStore } from "../../../store";
import { STATUS_V } from "../../../constants";
import { UserForm } from "../../../forms";
import { Modal, SuspenseWrap, DataTable } from "../../../components/shared";
import { Button, Alert, Card, Badge } from "../../../components/ui";
import { PageHeader } from "../../../components/page";
import { User } from "../../../types";



const UserPage = () => {

    const [modal, setModal] = useState(false);
    const { users, fetchUsers, isFetched } = useUserStore()

    const defaultValues = {
        name: "",
        email: "",
        role: "sub_admin",
        password: "",
        status: true
    }

    const [userDefaults, setUserDefaults] = useState<User>(defaultValues as User)
    const [isEdit, setIsEdit] = useState(false)


    useEffect(() => {
        if (!isFetched) {
            fetchUsers()
        }
    }, [fetchUsers, isFetched])

    const handleEdit = (user: User) => {
        setUserDefaults(user)
        setIsEdit(true)
        setModal(true)
    }

    const handleClose = () => {
        setUserDefaults(defaultValues as User)
        setIsEdit(false)
        setModal(false)
    }

    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="User Management" subtitle="Admin & sub-admin accounts"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add User</Button>
                    }
                />
                <Alert variant="info" className="mb-5">Only <strong>admins</strong> can access this users page.</Alert>
                <Card>
                    <DataTable
                        columns={[
                            {
                                key: "name", label: "Name", render: (v: string) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{v[0]}</div>
                                        <span className="text-white">{v}</span>
                                    </div>
                                )
                            },
                            { key: "email", label: "Email", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "role", label: "Role", render: (v: 'admin' | 'sub_admin') => <Badge variant={v === "admin" ? "admin" : "sub_admin"}>{v}</Badge> },
                            {
                                key: "status",
                                label: "Status",
                                render: (row: boolean) => {

                                    const isActive = row === true

                                    const status = isActive ? "ACTIVE" : "INACTIVE";
                                    const variant = isActive ? "Active" : "Inactive";

                                    return (
                                        <Badge variant={STATUS_V[variant]}>
                                            {status}
                                        </Badge>
                                    );
                                }
                            }
                        ]}
                        data={users}
                        onEdit={(r: User) => handleEdit(r)}
                        onDelete={(r: User) => alert("Delete: " + r.name)}
                    />
                </Card>

                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit User" : "Add Admin User"}>
                    <UserForm setModal={setModal} isEdit={isEdit} defaultValues={userDefaults} handleClose={handleClose} />
                </Modal>

            </div>
        </SuspenseWrap>
    )
}

export default UserPage
