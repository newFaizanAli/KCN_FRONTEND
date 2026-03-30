import { useEffect } from 'react';
import { Calendar, CreditCard, DollarSign, FileText, User2Icon, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { SupplierPayment } from '../../types/supplier';
import { useSupplierPaymentStore, useSupplierStore } from '../../store';
import { PAYMENT_METHODS } from '../../constants';
import { Button } from '../../components/ui';
import { FormInput, FormSelect, FormSearchSelect } from '../../components/form';


interface SupplierFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: SupplierPayment;
    handleClose: () => void
}
const SupplierPaymentForm = ({ setModal, isEdit, defaultValues, handleClose }: SupplierFormProps) => {

    const { addSupplierPayment, editSupplierPayment } = useSupplierPaymentStore()
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

    const onSubmit = (data: SupplierPayment) => {
        if (isEdit) {
            editSupplierPayment(defaultValues.id as string, data)
            handleClose()
        } else {
            addSupplierPayment(data);
            reset();
            setModal(false);
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">




            <FormSearchSelect<SupplierPayment>
                label="Supplier"
                placeholder="Search supplier..."
                icon={UserCheck}
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

            <FormSelect
                label="Payment Method"
                name="payment_method"
                icon={CreditCard}
                register={register}
                options={[{ value: null, label: "Select Payment Method" }, ...PAYMENT_METHODS]}
                rules={{ required: "Payment Method required" }}
                error={errors.payment_method?.message}
            />

            <FormInput
                type="number"
                label="Enter Amount"
                placeholder="Enter Amount"
                icon={DollarSign}
                name="amount"
                min={1}
                register={register}
                rules={{ required: "Amount required" }}
                error={errors.amount?.message}
            />

            <FormInput
                label="Enter Reference"
                placeholder="Enter refrence"
                icon={FileText}
                name="reference"
                register={register}
            />

            <FormInput
                type="date"
                label="Enter Date"
                placeholder="Enter Date"
                icon={Calendar}
                name="createdAt"
                register={register}
            />

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={User2Icon}>{isEdit ? "Update Payment" : "Create Payment"}</Button>
            </div>
        </form>

    )
}

export default SupplierPaymentForm
