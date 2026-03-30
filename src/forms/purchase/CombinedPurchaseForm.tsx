import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
    AlertTriangle, Calendar, CreditCard, DollarSign,
    FileCheck2, Hash, Package2, Plus, Trash2, Truck, ShoppingCart
} from 'lucide-react'
import { PurchaseOrder, PurchaseOrderItem } from '../../types'
import { usePurchaseOrderStore, useSupplierStore, useProductStore } from '../../store'
import { FormInput, FormSelect, FormSearchSelect } from '../../components/form'
import { Alert, Button } from '../../components/ui'
import { SuspenseWrap } from '../../components/shared'

// Combined type for the unified form
interface CombinedPurchaseFormValues {
    // Order fields
    supplierId: string | null
    supplierName?: string
    status: "pending" | "approved" | "rejected"
    createdAt: string
    tax: number
    // Items fields
    items: Array<{
        productId: string | null
        productName?: string
        quantity: number
        unit_cost: number
        total: number
    }>
}

const defaultItem = {
    productId: null,
    productName: '',
    quantity: 1,
    unit_cost: 0,
    total: 0,
}

const CombinedPurchaseForm = () => {
    const { addCombinedPurchaseOrder } = usePurchaseOrderStore()
    const { searchSupplierByName } = useSupplierStore()
    const { searchProductByName, fetchProductById } = useProductStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CombinedPurchaseFormValues>({
        defaultValues: {
            supplierId: null,
            supplierName: '',
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0],
            tax: 0,
            items: [{ ...defaultItem }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    })

    const watchedItems = watch('items')
    const tax = watch('tax')

    const subtotal = watchedItems.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0
        const cost = Number(item.unit_cost) || 0
        return sum + qty * cost
    }, 0)

    const taxAmount = (subtotal * (Number(tax) || 0)) / 100
    const grandTotal = subtotal + taxAmount

    // Auto-fill unit_cost when product changes
    const handleProductChange = async (index: number, opt: { value: string; label: string }) => {
        setValue(`items.${index}.productId`, opt.value, { shouldValidate: true })
        setValue(`items.${index}.productName`, opt.label)
        try {
            const prod = await fetchProductById(opt.value)
            if (prod) {
                setValue(`items.${index}.unit_cost`, prod.cost_price, { shouldDirty: true })
                const qty = Number(watchedItems[index]?.quantity) || 1
                setValue(`items.${index}.total`, prod.cost_price * qty)
            }
        } catch (err) {
            console.error('Failed to fetch product cost:', err)
        }
    }

    const onSubmit = async (data: CombinedPurchaseFormValues) => {
        setIsSubmitting(true)
        try {
            const payload = {
                supplierId: data.supplierId,
                status: data.status,
                createdAt: data.createdAt,
                tax: data.tax,
                items: data.items.map(item => ({
                    productId: item.productId,
                    quantity: Number(item.quantity),
                    unit_cost: Number(item.unit_cost),
                    total: Number(item.quantity) * Number(item.unit_cost),
                })),
            }
            await addCombinedPurchaseOrder(payload)
            reset()
        } catch (err) {
            console.error('Failed to create purchase order:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const orderStatusOptions = [
        { value: null, label: 'Select Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
    ]

    return (
        <SuspenseWrap>
            <div className="p-6 fade-in">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* ── Order Details Section ── */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <ShoppingCart size={15} />
                            Order Details
                        </h3>

                        <FormSearchSelect<CombinedPurchaseFormValues>
                            label="Supplier"
                            placeholder="Search supplier..."
                            icon={Truck}
                            name="supplierId"
                            register={register}
                            rules={{ required: 'Supplier required' }}
                            value={
                                watch('supplierId')
                                    ? { value: watch('supplierId') as string, label: watch('supplierName') || '' }
                                    : null
                            }
                            onSearch={searchSupplierByName}
                            onChange={(opt) => {
                                setValue('supplierId', opt.value)
                                setValue('supplierName', opt.label)
                            }}
                            error={errors.supplierId?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                type="number"
                                label="Tax (%)"
                                placeholder="e.g. 10"
                                icon={CreditCard}
                                name="tax"
                                min={0}
                                max={100}
                                register={register}
                            />
                            <FormInput
                                type="date"
                                label="Date"
                                placeholder="Enter date"
                                icon={Calendar}
                                name="createdAt"
                                register={register}
                                rules={{ required: 'Date required' }}
                                error={errors.createdAt?.message}
                            />
                        </div>

                        <FormSelect
                            label="Order Status"
                            name="status"
                            icon={AlertTriangle}
                            register={register}
                            options={orderStatusOptions}
                            rules={{ required: 'Status required' }}
                            error={errors.status?.message}
                        />
                    </div>

                    {/* ── Divider ── */}
                    <div className="border-t border-dashed border-gray-800" />

                    {/* ── Items Section ── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Package2 size={15} />
                                Purchase Items
                            </h3>
                            <Button
                                type="button"
                                variant="secondary"
                                icon={Plus}
                                onClick={() => append({ ...defaultItem })}
                            >
                                Add Item
                            </Button>
                        </div>

                        {fields.length === 0 && (
                            <Alert variant="info">No items added yet. Click "Add Item" to begin.</Alert>
                        )}

                        <div className="space-y-3">
                            {fields.map((field, index) => {
                                const qty = Number(watchedItems[index]?.quantity) || 0
                                const cost = Number(watchedItems[index]?.unit_cost) || 0
                                const rowTotal = qty * cost

                                return (
                                    <div
                                        key={field.id}
                                        className="border border-gray-800 rounded-lg p-4 space-y-3"
                                    >
                                        {/* Item header */}
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-400">Item #{index + 1}</span>
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>

                                        <FormSearchSelect<CombinedPurchaseFormValues>
                                            label="Product"
                                            placeholder="Search product..."
                                            icon={Package2}
                                            name={`items.${index}.productId`}
                                            register={register}
                                            rules={{ required: 'Product required' }}
                                            value={
                                                watchedItems[index]?.productId
                                                    ? {
                                                        value: watchedItems[index].productId as string,
                                                        label: watchedItems[index].productName || '',
                                                    }
                                                    : null
                                            }
                                            onSearch={searchProductByName}
                                            onChange={(opt) => handleProductChange(index, opt)}
                                            error={(errors.items?.[index] as any)?.productId?.message}
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <FormInput
                                                type="number"
                                                label="Quantity"
                                                placeholder="Qty"
                                                icon={Hash}
                                                min={1}
                                                name={`items.${index}.quantity`}
                                                register={register}
                                                rules={{ required: true, min: 1 }}
                                                error={(errors.items?.[index] as any)?.quantity?.message}
                                            />

                                            <FormInput
                                                type="number"
                                                label="Unit Cost"
                                                placeholder="Cost"
                                                icon={DollarSign}
                                                min={0}
                                                name={`items.${index}.unit_cost`}
                                                register={register}
                                                rules={{ required: true, min: 0 }}
                                                error={(errors.items?.[index] as any)?.unit_cost?.message}
                                            />
                                        </div>

                                        {rowTotal > 0 && (
                                            <p className="text-xs text-right text-gray-500 font-medium">
                                                Row Total: <span className="text-gray-800">₨ {rowTotal.toLocaleString()}</span>
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Order Summary ── */}
                    {subtotal > 0 && (
                        <div className="rounded-xl border border-gray-800 p-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>₨ {subtotal.toLocaleString()}</span>
                            </div>
                            {Number(tax) > 0 && (
                                <div className="flex justify-between text-gray-500">
                                    <span>Tax ({tax}%)</span>
                                    <span>₨ {taxAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold text-gray-300 border-t pt-2">
                                <span>Grand Total</span>
                                <span>₨ {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-2 pt-1">

                        <Button type="submit" icon={FileCheck2} disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </SuspenseWrap>
    )
}

export default CombinedPurchaseForm