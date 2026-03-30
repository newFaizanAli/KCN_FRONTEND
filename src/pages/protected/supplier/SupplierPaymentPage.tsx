import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { SupplierPayment } from '../../../types'
import { useSupplierPaymentStore } from '../../../store'
import { SupplierPaymentForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'


const SupplierPaymentPage = () => {
    const [modal, setModal] = useState(false);
    const { fetchSupplierPayment, deleteSupplierPayment, isFetched, supplier_payments } = useSupplierPaymentStore()

    const defualtValues = {
        supplierId: null,
        amount: 1,
        payment_method: "cash",
        reference: "",
        createdAt: new Date().toISOString().split("T")[0]
    }

    const [paymentDefaults, setPaymentDefaults] = useState<SupplierPayment>(defualtValues)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setPaymentDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (pay: SupplierPayment) => {
        setPaymentDefaults(pay)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this payment?")
        if (confirm) {
            deleteSupplierPayment(id)
        }
    }

    useEffect(() => {
        if (!isFetched) {
            fetchSupplierPayment()
        }
    }, [fetchSupplierPayment, isFetched])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Supplier Payments" subtitle="List of all payments"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Supplier Payment</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "supplierName", label: "Supplier Name", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "payment_method", label: "Payment Method", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "amount", label: "Amount", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "createdAt", label: "Date", render: (v: string) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },
                        ]}
                        data={supplier_payments}
                        onEdit={(r: SupplierPayment) => handleEdit(r)}
                        onDelete={(r: SupplierPayment) => handleDelete(r.id || '')}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()}
                    title={isEdit ? "Edit Payment Supplier" : "Add Payment Supplier"}>
                    <SupplierPaymentForm setModal={setModal} isEdit={isEdit}
                        defaultValues={paymentDefaults} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default SupplierPaymentPage
