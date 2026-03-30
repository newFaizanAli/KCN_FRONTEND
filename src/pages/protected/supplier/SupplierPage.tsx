import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Supplier } from '../../../types'
import { useSupplierStore } from '../../../store'
import { SupplierForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'



const SupplierPage = () => {
    const [modal, setModal] = useState(false);
    const { fetchSuppliers, deleteSupplier, isFetched, suppliers } = useSupplierStore()

    const defualtValues = {
        name: "",
        email: "",
        phone: "",
        address: "",
    }

    const [supplierDefaults, setSupplierDefaults] = useState<Supplier>(defualtValues)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setSupplierDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (sup: Supplier) => {
        setSupplierDefaults(sup)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this supplier?")
        if (confirm) {
            deleteSupplier(id)
        }
    }


    useEffect(() => {
        if (!isFetched) {
            fetchSuppliers()
        }
    }, [fetchSuppliers, isFetched])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Suppliers" subtitle="List of all supplier"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Supplier</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "name", label: "Name", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "email", label: "Email", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "phone", label: "Phone", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        ]}
                        data={suppliers}
                        onEdit={(r: Supplier) => handleEdit(r)}
                        onDelete={(r: Supplier) => handleDelete(r.id || '')}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Supplier" : "Add Supplier"}>
                    <SupplierForm setModal={setModal} isEdit={isEdit}
                        defaultValues={supplierDefaults} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default SupplierPage
