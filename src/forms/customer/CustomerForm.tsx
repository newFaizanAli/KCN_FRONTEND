import { useEffect } from 'react';
import { FileText, Mail, Phone, User2Icon, UserRound } from 'lucide-react';
import { Customer } from "../../types"
import { useForm } from 'react-hook-form';
import { useCustomerStore } from '../../store';
import { Button } from '../../components/ui';
import { FormInput, FormTextarea } from '../../components/form';


interface CustomerProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: Customer,
    handleClose: () => void
}

const CustomerForm = ({ setModal, isEdit, defaultValues, handleClose }: CustomerProps) => {

    const { addCustomer, editCustomer } = useCustomerStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: defaultValues
    });

    useEffect(() => {
        if (isEdit) {

            reset(defaultValues)
        }
    }, [defaultValues, reset, isEdit])

    const onSubmit = (data: Customer) => {
        if (isEdit) {
            editCustomer(defaultValues.id as string, data)
            handleClose()
        } else {
            addCustomer(data);
            reset();
            setModal(false);
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormInput label="Customer Name" placeholder="Enter customer name" icon={UserRound}
                name="name" register={register} rules={{ required: "Name required" }}
                error={errors.name?.message} />
            <FormInput label="Customer Email" placeholder="Enter customer email" icon={Mail}
                name="email" register={register} />
            <FormInput label="Customer Phone" placeholder="Enter customer phone" icon={Phone}
                name="phone" register={register} />
            <FormTextarea
                label="Address" placeholder="Enter address" icon={FileText} name="address"
                register={register}
            />

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={User2Icon}>{isEdit ? "Update Category" : "Create Category"}</Button>
            </div>
        </form>

    )
}

export default CustomerForm
