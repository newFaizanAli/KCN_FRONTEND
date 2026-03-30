import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    AlertTriangle, Calendar, CreditCard, FileCheck2, Truck
} from 'lucide-react';
import { PurchaseOrder } from "../../types";
import { usePurchaseOrderStore, useSupplierStore } from '../../store';
import { FormInput, FormSelect, FormSearchSelect } from '../../components/form';
import { Button } from '../../components/ui';


interface PurchaseProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: PurchaseOrder
    handleClose: () => void
}

const PurchaseOrderForm = ({ setModal, isEdit, defaultValues, handleClose }: PurchaseProps) => {

    const { addPurchaeOrder, editPurchaeOrder } = usePurchaseOrderStore()
    const { searchSupplierByName } = useSupplierStore()


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
        if (defaultValues) {
            const formattedValues = {
                ...defaultValues,
                createdAt: defaultValues.createdAt
                    ? defaultValues.createdAt.split("T")[0]
                    : ""
            }
            reset(formattedValues);
        }
    }, [defaultValues, reset]);



    const onSubmit = async (data: PurchaseOrder) => {
        if (isEdit) {
            await editPurchaeOrder(defaultValues?.id as string, data)
            handleClose()
        } else {
            await addPurchaeOrder(data);
            reset();
            setModal(false);
        }
    };

    const orderStatus = [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
    ]


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormSearchSelect<PurchaseOrder>
                label="Supplier"
                placeholder="Search supplier..."
                icon={Truck}
                name="supplierId"
                register={register}
                rules={{ required: "Supplier required" }}
                value={
                    defaultValues?.supplierId
                        ? {
                            value: defaultValues.supplierId,
                            label: defaultValues.supplierName || "",
                        }
                        : null
                }
                onSearch={searchSupplierByName}
                onChange={(opt) => {
                    setValue("supplierId", opt.value);
                }}
                error={errors.supplierId?.message}
            />

            <FormInput
                type='number'
                label="Tax"
                placeholder="Enter tax"
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
                rules={{ required: "Date required" }}
                error={errors.createdAt?.message}
            />


            <FormSelect
                label="Order Status"
                name="status"
                icon={AlertTriangle}
                register={register}
                options={[{ value: null, label: "Select Status" }, ...orderStatus]}
                rules={{ required: "Status required" }}
                error={errors.status?.message}
            />

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Purchase" : "Create Purchase"}</Button>
            </div>

        </form>
    )
}

export default PurchaseOrderForm
