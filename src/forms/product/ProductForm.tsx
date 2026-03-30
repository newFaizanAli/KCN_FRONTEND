import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Product } from "../../types";
import {
    BadgeDollarSign, Barcode, Boxes, DollarSign, FileCheck2,
    FileText, Layers, Package, Tag
} from 'lucide-react';
import { useCategoryStore, useProductStore } from '../../store';
import { FormInput, FormSelect, FormTextarea, FormSearchSelect } from '../../components/form';
import { Button } from '../../components/ui';

interface ProductProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: Product
    handleClose: () => void
}

const ProductForm = ({ setModal, isEdit, defaultValues, handleClose }: ProductProps) => {


    const { addProduct, editProduct } = useProductStore()
    const { searchCategoryByName } = useCategoryStore()

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


    const onSubmit = (data: Product) => {
        if (isEdit) {
            editProduct(defaultValues?.id as string, data)
            handleClose()
        } else {
            addProduct(data);
            reset();
            setModal(false);
        }
    };


    const productType = [
        { value: null, label: "Select Product Type" },
        { value: "product", label: "Product" },
        { value: "service", label: "Service" },
        { value: "both", label: "Both" }
    ]



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormInput
                label="Product Name"
                placeholder="Enter product name"
                icon={Package}
                name="name"
                register={register}
                rules={{ required: "Name required" }}
                error={errors.name?.message}
            />


            <FormSearchSelect<Product>
                label="Category"
                placeholder="Search category..."
                icon={Layers}
                name="categoryId"
                register={register}
                rules={{ required: "Category required" }}
                value={
                    defaultValues?.categoryId
                        ? {
                            value: defaultValues.categoryId,
                            label: defaultValues.categoryName || "",
                        }
                        : null
                }
                onSearch={searchCategoryByName}
                onChange={(opt) => {
                    setValue("categoryId", opt.value);
                }}
                error={errors.categoryId?.message}
            />

            <FormInput
                label="Product Brand"
                placeholder="Enter product brand"
                icon={Tag}
                name="brand"
                register={register}
            />

            <FormInput
                label="Product SKU"
                placeholder="Enter product SKU"
                icon={Barcode}
                name="sku"
                register={register}
            />

            <FormSelect
                label="Type"
                name="type"
                icon={Boxes}
                register={register}
                options={productType}
            />

            <FormInput
                type='number'
                label="Product Price"
                placeholder="Enter product price"
                icon={DollarSign}
                name="price"
                register={register}
                min={0}
                rules={{ required: "Price required" }}
                error={errors.price?.message}
            />

            <FormInput
                type='number'
                label="Cost Price"
                placeholder="Enter cost price"
                icon={BadgeDollarSign}
                name="cost_price"
                register={register}
                min={0}
                rules={{ required: "Cost price required" }}
                error={errors.cost_price?.message}
            />

            <FormTextarea
                label="Product Description"
                placeholder="Enter product description"
                icon={FileText}
                name="description"
                register={register}
            />

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Product" : "Create Product"}</Button>
            </div>

        </form>
    )
}

export default ProductForm
