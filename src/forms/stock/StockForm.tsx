import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { Barcode, Boxes, FileCheck2, Layers2, } from 'lucide-react';
import { useStockStore, useProductStore } from '../../store';
import { FormInput, FormSelect, FormSearchSelect } from '../../components/form';
import { Button } from '../../components/ui';
import { Stock } from '../../types';

interface StockProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>
    isEdit: boolean
    defaultValues: any
    handleClose: () => void
}

const StockForm = ({ setModal, isEdit, defaultValues, handleClose }: StockProps) => {

    const { addStock, editStock } = useStockStore()
    const {
        searchProductByName
    } = useProductStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (isEdit) {
            reset(defaultValues)
        }
    }, [defaultValues, reset, isEdit])


    const onSubmit = (data: Stock) => {
        if (isEdit) {
            editStock(defaultValues.id, data)
            handleClose()
        } else {
            addStock(data);
            reset();
            setModal(false);
        }
    };



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormSearchSelect<Stock>
                label="Product"
                placeholder="Search product..."
                icon={Boxes}
                name="productId"
                register={register}
                rules={{ required: "Product required" }}
                value={
                    defaultValues?.productId
                        ? {
                            value: defaultValues.productId,
                            label: defaultValues.productName || "",
                        }
                        : null
                }
                onSearch={searchProductByName}
                onChange={(opt) => {
                    setValue("productId", opt.value);
                }}
                error={errors.productId?.message as string}
            />

            <FormInput
                type="number"
                label="Stock Quantity"
                placeholder="Enter product quantity"
                icon={Layers2}
                name="quantity"
                register={register}
                min={0}
                rules={{ required: "Quantity required" }}
                error={errors.quantity?.message as string}
            />

            <FormInput
                label="Serial Number"
                placeholder="Enter serial number"
                icon={Barcode}
                name="serial_number"
                register={register}
            />


            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Product" : "Create Product"}</Button>
            </div>

        </form>
    )
}

export default StockForm
