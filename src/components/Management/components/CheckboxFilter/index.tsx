import { useCallback, useEffect, useRef } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

interface CheckboxFilterInterface {
    listValue: string[];
    name: string;
    onSelectBox: (val: Record<string, string>) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterInterface> = ({
    listValue,
    name,
    onSelectBox,
}) => {
    const {
        register,
        setValue,
        control,
        formState: { isSubmitting },
        handleSubmit,
        watch,
        getValues,
    } = useForm({
        defaultValues: {
            [name]: listValue.map((i) => ({
                name: i,
                value: false,
            })),
        },
    });

    const { fields } = useFieldArray({
        name,
        control,
    });

    const value = useWatch({
        name,
        control,
    });

    const submitForm = (e) => {
        // console.log(e);
    };

    const handleChangeCheckbox = useCallback(
        (index: number, isCheck: boolean) => {
            const copyArr = [...value];
            const target = copyArr[index];
            if (target) {
                copyArr.splice(index, 1, {
                    ...target,
                    value: !target.value,
                });
                setValue(name, copyArr);
                handleSubmit(() => {})();
            }
        },
        [value]
    );

    useEffect(() => {
        if (isSubmitting) {
            onSelectBox({
                [name]: value
                    .filter((i) => i.value)
                    .map((j) => j.name)
                    .join(','),
            });
            console.log('val', value);
        }
    }, [isSubmitting]);

    return (
        <div>
            <section className="flex items-center justify-between my-ooolab_m_3 ">
                <p className="text-ooolab_xs text-ooolab_dark_1 font-semibold leading-ooolab_24px capitalize">
                    {name}
                </p>
                <button
                    // onClick={() => {
                    //     setValue(
                    //         name,
                    //         listValue.map((i) => ({
                    //             value: true,
                    //             name: i,
                    //         }))
                    //     );
                    // }}
                    onClick={() => {
                        setValue(
                            name,
                            listValue.map((i) => ({
                                name: i,
                                value: true,
                            }))
                        );
                        handleSubmit(submitForm)();
                    }}
                    type="submit"
                    className="text-ooolab_xs text-ooolab_dark_2 font-semibold leading-ooolab_24px"
                >
                    Select all
                </button>
            </section>
            <form>
                {fields.map((i, index) => {
                    return (
                        <div
                            key={i.id}
                            className="flex items-center mb-ooolab_m_2"
                        >
                            <input
                                className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_3"
                                type="checkbox"
                                id={`${name}.${index}.${i.name}`}
                                defaultChecked={i.value}
                                {...register(
                                    `${index}.${i.name}.value` as const
                                )}
                                onClick={() =>
                                    handleChangeCheckbox(index, true)
                                }
                            />
                            <label
                                className="text-ooolab_xs text-ooolab_dark_1"
                                htmlFor={`${name}.${index}.${i.name}`}
                            >
                                {i.name}
                            </label>
                        </div>
                    );
                })}
            </form>
        </div>
    );
};

export default CheckboxFilter;
