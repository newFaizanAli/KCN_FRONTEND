import { useEffect, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { useTransactionStore } from "../../../store";
import { StockTransaction } from "../../../types";
import { StockTransactionForm } from "../../../forms";
import { PageHeader } from "../../../components/page";
import { Button, Card } from "../../../components/ui";
import { Modal, SuspenseWrap, DataTable } from "../../../components/shared";

const StockTransactionPage = () => {

    const [modal, setModal] = useState(false);
    const { fetchStockTransactions, deleteStockTransaction, isFetched, stock_transactions } = useTransactionStore();

    const defualtValues: StockTransaction = {
        stockId: null,
        quantity: 1,
        type: null,
        reference_id: null,
        notes: null,
    }

    const [transactionDefaults, setTransactionDefaults] = useState<StockTransaction>(defualtValues)

    const handleClose = () => {
        setTransactionDefaults(defualtValues)
        setModal(false)
    }


    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this transaction?")
        if (confirm) {
            deleteStockTransaction(id)
        }
    }

    useEffect(() => {
        if (!isFetched) {
            fetchStockTransactions()
        }
    }, [fetchStockTransactions, isFetched])



    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Stock Transactions" subtitle="List of all stock transactions"
                    actions={
                        <div className="flex flex-wrap gap-2">
                            <Button icon={Plus} onClick={() => setModal(true)}>Add Transaction</Button>
                            <Button variant="outline" icon={RefreshCcw} onClick={fetchStockTransactions}>Refresh Transaction</Button>
                        </div>

                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "productName", label: "Product Name", render: (s: string) => <span className="text-slate-400">{s || 'N/A'}</span> },
                            { key: "stockSerialNumber", label: "Stock Serial Number", render: (s: string) => <span className="text-slate-400">{s || 'N/A'}</span> },
                            { key: "quantity", label: "Quantity", render: (q: number) => <span className="text-slate-400">{q || 0}</span> },
                            { key: "type", label: "Type", render: (t: string) => <span className="text-slate-400">{t || 'N/A'}</span> },
                            { key: "reference_id", label: "Refrence ID", render: (r: string) => <span className="text-slate-400">{r || 'N/A'}</span> },
                        ]}
                        data={stock_transactions}
                        onDelete={(r: StockTransaction) => handleDelete(r.id || '')}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={"Add Transaction"}>
                    <StockTransactionForm setModal={setModal}
                        defaultValues={transactionDefaults} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default StockTransactionPage
