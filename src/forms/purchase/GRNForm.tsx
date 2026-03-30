import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    Clipboard, Calendar,
    Package2Icon
} from 'lucide-react';
import { GoodsReceivedNote } from "../../types";
import { usePurchaseOrderStore, useGoodsReceivedNoteStore, useStockStore, useTransactionStore } from '../../store';
import { FormInput, FormSelect, FormSearchSelect } from '../../components/form';
import { Button } from '../../components/ui';

interface GRNProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: GoodsReceivedNote
    handleClose: () => void
}

const GRNForm = ({ setModal, isEdit, defaultValues, handleClose }: GRNProps) => {

    const { addGoodsReceivedNote } = useGoodsReceivedNoteStore()
    const { searchPurchaseOrderByID } = usePurchaseOrderStore()
    const { fetchStocks } = useStockStore()
    const { fetchStockTransactions } = useTransactionStore()

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

    const onSubmit = async (data: GoodsReceivedNote) => {
        await addGoodsReceivedNote(data)
        await fetchStocks();
        await fetchStockTransactions();
        reset();
        setModal(false);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormSearchSelect<GoodsReceivedNote>
                label="Purchase Order"
                placeholder="Search order by Id..."
                icon={Clipboard}
                name="purchaseId"
                register={register}
                rules={{ required: "Purchase Order required" }}
                value={
                    defaultValues?.purchaseId
                        ? {
                            value: defaultValues.purchaseId as string,
                            label: defaultValues.purchaseId as string || "",
                        }
                        : null
                }
                onSearch={searchPurchaseOrderByID}
                onChange={(opt) => {
                    setValue("purchaseId", opt.value);
                }}
                error={errors.purchaseId?.message}
            />

            <FormInput
                type='date'
                label="Created At"
                placeholder="Enter Created At"
                icon={Calendar}
                name="createdAt"
                register={register}
                rules={{ required: "Date required" }}
                error={errors.createdAt?.message}
            />


            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={Package2Icon}>{isEdit ? "Update GRN" : "Create GRN"}</Button>
            </div>

        </form>
    )
}

export default GRNForm
