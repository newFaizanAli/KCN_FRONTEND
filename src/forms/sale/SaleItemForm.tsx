import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    DollarSign, FileCheck2, Hash, Package2,
} from 'lucide-react';
import { SaleOrderItem } from "../../types";
import { useSaleItemStore, useProductStore } from '../../store';
import { FormInput, FormSearchSelect } from '../../components/form';
import { Alert, Button } from '../../components/ui';

interface SaleProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: SaleOrderItem
    handleClose: () => void
}

const SaleItemForm = ({ setModal, isEdit, defaultValues, handleClose }: SaleProps) => {

    const { addSaleItem, editSaleItem } = useSaleItemStore()
    const { searchProductByName, fetchProductById } = useProductStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (isEdit) {
            reset(defaultValues)
        }
    }, [defaultValues, reset, isEdit])



    const onSubmit = (data: SaleOrderItem) => {
        const total = data.price * data.quantity

        if (isEdit) {
            editSaleItem(defaultValues?.id as string, { ...data, total })
            handleClose()
        } else {
            addSaleItem({ ...data, total });
            reset();
            setModal(false);
        }
    };


    const productId = watch('productId');


    useEffect(() => {
        const fetchUnitCost = async () => {
            if (!productId) return;

            try {
                const selectedProd = await fetchProductById(productId as string);

                if (selectedProd) {
                    setValue("price", selectedProd.price, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
            }
        };

        fetchUnitCost();
    }, [productId, fetchProductById, setValue]);


    const quantity = watch('quantity')
    const price = watch('price')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


            <FormSearchSelect
                name='productId'
                label="Product"
                placeholder="Search product..."
                icon={Package2}
                value={
                    defaultValues?.productId
                        ? {
                            value: defaultValues.productId as string,
                            label: defaultValues.productName || "",
                        }
                        : null
                }
                onSearch={searchProductByName}
                onChange={(opt) => {
                    setValue("productId", opt.value);
                }}
                rules={{ required: "Product required" }}
                error={errors.productId?.message}
            />

            <FormInput
                type='number'
                label="Quantity"
                placeholder="Enter quantity"
                icon={Hash}
                min={1}
                name="quantity"
                register={register}
                rules={{ required: "Quantity required" }}
                error={errors.quantity?.message}
            />


            <FormInput
                type='number'
                label="Price"
                placeholder="Enter Price"
                icon={DollarSign}
                min={1}
                name="price"
                register={register}
                rules={{ required: "Price required" }}
                error={errors.price?.message}
            />

            {quantity > 0 && <Alert variant="info" className="mb-5">Total Amount is ₨ {quantity * price}</Alert>}


            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Sale Item" : "Create Sale Item"}</Button>
            </div>

        </form>
    )
}

export default SaleItemForm
