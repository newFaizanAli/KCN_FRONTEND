import { useEffect, useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { usePurchaseOrderStore } from '../../../store'
import { PurchaseOrder } from '../../../types'
import { STATUS_V } from '../../../constants'
import { PurchaseOrderForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Badge, Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { ROUTES_PATHS } from '../../../routes/routes_path';
import { calculateGrandTotal } from '../../../utilities/functions';


const PurchaseOrderPage = () => {
    const navigate = useNavigate()
    const [modal, setModal] = useState(false);
    const { fetchPurchaseOrders, deletePurchaseOrder, isFetched, purchase_orders } = usePurchaseOrderStore()


    const defualtValues: PurchaseOrder = {
        supplierId: null,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        tax: 0,
    }

    const [orderDefaults, setOrderDefaults] = useState<PurchaseOrder>(defualtValues as PurchaseOrder)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setOrderDefaults(defualtValues as PurchaseOrder)
        setIsEdit(false)
        setModal(false)
    }


    const handleEdit = (order: PurchaseOrder) => {
        setOrderDefaults(order)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this purchase order?")
        if (confirm) {
            deletePurchaseOrder(id)
        }
    }

    const handlePurchaseItem = (data: PurchaseOrder) => {
        navigate(ROUTES_PATHS.DASHBOARD.PURCHASE.ITEM, {
            state: {
                orderId: data?.id,
                orderStatus: data?.status
            }
        })
    }

    useEffect(() => {
        if (!isFetched) {
            fetchPurchaseOrders()
        }
    }, [fetchPurchaseOrders, isFetched])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Purchase Orders" subtitle="List of all orders"
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Button icon={Plus} onClick={() => setModal(true)}>Add Purchase Order</Button>
                            <Button variant="outline" icon={RefreshCcw} onClick={fetchPurchaseOrders}>Refresh Orders</Button>
                        </div>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'supplierName', label: 'Supplier Name', render: (s: string) => <span className="text-slate-400">{s}</span> },
                            { key: 'createdAt', label: 'Date', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },
                            { key: 'tax', label: 'Tax', render: (t: number) => <span className="text-slate-400">{t}%</span> },
                            { key: 'totalAmount', label: 'Total Amount', render: (t: number) => <span className="text-slate-400"> ₨ {t}</span> },
                            {
                                key: 'grandTotal',
                                label: 'Grand Total',
                                render: (_: any, row: PurchaseOrder) => (
                                    <span className="text-slate-400">
                                        ₨ {calculateGrandTotal(row.totalAmount as number, row.tax /*, discount if any */)}
                                    </span>
                                )
                            },
                            {
                                key: "actions", // or "saleItems" but better to use "actions"
                                label: "Purchase Items",
                                render: (_: any, row: PurchaseOrder) => (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handlePurchaseItem(row)}
                                    >
                                        View Items
                                    </Button>
                                )
                            },
                            {
                                key: "status",
                                label: "Status",
                                render: (row: string) => {

                                    return (
                                        <Badge variant={STATUS_V[row?.toLocaleUpperCase()]}>
                                            {row.toLocaleLowerCase()}
                                        </Badge>
                                    );
                                }
                            }
                        ]}
                        data={purchase_orders}
                        onEdit={(r: PurchaseOrder) => handleEdit(r)}
                        onDelete={(r: PurchaseOrder) => handleDelete(r?.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Order" : "Add Order"}>
                    <PurchaseOrderForm setModal={setModal} isEdit={isEdit} defaultValues={orderDefaults as PurchaseOrder} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default PurchaseOrderPage
