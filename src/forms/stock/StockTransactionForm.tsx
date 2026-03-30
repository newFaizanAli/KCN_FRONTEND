import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Barcode, Boxes, FileCheck2, FileText, Layers2, Calendar } from 'lucide-react';
import { Stock, StockTransaction } from '../../types';
import { useTransactionStore, useStockStore } from '../../store';
import { STOCKTRANSFERTYPES } from '../../constants';
import { checkTransactionQuantity } from '../../utilities/functions';
import { FormInput, FormSelect, FormTextarea, FormSearchSelect } from '../../components/form';
import { Alert, Button } from '../../components/ui';

interface StockTransactionFormProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    defaultValues: StockTransaction;
    handleClose: () => void;
}

const StockTransactionForm = ({ setModal, defaultValues, handleClose }: StockTransactionFormProps) => {


    const { addStockTransaction } = useTransactionStore()
    const { fetchStocks, searchStockByProduct, fetchStockById } = useStockStore()
    const [qtnError, setQtnError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: defaultValues
    });



    const onSubmit = async (data: StockTransaction) => {


        const selectedStock = await fetchStockById(data?.stockId as string)

        const checkQuantity = checkTransactionQuantity(selectedStock as Stock, data.quantity, data?.type, setQtnError)

        if (checkQuantity) {

            await addStockTransaction(data)
            fetchStocks();
            reset();
            setQtnError(null);
            setModal(false);

        }
    };

    useEffect(() => {
        if (defaultValues) {
            const formattedValues = {
                ...defaultValues
            }
            reset(formattedValues);
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {qtnError && <Alert variant="danger" className="mb-4">{qtnError}</Alert>}

            <FormSearchSelect<StockTransaction>
                label="Stock"
                placeholder="Search by product..."
                icon={Boxes}
                name="stockId"
                register={register}
                rules={{ required: "Stock required" }}
                value={
                    defaultValues?.stockId
                        ? {
                            value: defaultValues.stockId,
                            label: defaultValues.stockId || "",
                        }
                        : null
                }
                onSearch={searchStockByProduct}
                onChange={(opt) => {
                    setValue("stockId", opt.value);
                }}
                error={errors.stockId?.message}
            />



            <FormInput
                type="number"
                label="Transaction Quantity"
                placeholder="Enter transaction quantity"
                icon={Layers2}
                name="quantity"
                min={1}
                register={register}
                rules={{ required: "Quantity required" }}
                error={errors.quantity?.message}
            />

            <FormSelect
                label="Transaction Type"
                name="type"
                icon={Boxes}
                register={register}
                options={[{ value: null, label: "Select Type" }, ...STOCKTRANSFERTYPES]}
                rules={{ required: "Transaction Type required" }}
                error={errors.type?.message}
            />

            <FormInput
                label="Refrence Number"
                placeholder="Enter refrence number"
                icon={Barcode}
                name="reference_id"
                register={register}
            />


            <FormTextarea
                label="Notes"
                placeholder="Enter notes"
                icon={FileText}
                name="notes"
                register={register}
            />


            <div className="flex justify-end gap-2 pt-1">
                <Button variant="secondary" type="button" onClick={() => handleClose()}>Cancel</Button>
                <Button type="submit" icon={FileCheck2}>{"Create Transaction"}</Button>
            </div>

        </form>
    )
}

export default StockTransactionForm
