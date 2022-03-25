import { Fragment, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Transition, Popover } from '@headlessui/react';

import SearchAndCheckBox from './SearchAndCheckBox';
import { CheckboxType } from 'types/Lesson.type';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { H5PContext } from 'contexts/H5P/H5PContext';
import { updateList } from '../H5PFN';
import { useTranslation } from 'react-i18next';

const H5PFilter: React.FC = () => {
    const { t: translator } = useTranslation();
    const paramsUrl: { id: string } = useParams();
    const [listContentType, setlistContentType] = useState<CheckboxType[]>([]);
    const h5PCtx = useContext(H5PContext);

    const {
        dispatch: h5pDispatch,
        H5PState: { params },
    } = h5PCtx;

    useEffect(() => {
        Object.keys(H5P_LIBRARY).forEach((d, i) => {
            const type = {
                check: false,
                id: i,
                name: d,
            };
            setlistContentType((pre) => [...pre, type]);
        });
    }, []);

    const { getValues, handleSubmit, register } = useForm();

    const submit = () => {
        const values = getValues();
        const listCheckedContentType: string[] = [];
        Object.keys(values.contentType).forEach((i) => {
            if (values.contentType[i]) {
                listCheckedContentType.push(`H5P.${i}`);
            }
        });
        const searchH5p = {
            ...params,
            content_type: listCheckedContentType.join(','),
        };
        if (listCheckedContentType) {
            listCheckedContentType.map((i) => searchH5p);
        }
        updateList(h5pDispatch, paramsUrl.id, searchH5p);
    };
    return (
        <Popover as="div" className="relative inline-block">
            {({ open }) => (
                <>
                    <Popover.Button
                        as="button"
                        className={`flex border justify-center items-center focus:outline-none  rounded-md border-none`}
                    >
                        <div className="flex items-center bg-ooolab_bg_bar px-ooolab_p_3 py-ooolab_p_2 rounded-lg text-ooolab_blue_1 text-ooolab_base focus:outline-none">
                            <span className="bg-img-item-filter bg-no-repeat bg-contain w-ooolab_w_6 h-ooolab_h_6 mr-ooolab_m_2 "></span>
                            <span>
                                {translator('DASHBOARD.H5P_CONTENTS.FILTER')}
                            </span>
                        </div>
                    </Popover.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Popover.Panel
                            unmount
                            className="z-9999 min-w-ooolab_w_56 p-ooolab_p_5 bg-white shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 rounded-header_menu focus:outline-none"
                        >
                            {({ close }) => (
                                <>
                                    <span className="text-ooolab_dark_1 text-ooolab_base font-medium">
                                        {translator(
                                            'DASHBOARD.H5P_CONTENTS.FILTER'
                                        )}
                                        /{' '}
                                        <span className="text-ooolab_blue_3">
                                            {' '}
                                            {translator(
                                                'DASHBOARD.H5P_CONTENTS.H5P_CONTENTS'
                                            )}
                                        </span>
                                    </span>
                                    <form onSubmit={handleSubmit(submit)}>
                                        <div className="flex mt-ooolab_m_4">
                                            <div className="min-w-ooolab_w_56 mr-ooolab_m_1">
                                                <SearchAndCheckBox
                                                    listCheckBox={
                                                        listContentType
                                                    }
                                                    register={register}
                                                    getValues={getValues}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-ooolab_p_3 text-right">
                                            <button
                                                onClick={() => {
                                                    handleSubmit(submit);
                                                    setTimeout(
                                                        () => close(),
                                                        500
                                                    );
                                                }}
                                                className="bg-ooolab_blue_1 text-white px-ooolab_p_3 py-ooolab_p_1 rounded-lg focus:outline-none"
                                            >
                                                {translator(
                                                'APPLY'
                                            )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default H5PFilter;
