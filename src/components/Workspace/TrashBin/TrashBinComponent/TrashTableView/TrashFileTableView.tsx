import React from 'react';
import dayJs from 'dayjs';
import { useParams, useHistory } from 'react-router-dom';

import { H5PFile, IContentListEntry, IH5PContentList } from 'types/H5P.type';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import Tooltip from 'components/Tooltip';

interface TrashFileTableViewProps {
    item: any;
    selected: number | undefined;
    setSelected: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const TrashFileTableView: React.FC<TrashFileTableViewProps> = ({
    item,
    selected,
    setSelected,
}) => {
    const params: { id: string } = useParams();
    const history = useHistory();

    const { time_zone } = getLocalStorageAuthData();

    return (
        <div
            className={`${
                selected && selected === item.id ? `bg-ooolab_bg_bar` : ''
            } hover:bg-ooolab_bg_bar rounded-xl cursor-pointer w-full  group items-center  `}
        >
            <div
                className="  col-span-5  grid grid-cols-12"
                onClick={() => setSelected(item.id)}
            >
                <div className="py-ooolab_p_1 whitespace-nowrap col-span-5 ">
                    <Tooltip title={item?.title} mlClass="ml-0">
                        <span className="flex items-center text-ooolab_xs  font-normal group-hover:text-ooolab_blue_1 pl-ooolab_p_3">
                            {item?.title?.length < 75
                                ? item?.title
                                : `${item?.title?.slice(0, 76)}...`}
                        </span>
                    </Tooltip>
                </div>

                <div className="py-ooolab_p_1 whitespace-nowrap col-span-4  ">
                    <span className="inline-flex text-ooolab_xs leading-5 text-ooolab_gray_3  pl-ooolab_p_1_half">
                        <p className="text-ooolab_xs ">
                            {time_zone &&
                                dayJs
                                    .utc(item.updated_on)
                                    .tz(time_zone)
                                    .locale('en-gb')
                                    .fromNow()}
                        </p>
                    </span>
                </div>
                <div className="py-ooolab_p_1 whitespace-nowrap col-span-3  ">
                    <span className="inline-flex leading-5 text-ooolab_gray_3 items-center pl-ooolab_p_1_half text-ooolab_xs">
                        <span className="text-ooolab_xs">
                            {item?.created_by && item?.created_by.display_name}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TrashFileTableView;
