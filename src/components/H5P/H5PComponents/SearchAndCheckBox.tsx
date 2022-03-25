import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
    FieldValues,
    UseFormGetValues,
    UseFormRegister,
} from 'react-hook-form';
import { SearchIcon } from '@heroicons/react/outline';
import { CheckboxType } from 'types/Lesson.type';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { useTranslation } from 'react-i18next';

interface Props {
    listCheckBox: CheckboxType[];
    register: UseFormRegister<FieldValues>;
    getValues: UseFormGetValues<FieldValues>;
}

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2 mb-ooolab_m_2';

const SearchAndCheckBox: FC<Props> = ({
    register,
    getValues,
    listCheckBox,
}) => {
    const [contentType, setContentType] = useState<CheckboxType[]>([]);
    const { t: translator } = useTranslation();

    useEffect(() => {
        const values = getValues();

        let checked: CheckboxType[] = listCheckBox;
        if (values.contentType) {
            Object.keys(values.contentType).forEach((i) => {
                if (values.contentType[i]) {
                    const indexOfItem = checked.findIndex((q) => q.name === i);
                    if (indexOfItem > -1) {
                        checked[indexOfItem].check = true;
                    }
                } else {
                    const indexOfItem = checked.findIndex((q) => q.name === i);
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
            setContentType(checked);
        }
    }, []);

    function handleSearchContentType(e: string) {
        if (e) {
            const searchItem: CheckboxType[] = listCheckBox.filter((d) =>
                d.name.toLowerCase().includes(e.toLowerCase())
            );
            setContentType(searchItem);
        } else {
            setContentType(listCheckBox);
        }
    }

    return (
        <div>
            <p className="font-medium w-full text-ooolab_sm text-black py-ooolab_p_1_half">
            {translator(
                        'DASHBOARD.H5P_CONTENTS.CONTENT_TYPE'
                    )}
            </p>

            <div className="relative mb-ooolab_m_4 mt-ooolab_m_1 pr-ooolab_p_1">
                <input
                    className=" bg-gray-50 rounded-sub_tab focus:outline-none pl-ooolab_p_10 py-ooolab_p_1 text-ooolab_xs"
                    type="text"
                    placeholder={translator(
                        'DASHBOARD.H5P_CONTENTS.SEARCH_CONTENT_TYPE'
                    )}
                    onChange={(e) => handleSearchContentType(e.target.value)}
                />
                <SearchIcon
                    className={`${iconStyle}  absolute left-0 top-0 h-full ml-ooolab_m_2`}
                />
            </div>
            <div className="max-h-ooolab_h_30 overflow-y-scroll custom-scrollbar">
                {contentType &&
                    contentType.map((i) => (
                        <div
                            key={i.id}
                            className="flex items-center mb-ooolab_m_2"
                        >
                            <input
                                className="mr-ooolab_m_3 w-ooolab_w_4 h-ooolab_h_4"
                                type="checkbox"
                                defaultChecked={i.check}
                                {...register(
                                    `${'contentType'}.${i.name
                                        .split('.')
                                        .join(' ')}`
                                )}
                                id={i.name}
                            />
                            <label
                                className="text-ooolab_xs text-black"
                                htmlFor={i.name}
                            >
                                {H5P_LIBRARY[i.name]}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default SearchAndCheckBox;
