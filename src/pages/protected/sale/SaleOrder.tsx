import { useEffect, useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import { useSaleOrderStore } from '../../../store'
import { SalesOrder } from '../../../types'
import { STATUS_V } from '../../../constants'
import { SaleOrderForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Badge, Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { ROUTES_PATHS } from '../../../routes/routes_path';
import { calculateGrandTotal } from '../../../utilities/functions';


const SaleOrderPage = () => {
    const navigate = useNavigate()
    const [modal, setModal] = useState(false);
    const { fetchSaleOrders, deleteSaleOrder, isFetched, sale_orders } = useSaleOrderStore()

    const defualtValues: SalesOrder = {
        customerId: null,
        status: "pending",
        payment_status: "paid",
        tax: 0,
        discount: 0,
        createdAt: new Date().toISOString().split("T")[0],
    }

    const [orderDefaults, setOrderDefaults] = useState<SalesOrder>(defualtValues as SalesOrder)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setOrderDefaults(defualtValues as SalesOrder)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (order: SalesOrder) => {
        setOrderDefaults(order)
        setIsEdit(true)
        setModal(true)

    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this sale order?")
        if (confirm) {
            deleteSaleOrder(id)
        }
    }

    const handlePurchaseItem = (data: SalesOrder) => {
        navigate(ROUTES_PATHS.DASHBOARD.SALE.ITEM, {
            state: {
                orderId: data?.id,
                orderStatus: data?.status
            }
        })
    }

    useEffect(() => {
        if (!isFetched) {
            fetchSaleOrders()
        }
    }, [fetchSaleOrders, isFetched])

    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Sale Orders" subtitle="List of all orders"
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Button icon={Plus} onClick={() => setModal(true)}>Add Sale Order</Button>
                            <Button variant="outline" icon={RefreshCcw} onClick={fetchSaleOrders}>Refresh Orders</Button>
                        </div>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'customerName', label: 'Customer Name', render: (s: string) => <span className="text-slate-400">{s || "N/A"}</span> },
                            { key: 'total_amount', label: 'Total Amount', render: (t: number) => <span className="text-slate-400">{t | 0}</span> },
                            { key: 'discount', label: 'Discount', render: (t: number) => <span className="text-slate-400">{t | 0}</span> },
                            { key: 'tax', label: 'Tax', render: (t: number) => <span className="text-slate-400">{t | 0}</span> },
                            {
                                key: 'grandTotal',
                                label: 'Grand Total',
                                render: (_: any, row: SalesOrder) => (
                                    <span className="text-slate-400">
                                        ₨ {calculateGrandTotal(row.total_amount as number, row.tax, row.discount)}
                                    </span>
                                )
                            },
                            { key: 'createdAt', label: 'Date', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },
                            {
                                key: "actions", // or "saleItems" but better to use "actions"
                                label: "Sale Items",
                                render: (_: any, row: SalesOrder) => (
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
                                key: "payment_status",
                                label: "Payment Status",
                                render: (row: string) => {

                                    return (
                                        <Badge variant={STATUS_V[row?.toLocaleUpperCase()]}>
                                            {row.toLocaleLowerCase()}
                                        </Badge>
                                    );
                                }
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
                        data={sale_orders}
                        onEdit={(r: SalesOrder) => handleEdit(r)}
                        onDelete={(r: SalesOrder) => handleDelete(r?.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Order" : "Add Order"}>
                    <SaleOrderForm setModal={setModal} isEdit={isEdit} defaultValues={orderDefaults as SalesOrder} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default SaleOrderPage
