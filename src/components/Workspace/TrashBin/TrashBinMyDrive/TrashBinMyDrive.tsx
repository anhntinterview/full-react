import React, { useState } from 'react';
// PACKAGES
import { SearchIcon } from '@heroicons/react/solid';
import { Tab } from '@headlessui/react';

import { debounce } from 'lodash';

import comingsoon from 'assets/SVG/comingsoon.svg';

import { useTranslation } from 'react-i18next';

const TrashBinMyDrive: React.FC = ({children}) => {
    const { t: translator } = useTranslation();

    const [selectedTabs, setSelectedTabs] = useState<number>(3);

    const debounceInput = React.useCallback(
        debounce((nextValue: string, asyncFunction: (p: string) => void) => {
            asyncFunction(nextValue);
        }, 1000),
        []
    );

    function handleSearch(t: string) {
        console.log(t);
    }

    return (
        <div className="py-ooolab_p_4 px-ooolab_p_10 ">
            <div className="flex justify-between w-full mb-ooolab_m_6 ">
                <div className="flex items-center w-9/12">
                    <p className="text-ooolab_xl font-semibold text-ooolab_dark_1">
                        {translator('DASHBOARD.TRASH_BIN.TRASH_BIN')}
                    </p>
                    <div className="bg-ooolab_gray_10 h-8 mx-ooolab_m_3 w-ooolab_w_2px" />
                    <div className="relative">
                        <input
                            className={` border-2 border-ooolab_border_logout rounded-sub_tab pl-ooolab_p_3 overflow-hidden ease-linear transition-transform duration-500 w-full h-ooolab_h_10 focus:outline-none pr-ooolab_p_9`}
                            type="text"
                            placeholder={translator('SEARCH')}
                            id="searchInput"
                            onChange={(e) =>
                                debounceInput(e?.target?.value, handleSearch)
                            }
                        />
                        <SearchIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer top-ooolab_inset_22 right-ooolab_inset_5 " />
                    </div>
                </div>
            </div>
            <div className="h-ooolab_below_top_sidebar">
                <div className="rounded-ooolab_card shadow-ooolab_box_shadow_container p-ooolab_p_5 relative">
                    <Tab.Group defaultIndex={0}>
                        <Tab.List
                            as="div"
                            style={{ display: 'flex', width: '100%' }}
                        >
                            <div className="w-9/12">
                                <Tab>
                                    <button
                                        className={`${
                                            selectedTabs === 3
                                                ? 'bg-ooolab_blue_1 text-white'
                                                : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2'
                                        } px-ooolab_p_12 py-ooolab_p_1 rounded-sub_tab mr-ooolab_m_5`}
                                    >
                                        Google Drive
                                    </button>
                                </Tab>
                            </div>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="flex justify-center ">
                                    <img
                                        src={comingsoon}
                                        className={
                                            'w-ooolab_w_100 h-ooolab_h_120'
                                        }
                                    />
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    );
};

export default TrashBinMyDrive;
