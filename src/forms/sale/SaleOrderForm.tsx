import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    AlertTriangle, Calendar, CreditCard, FileCheck2, Truck
} from 'lucide-react';
import { SalesOrder } from "../../types";
import { calculateGrandTotal } from '../../utilities/functions';
import { useSaleOrderStore, useCustomerStore } from '../../store';
import { FormInput, FormSelect, FormSearchSelect } from '../../components/form';
import { Alert, Button } from '../../components/ui';


interface SaleProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: SalesOrder
    handleClose: () => void
}

const SaleOrderForm = ({ setModal, isEdit, defaultValues, handleClose }: SaleProps) => {

    const { addSaleOrder, editSaleOrder } = useSaleOrderStore()
    const { searchCustomerByName } = useCustomerStore()


    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
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


    const onSubmit = async (data: SalesOrder) => {
        if (isEdit) {
            await editSaleOrder(defaultValues?.id as string, data)

            handleClose()
        } else {
            const resp = await addSaleOrder(data);
            reset();
            setModal(false);
        }
    };



    const tax = watch('tax')
    const discount = watch('discount')

    const orderStatus = [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
    ]

    const paymentStatus = [
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
    ]


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormSearchSelect<SalesOrder>
                label="Customer"
                placeholder="Search customer..."
                icon={Truck}
                name="customerId"
                register={register}
                value={
                    defaultValues?.customerId
                        ? {
                            value: defaultValues.customerId,
                            label: defaultValues.customerName || "",
                        }
                        : null
                }
                onSearch={searchCustomerByName}
                onChange={(opt) => {
                    setValue("customerId", opt.value);
                }}
                error={errors.customerId?.message}
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
                type='number'
                label="Discount"
                placeholder="Enter discount"
                icon={CreditCard}
                name="discount"
                min={0}
                max={100}
                register={register}
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

            <FormSelect
                label="Payment Status"
                name="payment_status"
                icon={AlertTriangle}
                register={register}
                options={[{ value: null, label: "Select payment Status" }, ...paymentStatus]}
                rules={{ required: "Payment Status required" }}
                error={errors.status?.message}
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

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Order" : "Create Order"}</Button>
            </div>

        </form>
    )
}

export default SaleOrderForm
