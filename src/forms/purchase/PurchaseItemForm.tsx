import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DollarSign, FileCheck2, Hash, Package2 } from 'lucide-react'
import { PurchaseOrderItem } from '../../types'
import { usePurchaseItemStore, useProductStore } from '../../store'
import { FormInput, FormSearchSelect } from '../../components/form'
import { Alert, Button } from '../../components/ui'

interface PurchaseProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    isEdit: boolean
    defaultValues: PurchaseOrderItem
    handleClose: () => void
}

const PurchaseItemForm = ({ setModal, isEdit, defaultValues, handleClose }: PurchaseProps) => {
    const { addPurchaseItem, editPurchaseItem } = usePurchaseItemStore()
    const { searchProductByName, fetchProductById } = useProductStore()
    const [productChanged, setProductChanged] = useState(false)


    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<PurchaseOrderItem>({
        defaultValues
    })

    const productId = watch('productId')
    const quantity = watch('quantity')
    const unit_cost = watch('unit_cost')

    // Reset form on edit mode
    useEffect(() => {
        reset(defaultValues)
        setProductChanged(false)
    }, [defaultValues, reset])

    // Auto fetch cost price only if product changed or creating new
    useEffect(() => {
        if (!productId || (isEdit && !productChanged)) return
        fetchProductById(productId as string)
            .then(prod => {
                if (prod) setValue('unit_cost', prod.cost_price, { shouldDirty: true, shouldValidate: true })
            })
            .catch(err => console.error('Failed to fetch product cost:', err))
    }, [productId, fetchProductById, setValue, isEdit, productChanged])

    const onSubmit = (data: PurchaseOrderItem) => {
        const total = data.unit_cost * data.quantity
        if (isEdit) editPurchaseItem(defaultValues.id!, { ...data, total })
        else addPurchaseItem({ ...data, total })

        setModal(false)
        reset()
        handleClose()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormSearchSelect<PurchaseOrderItem>
                label="Product"
                placeholder="Search product..."
                icon={Package2}
                name="productId"
                register={register}
                rules={{ required: "Product required" }}
                value={
                    productId
                        ? {
                            value: productId as string,
                            label: watch('productName') || defaultValues.productName || ''
                        } : null
                }
                onSearch={searchProductByName}
                onChange={async (opt) => {
                    const prevId = productId
                    setValue('productId', opt.value, { shouldValidate: true })
                    setValue('productName', opt.label)

                    if (!isEdit || prevId !== opt.value) {
                        setProductChanged(true)
                        const prod = await fetchProductById(opt.value)
                        if (prod) setValue('unit_cost', prod.cost_price, { shouldDirty: true, shouldValidate: true })
                    }
                }}
                error={errors.productId?.message}
            />

            <FormInput type='number' label="Quantity" placeholder="Enter quantity" icon={Hash} min={1} name="quantity" register={register} error={errors.quantity?.message} />
            <FormInput type='number' label="Unit Cost" placeholder="Enter Unit Cost" icon={DollarSign} min={1} name="unit_cost" register={register} error={errors.unit_cost?.message} />

            {(quantity > 0 && unit_cost > 0) && <Alert variant="info">Total Amount is ₨ {quantity * unit_cost}</Alert>}

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Purchase Item" : "Create Purchase Item"}</Button>
            </div>
        </form>
    )
}

export default PurchaseItemForm