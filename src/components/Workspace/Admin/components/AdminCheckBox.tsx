import { FC, useEffect, useRef, useState } from 'react';
import {
    FieldValues,
    UseFormGetValues,
    UseFormRegister,
} from 'react-hook-form';
import { SearchIcon } from '@heroicons/react/outline';
import { CheckboxType } from 'types/Lesson.type';
import { FORM_FIlTER, TYPE_FILTER } from 'constant/form.const';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string;
    listCheckBox: CheckboxType[];
    register: UseFormRegister<FieldValues>;
    placeholder: string;
    getValues: UseFormGetValues<FieldValues>;
    onSearch?: (e: string) => void;
}

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2 mb-ooolab_m_2';

const AdminCheckbox: FC<Props> = ({
    listCheckBox,
    register,
    title,
    placeholder,
    onSearch,
    getValues,
}) => {
    const { t: translator } = useTranslation();

    const [Type, setType] = useState<CheckboxType[]>([]);

    useEffect(() => {
        const values = getValues();

        let checked: CheckboxType[] = listCheckBox;
        if (values.Authors) {
            Object.keys(values.Authors).forEach((i) => {
                if (values.Authors[i]) {
                    const arr = i.split('-');
                    const idChecked = arr.shift() || '';
                    const indexOfItem = checked.findIndex(
                        (q) => q.id == idChecked
                    );
                    if (indexOfItem > -1) {
                        checked[indexOfItem].check = true;
                    }
                } else {
                    const arr = i.split('-');
                    const idUnChecked = arr.shift() || '';
                    const indexOfItem = checked.findIndex(
                        (q) => q.id == idUnChecked
                    );
                    if (indexOfItem > -1) {
                        checked[indexOfItem].check = false;
                    }
                }
            });
        }
        if (checked) {
            checked.sort((x, y) => {
                return Number(y.check) - Number(x.check);
            });
            setType(checked);
        }
    }, []);

    // useEffect(() => {
    //     if (listCheckBox) {
    //         setType(listCheckBox);
    //     }
    // }, [listCheckBox]);

    function handleSearchType(e: string) {
        if (e) {
            const searchItem: CheckboxType[] = listCheckBox.filter((d) =>
                d.name.toLowerCase().includes(e.toLowerCase())
            );
            setType(searchItem);
        } else {
            setType(listCheckBox);
        }
    }

    function handleSearch(e: string) {
        switch (title) {
            case 'Authors':
                onSearch && onSearch(e);
                break;
            case 'Status':
                handleSearchType(e);
                break;
            case 'Type':
                handleSearchType(e);
                break;

            default:
                break;
        }
    }

    function generateLabel(e: string) {
        switch (title) {
            case 'Authors':
                return e;
            case 'Status':
                return FORM_FIlTER.statusType[e];
            case 'Type':
                return TYPE_FILTER(translator)[e];
            default:
                break;
        }
    }

    function unCheck() {}

    return (
        <div>
            <p className="font-medium w-full text-ooolab_sm text-black py-ooolab_p_1_half">
                {title === 'Type'
                    ? translator('DASHBOARD.ADMIN_APPROVAL.TYPE')
                    : translator('DASHBOARD.ADMIN_APPROVAL.AUTHOR')}
            </p>

            <div className="relative mb-ooolab_m_4 mt-ooolab_m_1 pr-ooolab_p_1">
                <input
                    className=" bg-gray-50 rounded-sub_tab focus:outline-none pl-ooolab_p_10 py-ooolab_p_1 text-ooolab_xs"
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <SearchIcon
                    className={`${iconStyle}  absolute left-0 top-0 h-full ml-ooolab_m_2`}
                />
            </div>
            <div className="max-h-ooolab_h_30 overflow-y-scroll custom-scrollbar">
                <div className="flex items-center mb-ooolab_m_2">
                    <input
                        className="mr-ooolab_m_3 w-ooolab_w_4 h-ooolab_h_4"
                        type="checkbox"
                        {...register(`${title}.all`, {})}
                        id={`${title}.all`}
                        onClick={unCheck}
                    />
                    <label className="text-ooolab_xs text-black">
                        {translator('DASHBOARD.ADMIN_APPROVAL.SELECT_ALL')}
                    </label>
                </div>
                {Type &&
                    Type.map((i) => (
                        <div
                            key={i.id}
                            className="flex items-center mb-ooolab_m_2"
                        >
                            <input
                                className="mr-ooolab_m_3 w-ooolab_w_4 h-ooolab_h_4"
                                type="checkbox"
                                defaultChecked={i.check}
                                {...register(
                                    `${title}.${i.id}-${i.name
                                        .split('.')
                                        .join(' ')}`,
                                    {}
                                )}
                                id={`${i.name}-${i.id}`}
                            />
                            <label
                                className="text-ooolab_xs text-black"
                                htmlFor={i.name}
                            >
                                {generateLabel(i.name)}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AdminCheckbox;
