import { FC } from 'react';
import { CourseType } from 'types/Courses.type';
import { getTimeFromNow } from 'utils/handleFormatTime';

import CourseBG from 'assets/course-bg.jpg';
import '../../style.css';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

interface IViewGridProps {
    data: CourseType[];
    handleChangeOrder: () => void;
    order: 'asc' | 'desc' | undefined;
    handleClickCourse: (e: CourseType) => void;
    activeCourse: number;
}

const ViewGrid: FC<IViewGridProps> = ({
    data,
    handleChangeOrder,
    order,
    handleClickCourse,
    activeCourse,
}) => {
    const { t: translator } = useTranslation();
    return (
        <>
            <div className="flex items-center text-ooolab_sm pb-ooolab_p_2 border-b border-ooolab_border_logout">
                <p>{translator('COURSES.NAME')}</p>
                <p
                    onClick={() => handleChangeOrder()}
                    className="inline-flex items-center pl-ooolab_p_16 pr-ooolab_p_8 cursor-pointer text-ooolab_blue_1"
                >
                    <span>{translator('COURSES.LAST_MODIFIED')}</span>
                    {(order === 'asc' && (
                        <ArrowUpIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1" />
                    )) || (
                        <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1" />
                    )}
                </p>
                <p>{translator('COURSES.AUTHOR')}</p>
            </div>
            <div className="h-full w-full overflow-y-scroll custom-scrollbar cursor-pointer filter ">
                <div className="grid grid-cols-3 py-ooolab_p_5 gap-x-ooolab_w_5 gap-y-8">
                    {data.map((i) => (
                        <div
                            style={
                                (i?.thumbnail && {
                                    backgroundImage: `url("${i?.thumbnail}")`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                }) ||
                                {}
                            }
                            onClick={() => handleClickCourse(i)}
                            key={`course-grid-${i.id}`}
                            className={`${
                                activeCourse === i.id ? 'drop-shadow-lg' : ''
                            } bg-ooolab_dark_50 max-h-ooolab_h_45 min-h-ooolab_h_45 relative rounded-xl overflow-hidden filter drop-shadow group hover:drop-shadow-lg`}
                        >
                            {/* <img
                                src={i.thumbnail || CourseBG}
                                className="w-full h-full z-0 bg-ooolab_dark_50"
                                alt=""
                            /> */}
                            <div className="bg-img-course bg-no-repeat bg-cover absolute w-full bottom-0 left-0 z-20">
                                <div className="w-full h-full px-ooolab_p_3 py-ooolab_p_2 bg-opacity-10 group-hover:bg-opacity-5 group-hover:bg-blue-400">
                                    <p className="mb-ooolab_m_2 text-ooolab_xs text-ooolab_dark_2">
                                        {getTimeFromNow(i.updated_on)}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-1/2 overflow-hidden overflow-ellipsis whitespace-nowrap text-ooolab_dark_1 group-hover:text-ooolab_blue_1 font-medium text-ooolab_sm">
                                            {i.title}
                                        </p>
                                        <img
                                            src={i.created_by.avatar_url}
                                            className="w-ooolab_w_6 h-ooolab_h_6 rounded-full"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ViewGrid;
