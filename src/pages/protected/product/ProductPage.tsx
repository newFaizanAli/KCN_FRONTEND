import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES_PATHS } from "../../../routes/routes_path";
import { Product } from "../../../types";
import { useProductStore } from "../../../store";
import { ProductForm } from "../../../forms";
import { PageHeader } from "../../../components/page";
import { Button, Card } from "../../../components/ui";
import { Modal, SuspenseWrap, DataTable } from "../../../components/shared";


const ProductPage = () => {
    const navigate = useNavigate()
    const [modal, setModal] = useState(false);
    const { fetchProducts, deleteProduct, isFetched, products } = useProductStore()

    const defualtValues = {
        name: "",
        categoryId: null,
        brand: null,
        sku: null,
        type: "product",
        price: 0,
        cost_price: 0,
        description: null
    }

    const [productDefaults, setProductDefaults] = useState<Product>(defualtValues as Product)
    const [isEdit, setIsEdit] = useState(false)

    const handleClose = () => {
        setProductDefaults(defualtValues as Product)
        setIsEdit(false)
        setModal(false)
    }

    const handleEdit = (product: Product) => {
        setProductDefaults(product)
        setIsEdit(true)
        setModal(true)
    }

    const handleDelete = (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this product?")
        if (confirm) {
            deleteProduct(id)
        }
    }

    const handleAttributeClick = (id: string) => {

        const selectedProd = products.find(p => p.id === id)
        navigate(ROUTES_PATHS.DASHBOARD.PRODUCT.ATTRIBUTES, {
            state: {
                prodId: selectedProd?.id,
                prodName: selectedProd?.name
            }
        })
    }

    useEffect(() => {
        if (!isFetched) {
            fetchProducts()
        }
    }, [fetchProducts, isFetched])

    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <PageHeader title="Products" subtitle="List of all products"
                    actions={
                        <Button icon={Plus} onClick={() => setModal(true)}>Add Product</Button>
                    }
                />
                <Card>
                    <DataTable
                        columns={[
                            { key: "name", label: "Name", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            { key: "sku", label: "SKU", render: (v: string) => <span className="text-slate-400">{v || "N/A"}</span> },
                            { key: "categoryName", label: "Category", render: (v: string) => <span className="text-slate-400">{v}</span> },
                            {
                                key: "id",
                                label: "Attributes",
                                render: (v: string) => (
                                    <Button type="button" variant="secondary" onClick={() => handleAttributeClick(v)}>
                                        View Attributes
                                    </Button>
                                )
                            },
                            { key: "price", label: "Price", render: (p: number) => <span className="text-slate-400">₨ {p || 0}</span> },
                        ]}

                        data={products}
                        onEdit={(r: Product) => handleEdit(r)}
                        onDelete={(r: Product) => handleDelete(r.id || "")}
                    />
                </Card>
                <Modal open={modal} onClose={() => handleClose()} title={isEdit ? "Edit Product" : "Add Product"}>
                    <ProductForm setModal={setModal} isEdit={isEdit}
                        defaultValues={productDefaults} handleClose={handleClose} />
                </Modal>
            </div>

        </SuspenseWrap>
    )
}

export default ProductPage
