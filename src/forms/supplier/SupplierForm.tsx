import { useEffect } from 'react';
import { FileText, FolderCheck, Mail, Phone, User2Icon, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Supplier } from '../../types/supplier';
import { useSupplierStore } from '../../store';
import { Button } from '../../components/ui';
import { FormInput, FormTextarea } from '../../components/form';


interface SupplierFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: Supplier;
    handleClose: () => void
}
const SupplierForm = ({ setModal, isEdit, defaultValues, handleClose }: SupplierFormProps) => {

    const { addSupplier, editSupplier } = useSupplierStore()

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

    const onSubmit = (data: Supplier) => {
        if (isEdit) {
            editSupplier(defaultValues.id as string, data)
            handleClose()
        } else {
            addSupplier(data);
            reset();
            setModal(false);
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormInput label="Supplier Name" placeholder="Enter Supplier name" icon={UserRound}
                name="name" register={register} rules={{ required: "Name required" }}
                error={errors.name?.message} />
            <FormInput label="Supplier Email" placeholder="Enter supplier email" icon={Mail}
                name="email" register={register} />
            <FormInput label="Supplier Phone" placeholder="Enter supplier phone" icon={Phone}
                name="phone" register={register} />
            <FormTextarea
                label="Address" placeholder="Enter address" icon={FileText} name="address"
                register={register}
            />

            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={User2Icon}>{isEdit ? "Update Supplier" : "Create Supplier"}</Button>
            </div>
        </form>

    )
}

export default SupplierForm
