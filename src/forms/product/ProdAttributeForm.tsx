import { useEffect } from 'react';
import { Database, GitBranch, Tags } from 'lucide-react';
import { ProductAttribute } from '../../types';
import { useForm } from 'react-hook-form';
import { useProdAttributesStore } from '../../store'
import { Button } from '../../components/ui';
import { FormInput, FormSelect } from '../../components/form';


interface ProductAttributeFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: ProductAttribute;
    handleClose: () => void;
}

const ProductAttributeForm = ({ setModal, isEdit, defaultValues, handleClose }: ProductAttributeFormProps) => {

    const { addAttribute, editAttribute } = useProdAttributesStore()

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

    const onSubmit = (data: ProductAttribute) => {
        if (isEdit) {
            editAttribute(defaultValues?.id as string, data)
            handleClose()
        } else {
            addAttribute(data);
            reset();
            setModal(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="attribute Key" placeholder="Enter attribute key"
                icon={Tags} name="key" register={register} rules={{ required: "Key required" }}
                error={errors.key?.message} />
            <FormInput label="attribute Value" placeholder="Enter attribute value"
                icon={Database} name="value" register={register} rules={{ required: "Value required" }}
                error={errors.value?.message} />
            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={GitBranch}>{isEdit ? "Update Attribute" : "Create Attribute"}</Button>
            </div>
        </form>
    )
}

export default ProductAttributeForm
