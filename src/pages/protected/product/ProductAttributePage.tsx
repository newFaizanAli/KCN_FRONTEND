import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"
import { ROUTES_PATHS } from "../../../routes/routes_path";
import { ProductAttribute } from "../../../types";
import { useProdAttributesStore } from "../../../store";
import { ProdAttributeForm } from "../../../forms";
import { Modal, SuspenseWrap, DataTable } from "../../../components/shared";
import { Button, Card } from "../../../components/ui";
import { PageHeader } from "../../../components/page";


const ProductAttributePage = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const { prodId, prodName } = location.state || {}
    const { fetchAttributeByProductId, deleteAttribute, attributes } = useProdAttributesStore()
    const [modal, setModal] = useState(false);
    const [attributesData, setAttributesData] = useState<ProductAttribute[]>([])


    const defualtValues = {
        productId: prodId,
        value: "",
        key: "",
    }

    const [attributeDefaults, setAttributeDefaults] = useState(defualtValues)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setAttributeDefaults(defualtValues)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (attribute: ProductAttribute) => {
        setAttributeDefaults(attribute)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this attribute?")
        if (confirm) {
            deleteAttribute(id)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchAttributeByProductId(prodId)
            setAttributesData(resp || [])
        }

        if (prodId) {
            fetchData()
        } else {
            navigate(ROUTES_PATHS.DASHBOARD.PRODUCT.ROOT)
        }
    }, [fetchAttributeByProductId, prodId, navigate, attributes])

    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title={`Product Attributes: ${prodName}`} subtitle="List of all product attributes"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Attribute</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "key", label: "Key", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "value", label: "Value", render: (v: string) => <span className="text-slate-400">{v}</span> },
                        ]}
                        data={attributesData}
                        onEdit={(r: ProductAttribute) => handleEdit(r)}
                        onDelete={(r: ProductAttribute) => handleDelete(r.id as string)}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Attribute" : "Add Attribute"}>
                    <ProdAttributeForm setModal={setModal} isEdit={isEdit}
                        defaultValues={attributeDefaults} handleClose={handleClose} />
                </Modal>
            </div>
        </SuspenseWrap>
    )
}

export default ProductAttributePage
