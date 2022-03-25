import React from 'react';
import dayJs from 'dayjs';
import { useParams, useHistory } from 'react-router-dom';
import { H5PFile, IContentListEntry, IH5PContentList } from 'types/H5P.type';
import { H5POptions } from '../H5PComponents';
import { H5P_LIBRARY, H5P_STATUS } from 'constant/h5p.const';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { generateStatusBg } from '../H5PComponents/H5PComponentsFN';
import Tooltip from 'components/Tooltip';

interface H5PFileTableViewProps {
    canDelete: boolean;
    H5PItem: IContentListEntry;
    selected: IContentListEntry | undefined;
    setSelected: React.Dispatch<
        React.SetStateAction<IContentListEntry | undefined>
    >;
    contentList: IH5PContentList | undefined;
    setContentList: React.Dispatch<React.SetStateAction<IH5PContentList>>;
}

const H5PFileTableView: React.FC<H5PFileTableViewProps> = ({
    canDelete,
    H5PItem,
    selected,
    setSelected,
    contentList,
    setContentList,
}) => {
    const params: { id: string } = useParams();
    const history = useHistory();

    const h5pLibrary = H5PItem?.mainLibrary?.split('.')[1];
    const { time_zone = '' } = getLocalStorageAuthData();

    return (
        // <Link
        //     className="w-full"
        //     to={`/workspace/${params.id}/h5p-content/${H5PItem.Id}/play-content`}
        // >
        <div
            className={`${
                selected && selected.contentId === H5PItem.contentId
                    ? `bg-ooolab_bg_bar`
                    : ''
            } hover:bg-ooolab_bg_bar rounded-xl cursor-pointer w-full grid grid-cols-12 gap-2 group items-center  `}
        >
            <div
                onClick={() => setSelected(H5PItem)}
                onDoubleClick={() =>
                    history.push(
                        `/workspace/${params.id}/h5p-content/${H5PItem.contentId}`
                    )
                }
                className="  col-span-11 grid grid-cols-11"
            >
                <div className="py-ooolab_p_1 whitespace-nowrap col-span-4 ">
                    <Tooltip title={H5PItem?.title} mlClass="ml-0">
                        <span className="flex items-center text-ooolab_xs  font-normal group-hover:text-ooolab_blue_1 pl-ooolab_p_3">
                            {H5PItem?.title?.length < 56
                                ? H5PItem?.title
                                : `${H5PItem?.title?.slice(0, 57)}...`}
                        </span>
                    </Tooltip>
                </div>

                <div className="py-ooolab_p_1 whitespace-nowrap col-span-3  ">
                    <span className="inline-flex text-ooolab_xs leading-5 text-ooolab_gray_3  pl-ooolab_p_1_half">
                        <p className="text-ooolab_xs ">
                            {dayJs
                                .utc(H5PItem.updated_on)
                                .tz()
                                .locale('en-gb')
                                .fromNow()}
                        </p>
                    </span>
                </div>
                <div className="py-ooolab_p_1 whitespace-nowrap col-span-2  ">
                    <span className="inline-flex leading-5 text-ooolab_gray_3 items-center pl-ooolab_p_1_half text-ooolab_xs">
                        <span
                            className={`w-ooolab_w_2_root h-ooolab_h_2 shadow-ooolab_lesson_status rounded-full  mr-ooolab_m_2 ${generateStatusBg(
                                H5PItem?.status
                            )}`}
                        />
                        <span className="text-ooolab_xs">
                            {H5PItem?.status && H5P_STATUS[H5PItem?.status]}
                        </span>
                    </span>
                </div>
                <div className="py-ooolab_p_1 whitespace-nowrap col-span-2 self-center">
                    <span className="inline-flex text-ooolab_xs leading-5 text-ooolab_gray_3  pl-ooolab_p_1_half ">
                        <p className="text-ooolab_xs ">
                            {h5pLibrary && H5P_LIBRARY[h5pLibrary]}
                        </p>
                    </span>
                </div>
            </div>
            {/* </div> */}
            <div className="py-ooolab_p_1 whitespace-nowrap col-span-1 text-center self-center">
                <H5POptions
                    canDelete={canDelete}
                    id={H5PItem?.contentId}
                    workspace={params.id}
                    setSelected={setSelected}
                    contentList={contentList}
                    setContentList={setContentList}
                />
            </div>
        </div>
    );
};

export default H5PFileTableView;
