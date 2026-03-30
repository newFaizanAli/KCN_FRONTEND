import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Category } from '../types';
import { Folder, FolderCheck } from 'lucide-react';
import { useCategoryStore } from '../store';
import { Button } from '../components/ui';
import { FormInput } from '../components/form';



interface CategoryFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: Category;
    handleClose: () => void;
}

const CategoryForm = ({ setModal, isEdit, defaultValues, handleClose }: CategoryFormProps) => {

    const { addCategory, editCategory } = useCategoryStore()

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

    const onSubmit = (data: Category) => {
        if (isEdit) {
            editCategory(defaultValues?.id as string, data)
            handleClose()
        } else {
            addCategory(data);
            reset();
            setModal(false);
        }
    };

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="Category Name" placeholder="Enter category name" icon={Folder}
                name="name" register={register} rules={{ required: "Name required" }}
                error={errors.name?.message} />
            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FolderCheck}>{isEdit ? "Update Category" : "Create Category"}</Button>
            </div>
        </form>

    )
}

export default CategoryForm
