import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"
import { usePurchaseItemStore } from '../../../store'
import { PurchaseOrderItem } from '../../../types'
import { STATUS_V } from '../../../constants'
import { PurchaseItemForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Badge, Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { ROUTES_PATHS } from '../../../routes/routes_path'


const PurchaseItemPage = () => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const { orderId, orderStatus } = location.state || {}


    const { fetchPurchaseItemByOrderId, deletePurchaseItem, purchase_items } = usePurchaseItemStore()

    const isApproved = orderStatus === "approved"

    const [itemsData, setItemsData] = useState<PurchaseOrderItem[]>([])

    const defualtValues = {
        productId: null,
        purchaseId: orderId,
        quantity: 1,
        unit_cost: 1,
        total: 0
    }

    const [itemDefaults, setItemDefaults] = useState<PurchaseOrderItem>(defualtValues as PurchaseOrderItem)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setItemDefaults(defualtValues as PurchaseOrderItem)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (order: PurchaseOrderItem) => {
        setItemDefaults(order)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this purchase item?")
        if (confirm) {
            deletePurchaseItem(id)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchPurchaseItemByOrderId(orderId)
            setItemsData(resp || [])
        }

        if (orderId) {
            fetchData()
        } else {
            navigate(ROUTES_PATHS.DASHBOARD.PURCHASE.ORDER)
        }
    }, [fetchPurchaseItemByOrderId, orderId, navigate, purchase_items])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title={`Purchase Items - Order ${orderId || "N/A"}`} subtitle="List of all purchase items"
                    actions={
                        !isApproved ? <Button icon={Plus} onClick={() => setModal(true)}>Add Purchase Item</Button>
                            : <></>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'productName', label: 'Product Name', render: (p: string) => <span className="text-slate-400">{p}</span> },
                            { key: 'productSku', label: 'Product SKU', render: (p: string) => <span className="text-slate-400">{p}</span> },
                            { key: 'quantity', label: 'Quantity', render: (q: number) => <span className="text-slate-400">{q}</span> },
                            { key: 'unit_cost', label: 'Unit Cost', render: (u: number) => <span className="text-slate-400">₨ {u}</span> },
                            { key: 'total', label: 'Total', render: (t: number) => <span className="text-slate-400">₨ {t}</span> },
                            {
                                key: "orderStatus",
                                label: "Order Status",
                                render: (row: string) => {

                                    return (
                                        <Badge variant={STATUS_V[row?.toLocaleUpperCase()]}>
                                            {row.toLocaleLowerCase()}
                                        </Badge>
                                    );
                                }
                            }
                        ]}
                        data={itemsData}
                        {...(!isApproved ? { onEdit: (r: PurchaseOrderItem) => handleEdit(r) } : {})}
                        {...(!isApproved ? { onDelete: (r: PurchaseOrderItem) => handleDelete(r?.id as string) } : {})}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Purchase Item" : "Add Purchase Item"}>
                    <PurchaseItemForm setModal={setModal} isEdit={isEdit} defaultValues={itemDefaults as PurchaseOrderItem} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default PurchaseItemPage
