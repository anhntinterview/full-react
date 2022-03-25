import { FC } from 'react';

import { LessonInterface } from 'types/GetListOfWorkspace.type';

import Document from 'assets/SVG/document.svg';

interface LessonItem {
    data: LessonInterface;
    onClick: (e: LessonInterface) => void;
    currentActiveId: number;
}

const LessonGridItem: FC<LessonItem> = ({ data, onClick, currentActiveId }) => {
    return (
        <div
            onClick={() => onClick(data)}
            className={`border hover:border-ooolab_blue_1 cursor-pointer rounded-ooolab_h5p px-ooolab_p_4 py-ooolab_p_3
                ${
                    currentActiveId === data.id
                        ? 'border-ooolab_blue_1 '
                        : 'border-ooolab_border_logout'
                }
                `}
        >
            <div className="flex justify-between">
                <img
                    src={Document}
                    className="w-ooolab_w_6 h-ooolab_h_6 mr-ooolab_m_2"
                    alt=""
                />
                <p className="overflow-hidden overflow-ellipsis whitespace-pre">{data.title}</p>
            </div>
            <div className="flex justify-between mt-ooolab_m_8">
                <p className="text-ooolab_dark_2">{data.updated_on}</p>
                <img
                    className="w-ooolab_w_6 h-ooolab_h_6 rounded-full"
                    src={data.created_by.avatar_url}
                    alt=""
                />
            </div>
        </div>
    );
};

export default LessonGridItem;
