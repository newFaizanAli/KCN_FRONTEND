import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useDeliveryNoteStore } from '../../../store'
import { DeliveryNote } from '../../../types'
import { DeliveryNoteForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'


const DeliveryNotePage = () => {
    const [modal, setModal] = useState(false);

    const { isFetched, fetchDeliveryNotes, deleteDeliveryNote, deliveryNotes } = useDeliveryNoteStore()

    const defualtValues = {
        saleId: null,
        createdAt: new Date().toISOString().split("T")[0],
    }

    const [noteDefaults, setNoteDefaults] = useState<DeliveryNote>(defualtValues as DeliveryNote)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setNoteDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this goods delivery note?")
        if (confirm) {
            deleteDeliveryNote(id)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!isFetched) {
                await fetchDeliveryNotes()
            }
        }

        fetchData()
    }, [isFetched])


    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title={`Delivery Notes`} subtitle="List of all delivery notes"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Delivery Note</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "id", label: "ID", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: 'saleId', label: 'Sale ID', render: (p: string) => <span className="text-slate-400">{p}</span> },
                            { key: 'customerName', label: 'Customer Name', render: (p: string) => <span className="text-slate-400">{p || "N/A"}</span> },
                            { key: 'createdAt', label: 'Date', render: (v: Date) => <span className="text-slate-400">{new Date(v).toDateString()}</span> },

                        ]}
                        data={deliveryNotes}
                        onDelete={(r: DeliveryNote) => handleDelete(r?.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Delivery Note" : "Add Delivery Note"}>
                    <DeliveryNoteForm setModal={setModal} isEdit={isEdit} defaultValues={noteDefaults as DeliveryNote} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default DeliveryNotePage
