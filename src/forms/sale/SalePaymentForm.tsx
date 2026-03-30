import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    ArrowLeftRight,
    Calendar, FileCheck2, FileDigit, FileText, Hash, Package2,
    ShoppingCart,
    Wallet,
} from 'lucide-react';
import { SalePayment } from "../../types";
import { useSalePaymentStore, useSaleOrderStore } from '../../store';
import { FormInput, FormSearchSelect, FormSelect, FormTextarea } from '../../components/form';
import { Button } from '../../components/ui';
import { PAYMENT_METHODS, SALE_TYPE } from '../../constants';

interface SaleProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: SalePayment
    handleClose: () => void
}

const SalePaymentForm = ({ setModal, isEdit, defaultValues, handleClose }: SaleProps) => {

    const { addSalePayment, editSalePayment } = useSalePaymentStore()
    const { searchSaleOrderByID, } = useSaleOrderStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
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


    const onSubmit = (data: SalePayment) => {
        if (isEdit) {
            editSalePayment(defaultValues?.id as string, { ...data })
            handleClose()
        } else {
            addSalePayment({ ...data });
            reset();
            setModal(false);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormSearchSelect
                name='saleId'
                label="Sale Order"
                placeholder="Search order..."
                icon={ShoppingCart}
                value={
                    defaultValues?.saleId
                        ? {
                            value: defaultValues.saleId as string,
                            label: defaultValues.saleId || "",
                        }
                        : null
                }
                onSearch={searchSaleOrderByID}
                onChange={(opt) => {
                    setValue("saleId", opt.value);
                }}
                rules={{ required: "Sale Id required" }}
                error={errors.saleId?.message}
            />

            <FormSelect
                label="Payment Method"
                name="method"
                icon={Wallet}
                register={register}
                options={[{ value: null, label: "Select Payment Method" }, ...PAYMENT_METHODS]}
                rules={{ required: "Payment Method required" }}
                error={errors.method?.message}
            />

            <FormSelect
                label="Payment Type"
                name="type"
                icon={ArrowLeftRight}
                register={register}
                options={[{ value: null, label: "Select Payment Type" }, ...SALE_TYPE]}
                rules={{ required: "Payment Type required" }}
                error={errors.method?.message}
            />

            <FormInput
                type='text'
                label="Transaction Reference"
                placeholder="Enter Transaction Reference"
                icon={FileDigit}
                min={1}
                name="reference_id"
                register={register}
                rules={{ required: "Transaction Reference required" }}
                error={errors.reference_id?.message}
            />


            <FormTextarea
                label="Note"
                placeholder="Enter Note"
                icon={FileText}
                name="note"
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

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{isEdit ? "Update Sale Payment" : "Create Sale Payment"}</Button>
            </div>

        </form>
    )
}

export default SalePaymentForm
