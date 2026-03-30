import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate, useLocation } from "react-router-dom"
import { useSaleItemStore } from '../../../store'
import { SaleOrderItem } from '../../../types'
import { STATUS_V } from '../../../constants'
import { SaleItemForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Badge, Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { ROUTES_PATHS } from '../../../routes/routes_path'


const SaleItemPage = () => {
    const [modal, setModal] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const { orderId, orderStatus } = location.state || {};

    const { fetchSaleItemByOrderId, deleteSaleItem, sale_items } = useSaleItemStore()

    const isApproved = orderStatus === "approved"

    const [itemsData, setItemsData] = useState<SaleOrderItem[]>([])

    const defualtValues = {
        productId: null,
        saleId: orderId,
        quantity: 1,
        price: 1,
        total: 0
    }

    const [itemDefaults, setItemDefaults] = useState<SaleOrderItem>(defualtValues as SaleOrderItem)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setItemDefaults(defualtValues as SaleOrderItem)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (order: SaleOrderItem) => {
        setItemDefaults(order)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this purchase item?")
        if (confirm) {
            deleteSaleItem(id)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchSaleItemByOrderId(orderId)
            setItemsData(resp || [])
        }

        if (orderId) {
            fetchData()
        } else {
            navigate(ROUTES_PATHS.DASHBOARD.SALE.ORDER)
        }
    }, [fetchSaleItemByOrderId, orderId, navigate, sale_items])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title={`Sale Items - Order ${orderId || "N/A"}`} subtitle="List of all sale items"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Sale Item</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'productName', label: 'Product Name', render: (p: string) => <span className="text-slate-400">{p}</span> },
                            { key: 'productSku', label: 'Product SKU', render: (p: string) => <span className="text-slate-400">{p}</span> },
                            { key: 'quantity', label: 'Quantity', render: (q: number) => <span className="text-slate-400">{q}</span> },
                            { key: 'price', label: 'Price', render: (u: number) => <span className="text-slate-400">₨ {u}</span> },
                            {
                                key: 'total',
                                label: 'Total',
                                render: (_: any, row: SaleOrderItem) => (
                                    <span className="text-slate-400">
                                        ₨ {row.price as number * row.quantity as number}
                                    </span>
                                )
                            },
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
                            },
                            {
                                key: "orderPaymentStatus",
                                label: "Payment Status",
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
                        {...(!isApproved ? { onEdit: (r: SaleOrderItem) => handleEdit(r) } : {})}
                        {...(!isApproved ? { onDelete: (r: SaleOrderItem) => handleDelete(r?.id as string) } : {})}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Sale Item" : "Add Sale Item"}>
                    <SaleItemForm setModal={setModal} isEdit={isEdit} defaultValues={itemDefaults as SaleOrderItem} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default SaleItemPage
