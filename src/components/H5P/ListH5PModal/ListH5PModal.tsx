/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayJs from 'dayjs';
// PACKAGE
import { Dialog, RadioGroup, Transition } from '@headlessui/react';
import filterIcon from 'assets/SVG/filterIcon.svg';
import H5Psquare from 'assets/SVG/H5Psquare.svg';
import { SearchIcon } from '@heroicons/react/solid';

//TYPE
import { IH5PContentList, IH5PPlayerArgs } from 'types/H5P.type';
import { SectionFile, SectionState } from 'types/Lesson.type';
import h5PServices from 'services/h5p.service';

// CONTEXTS
import { H5PContext } from 'contexts/H5P/H5PContext';

import './style.css';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface ListH5PModalProps {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    contentList: IH5PContentList;
    workspaceID: string;
    // setSectionState: React.Dispatch<React.SetStateAction<SectionState>>;
    setSectionState: (sec: SectionState) => void;
    sectionState: SectionState;
}

const ListH5PModal: React.FC<ListH5PModalProps> = ({
    isOpen,
    setOpen,
    contentList,
    workspaceID,
    setSectionState,
    sectionState,
}) => {
    const { t: translator } = useTranslation();

    const cancelButtonRef = useRef(null);
    const { time_zone } = getLocalStorageAuthData();

    const [isChecked, setIsChecked] = useState<boolean>(false);

    const [selected, setSelected] = useState<string>();

    const [isEmbed, setIsEmbed] = useState<string>();

    const params: { id: string } = useParams();

    const [original, setOriginal] = useState<IH5PContentList>(contentList);

    const [inputValue, setInputValue] = useState<string>();

    const onChangeInput = (e) => {
        setInputValue(e.target.value);
    };

    useEffect(() => setOriginal(contentList), [contentList]);

    const [searchResults, setSearchResults] = useState<IH5PContentList>(
        original
    );

    const h5PCtx = React.useContext(H5PContext);
    const {
        dispatch,
        H5PState: { h5PApproveContentResult, err },
    } = h5PCtx;

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm();

    function onClose() {
        setOpen(false);
    }

    function onSubmit() {
        return async () => {
            if (selected) {
                const itemH5P = original?.items.find(
                    (i) => i.contentId == selected
                );
                if (itemH5P?.uid) {
                    const url =
                        window.location.hostname === 'localhost'
                            ? 'http://'
                            : 'https://';
                    setIsEmbed(
                        `${url}${window.location.host}/contents/${itemH5P.uid}/embed`
                    );
                    // setIsEmbed(`${HOST_URL}/contents/${itemH5P.uid}/embed`);
                }
                // else {
                //     const argsId: IH5PPlayerArgs = {
                //         contentId: selected,
                //         workspaceId: workspaceID,
                //     };
                //     await h5pMiddleware.h5pApproveContent(dispatch, argsId);
                // }
            }
        };
    }

    useEffect(() => {
        if (isEmbed) {
            const itemH5P = original?.items.find(
                (i) => i.contentId == selected
            );
            setSectionState({
                title: sectionState.title,
                description: sectionState.description,
                files: [
                    {
                        uid: itemH5P?.uid || '',
                        file_name: itemH5P?.title || ' ',
                        file_url: isEmbed,
                        file_mimetype: 'application/h5p',
                        main_library: itemH5P?.mainLibrary,
                    },
                    ...(sectionState.files || []),
                ],
            });
            setOriginal({
                ...original,
                items: original?.items?.filter(
                    (item: any) => item.contentId !== selected
                ),
            });
            setSearchResults({
                ...searchResults,
                items: searchResults?.items?.filter(
                    (item: any) => item.contentId !== selected
                ),
            });
        }
    }, [isEmbed]);

    function handleSelected(e: any) {
        setSelected(e);
    }

    async function handleSearch(t) {
        let arrayUID = [];
        sectionState.files.map((d) => arrayUID.push(d.file_url.split('/')[4]));
        await h5PServices
            .h5pContentList(params.id, { title: t, status: 'public' })
            .then((result) => {
                const itemH5P = result?.items?.filter(
                    (i) => !arrayUID.includes(i?.uid)
                );
                setOriginal({
                    items: itemH5P,
                    order: original.order,
                    page: original.page,
                    per_page: original.per_page,
                    sort_by: original.sort_by,
                    total: original.total,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // function handleSubmitSearch() {
    //     const value = getValues('h5p');
    //     if (value) {
    //         const itemH5P = original?.items.filter((i) =>
    //             i.title.includes(value)
    //         );
    //         if (itemH5P) {
    // setSearchResults({
    //     items: itemH5P,
    //     order: original.order,
    //     page: original.page,
    //     per_page: original.per_page,
    //     sort_by: original.sort_by,
    //     total: original.total,
    // });
    //         }
    //     } else {
    //         setSearchResults(original);
    //     }
    // }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-70 inset-0 overflow-y-hidden"
                initialFocus={cancelButtonRef}
                open={isOpen}
                onClose={onClose}
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
                            <form
                                className="pb-7"
                                onSubmit={handleSubmit(onSubmit())}
                            >
                                <div className="p-ooolab_p_5">
                                    <div className="flex items-center ">
                                        <p className="w-10/12 text-ooolab_base text-ooolab_dark_1">
                                            {translator(
                                                'ADD_H5P_CONTENT.SELECT_H5P_FILE'
                                            )}
                                        </p>
                                        {/* <button className="flex items-center bg-ooolab_bg_bar rounded-header_menu py-ooolab_p_1 px-ooolab_p_3 focus:outline-none">
                                            <img
                                                src={filterIcon}
                                                alt=""
                                                className="w-ooolab_w_4 h-ooolab_h_4"
                                            />
                                            <p className="text-ooolab_sm text-ooolab_blue_1 ml-ooolab_m_2">
                                                {' '}
                                                Filter
                                            </p>
                                        </button> */}
                                    </div>
                                    <div className="relative w-1/2 h-ooolab_h_9 mt-ooolab_m_3">
                                        <input
                                            type="text"
                                            placeholder={translator(
                                                'ADD_H5P_CONTENT.SEARCH'
                                            )}
                                            className="focus:outline-none pl-ooolab_p_3 pr-ooolab_p_9 px-ooolab_p_2 w-full h-full border border-ooolab_border_logout rounded-sub_tab"
                                            onChange={(e) => onChangeInput(e)}
                                            onKeyDown={(e: any) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch(
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                        ></input>
                                        <SearchIcon
                                            className="absolute top-ooolab_8px right-ooolab_8px w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 hover:text-ooolab_blue_4 cursor-pointer"
                                            onClick={() =>
                                                handleSearch(inputValue)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="py-ooolab_p_3 align-middle inline-block min-w-full  ">
                                        <div className=" overflow-hidden ">
                                            <div className="grid gap-2 grid-cols-10 mb-ooolab_m_3 px-ooolab_p_5">
                                                <div className="col-span-4 font-medium text-ooolab_gray_10  flex items-center">
                                                    <p className="text-ooolab_1xs">
                                                        {translator(
                                                            'ADD_H5P_CONTENT.NAME'
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="col-span-3 justify-center font-medium text-ooolab_gray_10  flex items-center">
                                                    <p className="text-ooolab_1xs">
                                                        {translator(
                                                            'ADD_H5P_CONTENT.LAST_MODIFIED'
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="col-span-3 text-center font-medium text-ooolab_gray_10">
                                                    <p className="text-ooolab_1xs">
                                                        {translator(
                                                            'ADD_H5P_CONTENT.CONTENT_TYPE'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border rounded-sub_tab bg-ooolab_vertical_line mb-ooolab_m_3">
                                            {' '}
                                        </div>

                                        <div className="overflow-y-auto custom-scrollbar h-ooolab_h_bar_item ">
                                            <RadioGroup
                                                value={selected}
                                                onChange={(e) =>
                                                    handleSelected(e)
                                                }
                                            >
                                                {original?.items.map(
                                                    (d) =>
                                                        d.status ===
                                                            'public' && (
                                                            <RadioGroup.Option
                                                                key={
                                                                    d.contentId
                                                                }
                                                                value={
                                                                    d.contentId
                                                                }
                                                                className={({
                                                                    active,
                                                                    checked,
                                                                }) =>
                                                                    `${
                                                                        active &&
                                                                        'bg-ooolab_bg_bar text-ooolab_blue_1'
                                                                    }
                                                                        ${
                                                                            checked &&
                                                                            'bg-ooolab_bg_bar text-ooolab_blue_1'
                                                                        }
                
                                                                  hover:bg-ooolab_bg_bar cursor-pointer w-full grid grid-cols-10 gap-2 py-ooolab_p_2 px-ooolab_p_5`
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    checked,
                                                                }) => (
                                                                    <>
                                                                        <div className="whitespace-nowrap col-span-4">
                                                                            <span className="flex items-center text-ooolab_1sx font-normal">
                                                                                <img
                                                                                    src={
                                                                                        H5Psquare
                                                                                    }
                                                                                    alt=""
                                                                                    className="mr-ooolab_m_2 w-ooolab_w_6 h-ooolab_h_6"
                                                                                />
                                                                                <p
                                                                                    className={`text-ooolab_1xs overflow-hidden overflow-ellipsis whitespace-pre ${
                                                                                        checked
                                                                                            ? 'text-ooolab_blue_1'
                                                                                            : 'text-ooolab_dark_1'
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        d.title
                                                                                    }
                                                                                </p>
                                                                            </span>
                                                                        </div>

                                                                        <div className=" whitespace-nowrap col-span-3 text-center">
                                                                            <span className=" inline-flex text-ooolab_1xs leading-5 ">
                                                                                <p
                                                                                    className={`text-ooolab_1xs ${
                                                                                        checked
                                                                                            ? 'text-ooolab_blue_1'
                                                                                            : 'text-ooolab_gray_3'
                                                                                    }`}
                                                                                >
                                                                                    {d.updated_on &&
                                                                                        time_zone &&
                                                                                        dayJs
                                                                                            .utc(
                                                                                                d.updated_on
                                                                                            )
                                                                                            .tz(
                                                                                                time_zone
                                                                                            )
                                                                                            .locale(
                                                                                                'en-gb'
                                                                                            )
                                                                                            .fromNow()}
                                                                                </p>
                                                                            </span>
                                                                        </div>
                                                                        <div className=" whitespace-nowrap col-span-3 text-center">
                                                                            <span className=" inline-flex text-ooolab_1xs leading-5  ">
                                                                                <p
                                                                                    className={`text-ooolab_1xs ${
                                                                                        checked
                                                                                            ? 'text-ooolab_blue_1'
                                                                                            : 'text-ooolab_gray_3'
                                                                                    }`}
                                                                                >
                                                                                    {d?.mainLibrary &&
                                                                                        H5P_LIBRARY[
                                                                                            d?.mainLibrary?.split(
                                                                                                '.'
                                                                                            )[1]
                                                                                        ]}
                                                                                </p>
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        )
                                                )}
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-white float-right text-ooolab_1xs mr-ooolab_m_5 p-ooolab_p_1 mb-ooolab_m_4 text-ooolab_blue_1 px-ooolab_p_3 rounded-header_menu focus:outline-none border border-ooolab_blue_1  hover:bg-ooolab_blue_1 hover:text-white focus:bg-ooolab_blue_1 focus:text-white">
                                    {translator('ADD_H5P_CONTENT.SELECT')}
                                </button>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ListH5PModal;
