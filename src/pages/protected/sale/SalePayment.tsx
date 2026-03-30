import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useSalePaymentStore } from '../../../store'
import { SalePayment } from '../../../types'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { SalePaymentForm } from '../../../forms';


const SalePaymentPage = () => {
    const [modal, setModal] = useState(false);
    const { fetchSalePayments, deleteSalePayment, isFetched, sale_payments } = useSalePaymentStore()

    const defualtValues: SalePayment = {
        saleId: null,
        method: "cash",
        reference_id: "",
        note: "",
        type: "sale",
        createdAt: new Date().toISOString().split("T")[0],
    }

    const [paymentDefaults, setPaymentDefaults] = useState<SalePayment>(defualtValues as SalePayment)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setPaymentDefaults(defualtValues as SalePayment)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (order: SalePayment) => {
        setPaymentDefaults(order)
        setIsEdit(true)
        setModal(true)

    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this sale payment?")
        if (confirm) {
            deleteSalePayment(id)
        }
    }

    useEffect(() => {
        if (!isFetched) {
            fetchSalePayments()
        }
    }, [fetchSalePayments, isFetched])



    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Sale Payments" subtitle="List of all payments"
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Button icon={Plus} onClick={() => setModal(true)}>Add Sale Payment</Button>
                        </div>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'saleId', label: 'Sale ID', render: (s: string) => <span className="text-slate-400">{s || "N/A"}</span> },
                            { key: 'customerName', label: 'Customer Name', render: (s: string) => <span className="text-slate-400">{s || "N/A"}</span> },
                            { key: 'method', label: 'Method', render: (s: string) => <span className="text-slate-400">{s || "N/A"}</span> },
                            { key: 'referenceId', label: 'Reference ID', render: (s: string) => <span className="text-slate-400">{s || "N/A"}</span> },
                            { key: 'createdAt', label: 'Date', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },

                        ]}
                        data={sale_payments}
                        onEdit={(r: SalePayment) => handleEdit(r)}
                        onDelete={(r: SalePayment) => handleDelete(r?.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Payment" : "Add Payment"}>
                    <SalePaymentForm setModal={setModal} isEdit={isEdit} defaultValues={paymentDefaults as SalePayment} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default SalePaymentPage
