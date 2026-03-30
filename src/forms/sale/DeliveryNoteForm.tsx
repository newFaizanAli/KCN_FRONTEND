


import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
    Clipboard, Calendar,
    Package2Icon
} from 'lucide-react';
import { DeliveryNote } from "../../types";
import { useStockStore, useTransactionStore, useSaleOrderStore, useDeliveryNoteStore } from '../../store';
import { FormInput, FormSearchSelect } from '../../components/form';
import { Button } from '../../components/ui';

interface DNProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    defaultValues: DeliveryNote
    handleClose: () => void
}

const DeliveryNoteForm = ({ setModal, isEdit, defaultValues, handleClose }: DNProps) => {

    const { addDeliveryNote } = useDeliveryNoteStore()
    const { searchSaleOrderByID } = useSaleOrderStore()
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

    const onSubmit = async (data: DeliveryNote) => {
        await addDeliveryNote(data)
        await fetchStocks();
        await fetchStockTransactions();
        reset();
        setModal(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


            <FormSearchSelect<DeliveryNote>
                label="Sale Order"
                placeholder="Search sale order..."
                icon={Clipboard}
                name="saleId"
                register={register}
                rules={{ required: "Sale Order required" }}
                value={
                    defaultValues?.saleId
                        ? {
                            value: defaultValues.saleId as string,
                            label: defaultValues.saleId as string || "",
                        }
                        : null
                }
                onSearch={searchSaleOrderByID}
                onChange={(opt) => {
                    setValue("saleId", opt.value);
                }}
                error={errors.saleId?.message}
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
                <Button type="submit" icon={Package2Icon}>{isEdit ? "Update Delivery Note" : "Create Delivery Note"}</Button>
            </div>

        </form>
    )
}

export default DeliveryNoteForm
