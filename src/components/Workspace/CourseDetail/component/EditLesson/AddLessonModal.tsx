import { Fragment, useState, useEffect, useRef, FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { debounce } from 'lodash';
import { Transition, Dialog, RadioGroup } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/outline';

import workspaceService from 'services/workspace.service';
import { LessonInterface, LessonResponse } from 'types/GetListOfWorkspace.type';
import { getTimeFromNow } from 'utils/handleFormatTime';
import { RadioLessonType } from './index';
import { useTranslation } from 'react-i18next';

type AddLessonModalProps = {
    open: boolean;
    onCloseModal: () => void;
    onSubmit: (e: RadioLessonType) => void;
    selectedLessonParams: { lesson_uid: string }[];
};

type RadioLessonInterfae = LessonInterface & {
    check?: boolean;
};

const SkeletonItem = () => {
    return (
        <>
            <div className="grid animate-pulse gap-2 grid-cols-10 mb-ooolab_m_3 px-ooolab_p_5 mt-ooolab_m_3">
                <div className="col-span-6 font-medium text-ooolab_gray_10  flex items-center bg-ooolab_dark_50 rounded w-2/3 h-ooolab_h_5"></div>
                <div className="col-span-4 flex justify-center font-medium text-ooolab_gray_10  h-ooolab_h_5">
                    <div className="bg-ooolab_dark_50 rounded w-2/5 h-full"></div>
                </div>
            </div>
            <div className="grid animate-pulse gap-2 grid-cols-10 mb-ooolab_m_3 px-ooolab_p_5 mt-ooolab_m_3">
                <div className="col-span-6 font-medium text-ooolab_gray_10  flex items-center bg-ooolab_dark_50 rounded w-2/3 h-ooolab_h_5"></div>
                <div className="col-span-4 flex justify-center font-medium text-ooolab_gray_10  h-ooolab_h_5">
                    <div className="bg-ooolab_dark_50 rounded w-2/5 h-full"></div>
                </div>
            </div>
            <div className="grid animate-pulse gap-2 grid-cols-10 mb-ooolab_m_3 px-ooolab_p_5 mt-ooolab_m_3">
                <div className="col-span-6 font-medium text-ooolab_gray_10  flex items-center bg-ooolab_dark_50 rounded w-2/3 h-ooolab_h_5"></div>
                <div className="col-span-4 flex justify-center font-medium text-ooolab_gray_10  h-ooolab_h_5">
                    <div className="bg-ooolab_dark_50 rounded w-2/5 h-full"></div>
                </div>
            </div>
            <div className="grid animate-pulse gap-2 grid-cols-10 mb-ooolab_m_3 px-ooolab_p_5 mt-ooolab_m_3">
                <div className="col-span-6 font-medium text-ooolab_gray_10  flex items-center bg-ooolab_dark_50 rounded w-2/3 h-ooolab_h_5"></div>
                <div className="col-span-4 flex justify-center font-medium text-ooolab_gray_10  h-ooolab_h_5">
                    <div className="bg-ooolab_dark_50 rounded w-2/5 h-full"></div>
                </div>
            </div>
        </>
    );
};

const AddLessonModal: FC<AddLessonModalProps> = ({
    open,
    onCloseModal,
    onSubmit,
    selectedLessonParams,
}) => {
    const params: { id: string } = useParams();
    const cancelButtonRef = useRef(null);
    const lessonRef = useRef<any>();
    const [listLesson, setListLesson] = useState<RadioLessonInterfae[]>();
    const [loading, setLoading] = useState(false);
    const { t: translator } = useTranslation();

    const handleSearchLesson = (e: string) => {
        setLoading(true);
        workspaceService
            .getLessonList(params.id, {
                status: 'public',
                title: e,
            })
            .then((res) => {
                if (res) {
                    const flatSelected = selectedLessonParams.map(
                        (i) => i.lesson_uid
                    );
                    const result: RadioLessonInterfae[] =
                        (res.items?.length &&
                            res.items.map((i) => ({
                                ...i,
                                check: flatSelected.includes(i.uid),
                            }))) ||
                        [];

                    setListLesson(result);
                }
            })
            .catch(() => setListLesson(undefined))
            .finally(() => setTimeout(() => setLoading(false), 300));
    };

    const debounceInput = useCallback(
        debounce((nextValue: string) => {
            handleSearchLesson(nextValue);
        }, 700),
        []
    );

    useEffect(() => {
        if (open) {
            setLoading(true);
            workspaceService
                .getLessonList(params.id, {
                    status: 'public',
                })
                .then((res) => {
                    if (res) {
                        const flatSelected = selectedLessonParams.map(
                            (i) => i.lesson_uid
                        );
                        const result: RadioLessonInterfae[] =
                            (res.items?.length &&
                                res.items.map((i) => ({
                                    ...i,
                                    check: flatSelected.includes(i.uid),
                                }))) ||
                            [];

                        setListLesson(result);
                    }
                })
                .catch(() => setListLesson(undefined))
                .finally(() => setTimeout(() => setLoading(false), 1000));
        }
    }, [open]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-hidden"
                initialFocus={cancelButtonRef}
                open={open}
                onClose={onCloseModal}
            >
                <div className="flex i justify-center min-h-screen p-ooolab_p_4 pb-ooolab_p_20 text-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-ooolab_gray_4 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-ooolab_card text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle w-2/5 relative">
                            <form className="pb-7">
                                <div className="p-ooolab_p_5">
                                    <div className="flex items-center ">
                                        <p className="w-10/12 text-ooolab_base text-ooolab_dark_1">
                                            {translator(
                                                'COURSES.SELECT_LESSON'
                                            )}
                                        </p>
                                    </div>
                                    <div className="relative w-1/2 h-ooolab_h_9 mt-ooolab_m_7">
                                        <input
                                            type="text"
                                            placeholder={translator('SEARCH')}
                                            className="focus:outline-none pl-ooolab_p_3 pr-ooolab_p_9 px-ooolab_p_2 w-full h-full border border-ooolab_border_logout rounded-sub_tab"
                                            onChange={(e) =>
                                                debounceInput(e.target.value)
                                            }
                                        ></input>
                                        <SearchIcon
                                            className="absolute top-ooolab_8px right-ooolab_8px w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 hover:text-ooolab_blue_4 cursor-pointer"
                                            // onClick={handleSearchLesson}
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="py-ooolab_p_3 align-middle inline-block min-w-full  ">
                                        <div className=" overflow-hidden ">
                                            <div className="grid gap-2 grid-cols-10 mb-ooolab_m_3 px-ooolab_p_5">
                                                <div className="col-span-6 font-medium text-ooolab_gray_10  flex items-center">
                                                    <p className="text-ooolab_1xs">
                                                        {translator(
                                                            'COURSES.AUTHOR'
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="col-span-4 justify-center font-medium text-ooolab_gray_10  flex items-center">
                                                    <p className="text-ooolab_1xs">
                                                        {translator(
                                                            'COURSES.LAST_MODIFIED'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border rounded-sub_tab bg-ooolab_vertical_line mb-ooolab_m_3">
                                            {' '}
                                        </div>

                                        <div className="overflow-y-auto custom-scrollbar h-ooolab_h_add_modal ">
                                            {(loading && <SkeletonItem />) || (
                                                <RadioGroup
                                                    value={
                                                        listLesson?.length
                                                            ? listLesson[0]
                                                            : null
                                                    }
                                                    onChange={(e) => {
                                                        lessonRef.current = e;
                                                    }}
                                                >
                                                    {(listLesson &&
                                                        listLesson?.length &&
                                                        listLesson?.map((d) => (
                                                            <RadioGroup.Option
                                                                disabled={
                                                                    d.check
                                                                }
                                                                key={d.id}
                                                                value={{
                                                                    title:
                                                                        d.title,
                                                                    id: d.id,
                                                                    uid: d.uid,
                                                                }}
                                                                className={({
                                                                    active,
                                                                    checked,
                                                                    disabled,
                                                                }) =>
                                                                    `${
                                                                        active &&
                                                                        !disabled &&
                                                                        'bg-ooolab_bg_bar text-ooolab_blue_1'
                                                                    }
                                                    ${
                                                        checked &&
                                                        !disabled &&
                                                        'bg-ooolab_bg_bar text-ooolab_blue_1'
                                                    }

                                              ${
                                                  !disabled
                                                      ? 'hover:bg-ooolab_bg_bar cursor-pointer '
                                                      : 'opacity-20 cursor-not-allowed'
                                              } w-full grid grid-cols-10 gap-2 py-ooolab_p_2 px-ooolab_p_5`
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    checked,
                                                                }) => (
                                                                    <>
                                                                        <div className="whitespace-nowrap flex items-center col-span-6">
                                                                            <span className="p-ooolab_p_1_e bg-ooolab_blue_1 rounded-md mr-ooolab_m_3">
                                                                                <svg
                                                                                    width="12"
                                                                                    height="14"
                                                                                    viewBox="0 0 12 14"
                                                                                    fill="none"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="w-ooolab_w_31 h-ooolab_h_3_e"
                                                                                >
                                                                                    <path
                                                                                        d="M0.666748 1.66683C0.666748 0.930451 1.2637 0.333496 2.00008 0.333496H7.33341C7.51023 0.333496 7.67979 0.403734 7.80482 0.528758L11.1382 3.86209C11.2632 3.98712 11.3334 4.15669 11.3334 4.3335V12.3335C11.3334 13.0699 10.7365 13.6668 10.0001 13.6668H2.00008C1.2637 13.6668 0.666748 13.0699 0.666748 12.3335V1.66683ZM9.72394 4.3335L7.33341 1.94297V4.3335H9.72394ZM6.00008 1.66683L2.00008 1.66683V12.3335H10.0001V5.66683H6.66675C6.29856 5.66683 6.00008 5.36835 6.00008 5.00016V1.66683ZM3.33341 7.66683C3.33341 7.29864 3.63189 7.00016 4.00008 7.00016H8.00008C8.36827 7.00016 8.66675 7.29864 8.66675 7.66683C8.66675 8.03502 8.36827 8.3335 8.00008 8.3335H4.00008C3.63189 8.3335 3.33341 8.03502 3.33341 7.66683ZM3.33341 10.3335C3.33341 9.96531 3.63189 9.66683 4.00008 9.66683H8.00008C8.36827 9.66683 8.66675 9.96531 8.66675 10.3335C8.66675 10.7017 8.36827 11.0002 8.00008 11.0002H4.00008C3.63189 11.0002 3.33341 10.7017 3.33341 10.3335Z"
                                                                                        fill="white"
                                                                                    />
                                                                                </svg>
                                                                            </span>
                                                                            <p
                                                                                className={`text-ooolab_1xs overflow-hidden overflow-ellipsis whitespace-pre`}
                                                                            >
                                                                                {
                                                                                    d.title
                                                                                }
                                                                            </p>
                                                                        </div>

                                                                        <div className=" whitespace-nowrap col-span-4 text-center">
                                                                            <span className=" inline-flex text-ooolab_1xs leading-5 ">
                                                                                <p
                                                                                    className={`text-ooolab_1xs`}
                                                                                >
                                                                                    {d.updated_on &&
                                                                                        getTimeFromNow(
                                                                                            d.updated_on
                                                                                        )}
                                                                                </p>
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        ))) || (
                                                        <p className="px-ooolab_p_5">
                                                            {translator(
                                                                'ADD_H5P_CONTENT.NO_RESULT'
                                                            )}
                                                        </p>
                                                    )}
                                                </RadioGroup>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (lessonRef.current)
                                            onSubmit(lessonRef.current);
                                        lessonRef.current = null;
                                        onCloseModal();
                                    }}
                                    className="float-right text-ooolab_1xs mr-ooolab_m_5 p-ooolab_p_1 mb-ooolab_m_4 text-white px-ooolab_p_2 py-ooolab_p_1_e rounded-header_menu focus:outline-none border-ooolab_blue_1  bg-ooolab_blue_1 hover:bg-ooolab_light_blue_0 hover:text-ooolab_blue_1"
                                >
                                    {translator('SELECT')}
                                </button>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default AddLessonModal;
