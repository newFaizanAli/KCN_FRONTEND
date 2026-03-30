import { useEffect, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { useStockStore } from "../../../store";
import { PageHeader } from "../../../components/page";
import { Button, Card } from "../../../components/ui";
import { Modal, SuspenseWrap, DataTable } from "../../../components/shared";
import { StockForm } from "../../../forms";
import { Stock } from "../../../types";

const StockPage = () => {

    const [modal, setModal] = useState(false);
    const { fetchStocks, deleteStock, isFetched, stocks } = useStockStore();

    const defualtValues = {
        productId: null,
        quantity: 0,
        serial_number: null
    }

    const [stockDefaults, setStockDefaults] = useState<Stock>(defualtValues)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setStockDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (product: Stock) => {
        setStockDefaults(product)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this stock?")
        if (confirm) {
            deleteStock(id)
        }
    }

    useEffect(() => {
        if (!isFetched) {
            fetchStocks()
        }
    }, [fetchStocks, isFetched])




    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Stocks" subtitle="List of all stocks"
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Button icon={Plus} onClick={() => setModal(true)}>Add Stock</Button>
                            <Button variant="outline" icon={RefreshCcw} onClick={fetchStocks}>Refresh Stock</Button>
                        </div>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "productName", label: "Product Name", render: (s: string) => <span className="text-slate-400">{s || 0}</span> },
                            { key: "serial_number", label: "Serial Number", render: (v: string) => <span className="text-slate-400">{v || 'N/A'}</span> },
                            { key: "quantity", label: "Quantity", render: (s: number) => <span className="text-slate-400">{s || 0}</span> },
                        ]}
                        data={stocks}
                        onEdit={(r: Stock) => handleEdit(r)}
                        onDelete={(r: Stock) => handleDelete(r.id || '')}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Product" : "Add Product"}>
                    <StockForm setModal={setModal} isEdit={isEdit}
                        defaultValues={stockDefaults} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default StockPage
