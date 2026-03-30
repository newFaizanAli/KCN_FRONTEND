import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategoryStore } from '../../../store'
import { CategoryForm } from '../../../forms'
import { Modal, SuspenseWrap, DataTable } from '../../../components/shared'
import { Button, Card } from '../../../components/ui'
import { PageHeader } from '../../../components/page'
import { Category } from '../../../types'


const CategoryPage = () => {
    const [modal, setModal] = useState(false);
    const { fetchCategories, deleteCategory, isFetched, categories } = useCategoryStore()

    const defualtValues = {
        name: "",
        parent_id: {
            id: '',
            name: '',
        }
    }

    const [categoryDefaults, setCategoryDefaults] = useState<Category>(defualtValues as Category)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setCategoryDefaults(defualtValues as Category)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (categ: Category) => {
        setCategoryDefaults(categ)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this category?")
        if (confirm) {
            deleteCategory(id)
        }
    }


    useEffect(() => {
        if (!isFetched) {
            fetchCategories()
        }
    }, [fetchCategories, isFetched])



    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Categories" subtitle="List of all categories"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Category</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "name", label: "Name", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        ]}
                        data={categories}
                        onEdit={(r: Category) => handleEdit(r)}
                        onDelete={(r: Category) => handleDelete(r?.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Category" : "Add Category"}>
                    <CategoryForm setModal={setModal} isEdit={isEdit} defaultValues={categoryDefaults as Category} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default CategoryPage
