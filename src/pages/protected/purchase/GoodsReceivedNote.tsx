import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useGoodsReceivedNoteStore } from '../../../store'
import { GoodsReceivedNote } from '../../../types'
import { GRNForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'


const GoodsReceivedNotePage = () => {
    const [modal, setModal] = useState(false);

    const { isFetched, fetchGoodsReceivedNotes, deleteGoodsReceivedNote, goodsReceivedNotes } = useGoodsReceivedNoteStore()

    const defualtValues = {
        purchaseId: null,
        createdAt: new Date().toISOString().split("T")[0],
    }

    const [noteDefaults, setNoteDefaults] = useState<GoodsReceivedNote>(defualtValues as GoodsReceivedNote)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setNoteDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }



    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this goods received note?")
        if (confirm) {
            deleteGoodsReceivedNote(id)
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            if (!isFetched) {
                await fetchGoodsReceivedNotes()
            }
        }

        fetchData()
    }, [isFetched])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title={`Goods Received Notes`} subtitle="List of all grn notes"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add GRN</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'purchaseId', label: 'Purchase ID', render: (p: string) => <span className="text-slate-400">{p}</span> },
                            { key: 'supplierName', label: 'Supplier Name', render: (p: string) => <span className="text-slate-400">{p || "N/A"}</span> },
                            { key: 'createdAt', label: 'Created At', render: (p: string) => <span className="text-slate-400">{new Date(p).toDateString()}</span> },
                        ]}
                        data={goodsReceivedNotes}
                        onDelete={(r: GoodsReceivedNote) => handleDelete(r?.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit GRN" : "Add GRN"}>
                    <GRNForm setModal={setModal} isEdit={isEdit} defaultValues={noteDefaults as GoodsReceivedNote} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default GoodsReceivedNotePage
