import React, { useContext, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { H5PContext } from 'contexts/H5P/H5PContext';
import h5pMiddlware from 'middleware/h5p.middlware';
import { useParams } from 'react-router';
import { TFunction } from 'react-i18next';

interface TrashOptionsProps {
    selected: number | undefined;
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
    selectedTabs: number;
    handleRestore(): void;
    translator: TFunction<'translation'>;
}

const TrashOptions: React.FC<TrashOptionsProps> = ({
    setSelected,
    handleRestore,
    translator,
}) => {
    return (
        <div className="flex justify-end items-center">
            <div
                onClick={handleRestore}
                className="text-ooolab_1xs border rounded-lg shadow-ooolab_sub_item w-ooolab_w_25 h-ooolab_h_6  cursor-pointer border-ooolab_dark_1 flex items-center justify-center mr-ooolab_m_3 hover:bg-ooolab_blue_1 hover:text-white"
            >
                {translator('DASHBOARD.TRASH_BIN.RESTORE')}
            </div>
            <div className="">
                <XIcon
                    className="h-ooolab_h_5 w-ooolab_w_5 text-ooolab_dark_2 cursor-pointer hover:text-ooolab_pink_1"
                    onClick={() => setSelected(undefined)}
                />
            </div>
        </div>
    );
};

export default TrashOptions;
