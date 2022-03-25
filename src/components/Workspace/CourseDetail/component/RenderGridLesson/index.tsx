import { FC } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { LessonInterface } from 'types/GetListOfWorkspace.type';

type RenderGridLessonProps = {
    data: LessonInterface;
};

const RenderGridLesson: FC<RenderGridLessonProps> = ({ data }) => {
    const history = useHistory();
    const params: { id: string } = useParams();
    return (
        <Link target="_blank" to={`/workspace/${params.id}/lesson/${data.id}/preview`}>
            <div className="py-ooolab_p_3 px-ooolab_p_4 rounded-ooolab_h5p border border-ooolab_border_logout bg-white cursor-pointer hover:shadow-ooolab_box_shadow_container">
                <p className="w-2/3 inline-flex items-center mb-ooolab_m_7 ">
                    <span>
                        <svg
                            width="16"
                            height="20"
                            viewBox="0 0 16 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-ooolab_w_4 h-ooolab_h_5 mr-ooolab_m_3"
                        >
                            <path
                                d="M0 2C0 0.895432 0.89543 0 2 0H10C10.2652 0 10.5196 0.105357 10.7071 0.292893L15.7071 5.29289C15.8946 5.48043 16 5.73478 16 6V18C16 19.1046 15.1046 20 14 20H2C0.895432 20 0 19.1046 0 18V2ZM13.5858 6L10 2.41421V6H13.5858ZM8 2L2 2V18H14V8H9C8.44772 8 8 7.55228 8 7V2ZM4 11C4 10.4477 4.44772 10 5 10H11C11.5523 10 12 10.4477 12 11C12 11.5523 11.5523 12 11 12H5C4.44772 12 4 11.5523 4 11ZM4 15C4 14.4477 4.44772 14 5 14H11C11.5523 14 12 14.4477 12 15C12 15.5523 11.5523 16 11 16H5C4.44772 16 4 15.5523 4 15Z"
                                fill="#0071CE"
                            />
                        </svg>
                    </span>
                    <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {data.title}
                    </span>
                </p>
                <div className="flex justify-end">
                    <img
                        src={data.created_by.avatar_url}
                        className="h-ooolab_h_6 w-ooolab_w_6 rounded-full"
                        alt=""
                    />
                </div>
            </div>
        </Link>
    );
};

export default RenderGridLesson;
