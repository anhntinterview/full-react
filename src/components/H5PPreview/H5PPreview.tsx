import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import * as React from 'react';
import {
    useContext,
    useEffect,
    useRef,
    useCallback,
    useState,
    useMemo,
} from 'react';
import { useParams, Link } from 'react-router-dom';
import h5pIcon from 'assets/logo512.png';
import editIcon from 'assets/SVG/pencil.svg';
import listIcon from 'assets/SVG/list.svg';
import closeIcon from 'assets/SVG/close.svg';
import shareIcon from 'assets/SVG/share.svg';
import Slider from 'react-slick';
import { LessonSection } from 'types/GetListOfWorkspace.type';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { genClassNames } from 'utils/handleString';
import { LibraryIcon } from 'constant/setupBars.const';
import { HOST_URL } from 'constant/api.const';

const Arrow = ({ reverse }: { reverse: boolean }) => (
    <svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        fill="none"
        style={reverse ? { transform: 'scaleX(-1)' } : undefined}
    >
        <path
            d="M8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893L15.7071 6.29289C15.8946 6.48043 16 6.73478 16 7C16 7.26522 15.8946 7.51957 15.7071 7.70711L9.70711 13.7071C9.31658 14.0976 8.68342 14.0976 8.29289 13.7071C7.90237 13.3166 7.90237 12.6834 8.29289 12.2929L12.5858 8L1 8C0.447715 8 0 7.55229 0 7C0 6.44772 0.447715 6 1 6L12.5858 6L8.29289 1.70711C7.90237 1.31658 7.90237 0.683417 8.29289 0.292893Z"
            fill="#0071CE"
        />
    </svg>
);

const DoubleArrow = ({
    reverse,
    disabled,
}: {
    reverse: boolean;
    disabled?: boolean;
}) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        style={reverse ? { transform: 'scaleX(-1)' } : undefined}
    >
        <path
            d="M5.24408 0.41107C5.56951 0.0856329 6.09715 0.085633 6.42259 0.41107L11.4226 5.41107C11.748 5.73651 11.748 6.26415 11.4226 6.58958L6.42259 11.5896C6.09715 11.915 5.56951 11.915 5.24408 11.5896C4.91864 11.2641 4.91864 10.7365 5.24408 10.4111L9.65482 6.00033L5.24408 1.58958C4.91864 1.26414 4.91864 0.736507 5.24408 0.41107ZM0.244078 0.41107C0.569515 0.085633 1.09715 0.085633 1.42259 0.41107L6.42259 5.41107C6.57887 5.56735 6.66667 5.77931 6.66667 6.00033C6.66667 6.22134 6.57887 6.4333 6.42259 6.58958L1.42259 11.5896C1.09715 11.915 0.569514 11.915 0.244078 11.5896C-0.0813592 11.2641 -0.0813592 10.7365 0.244078 10.4111L4.65482 6.00033L0.244078 1.58958C-0.0813584 1.26414 -0.0813584 0.736507 0.244078 0.41107Z"
            fill={disabled === true ? '#C7C9D9' : '#2E3A59'}
        />
    </svg>
);

const H5PPreview: React.FC = () => {
    const params: { id: string; lessonId: string } = useParams();
    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const [index, setIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [showSection, setShowSection] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [info, setInfo] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (getWorkspaceDetailState.currentLesson?.sections === undefined) {
            workspaceMiddleware.getLessonDetail(
                dispatch,
                params.id,
                params.lessonId
            );
        } else if (
            (
                getWorkspaceDetailState.currentLesson?.sections
                    ?.map((item: LessonSection) => item.files || [])
                    ?.flat() || []
            ).length === 0
        ) {
            setInfo('No files to preview');
        } else {
            setTimeout(() => setShowLoading(false), 6000);
        }
    }, [getWorkspaceDetailState.currentLesson?.sections]);
    const ref = useRef<any>();
    const data = useMemo(
        () =>
            getWorkspaceDetailState.currentLesson?.sections
                ?.map((item: LessonSection, sectionIndex: number) =>
                    (item.files || []).map((file: any, index: number) => ({
                        ...file,
                        index: `${index + 1}/${(item.files || []).length}`,
                        sectionIndex,
                        firstFile: index === 0 ? sectionIndex : -1,
                    }))
                )
                ?.flat() || [],
        [getWorkspaceDetailState.currentLesson?.sections]
    );

    const beforeChange = useCallback(
        (current: number, next: number) => {
            setIndex(next);
            if (
                data[next]?.sectionIndex &&
                sectionIndex !== data[next]?.sectionIndex
            ) {
                setSectionIndex(data[next].sectionIndex);
            }
        },
        [sectionIndex, data]
    );
    const sections = useMemo(
        () =>
            getWorkspaceDetailState.currentLesson?.sections
                ?.slice(3 * page, 3 * page + 3)
                ?.map((item: LessonSection) => ({
                    title: item.title,
                    disabled: (item.files || []).length === 0,
                })) || [],
        [getWorkspaceDetailState.currentLesson?.sections, page]
    );
    const frames = useMemo(
        () =>
            data.map(
                ({
                    file_url,
                }: {
                    file_name: string;
                    file_mimetype: string;
                    file_url: string;
                }) => (
                    <iframe
                        height="550"
                        width="100%"
                        src={file_url.replace(HOST_URL || '', '')}
                    />
                )
            ),
        [data]
    );
    return (
        <>
            <div
                className={genClassNames({
                    'flex flex-col items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-white z-70': true,
                    hidden: !showLoading,
                })}
            >
                {info ? (
                    <div className="text-ooolab_xl">{info}</div>
                ) : (
                    <>
                        <div className="animate-pulse flex items-center justify-center w-min my-6 rounded-sub_tab shadow-ooolab_inset_navigation px-6 shadow-ooolab_box_shadow_container w-min rounded-sub_tab h-ooolab_h_13">
                            <div className="bg-ooolab_dark_50 h-ooolab_h_4 w-ooolab_w_64 rounded-ooolab_h5p"></div>
                        </div>

                        <div className="animate-pulse py-2 mt-3">
                            <div
                                className="bg-ooolab_dark_50 w-ooolab_w_h5p_preview ml-20 rounded-ooolab_h5p p-4"
                                style={{ height: 550 }}
                            ></div>
                        </div>
                    </>
                )}
            </div>
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-min my-6 rounded-sub_tab shadow-ooolab_inset_navigation">
                    <div className="items-center flex px-3 shadow-ooolab_box_shadow_container w-min rounded-sub_tab h-ooolab_h_13">
                        <Link to={`/workspace/${params.id}/lesson`}>
                            <div className="bg-ooolab_bar_icon bg-bg-bar-item flex items-center justify-center w-ooolab_w_7_n h-ooolab_h_7">
                                <LibraryIcon active />
                            </div>
                        </Link>
                        <Link
                            to={`/workspace/${params.id}/lesson/${params.lessonId}`}
                            className="ml-8"
                        >
                            <div className="w-ooolab_w_7_n h-ooolab_h_7 flex items-center justify-center border-ooolab_transparent border-ooolab_border_bar_button hover:bg-ooolab_bg_sub_tab_hover hover:border-ooolab_transparent p-ooolab_p_1_e rounded-full">
                                <img src={editIcon} />
                            </div>
                        </Link>
                        <div className="w-ooolab_w_7_n h-ooolab_h_7 flex items-center justify-center ml-3 cursor-pointer border-ooolab_transparent border-ooolab_border_bar_button hover:bg-ooolab_bg_sub_tab_hover hover:border-ooolab_transparent p-ooolab_p_1_e rounded-full">
                            <img src={shareIcon} />
                        </div>
                        <div className="mx-8 w-ooolab_w_0.0625 bg-ooolab_border_logout self-stretch my-2" />
                        <div className="whitespace-nowrap">
                            {getWorkspaceDetailState.currentLesson?.title || ''}
                        </div>
                        <div
                            onClick={() => setShowSection(!showSection)}
                            className="shadow-ooolab_box_shadow_container w-ooolab_w_7_n h-ooolab_h_7 flex items-center justify-center ml-4 cursor-pointer border-ooolab_transparent border-ooolab_border_bar_button hover:bg-ooolab_bg_sub_tab_hover hover:border-ooolab_transparent p-ooolab_p_1_e rounded-full"
                        >
                            <img src={showSection ? closeIcon : listIcon} />
                        </div>
                    </div>
                    <div
                        className={genClassNames({
                            'flex items-center overflow-hidden transition-width duration-300 h-ooolab_h_13 ease-linear': true,
                            'px-ooolab_p_5 w-ooolab_w_h5p_preview_bar': showSection,
                            'w-0': !showSection,
                        })}
                    >
                        <div
                            onClick={() => {
                                if (page > 0) {
                                    setPage(page - 1);
                                }
                            }}
                            className="cursor-pointer flex items-center justify-center w-ooolab_w_5 h-ooolab_h_5"
                        >
                            <DoubleArrow reverse disabled={page === 0} />
                        </div>
                        <div className="flex-1 px-ooolab_p_5 flex">
                            {sections.map(
                                (
                                    section: {
                                        title: string;
                                        disabled: boolean;
                                    },
                                    index: number
                                ) => (
                                    <div
                                        onClick={() => {
                                            if (
                                                sectionIndex !==
                                                    3 * page + index &&
                                                !section.disabled
                                            ) {
                                                const target = data.findIndex(
                                                    (item: any) =>
                                                        item.firstFile ===
                                                        3 * page + index
                                                );
                                                if (target !== -1) {
                                                    ref.current &&
                                                        ref.current.slickGoTo(
                                                            target
                                                        );
                                                }
                                                setSectionIndex(
                                                    3 * page + index
                                                );
                                            }
                                        }}
                                        className={genClassNames({
                                            'cursor-pointer w-ooolab_w_40 text-center px-3 py-1 truncate rounded-sub_tab': true,
                                            'ml-ooolab_m_5': index !== 0,
                                            'bg-ooolab_blue_1':
                                                sectionIndex ===
                                                3 * page + index,
                                            'text-white':
                                                sectionIndex ===
                                                3 * page + index,
                                            'text-ooolab_text_bar_inactive hover:bg-ooolab_bg_bar':
                                                !section.disabled &&
                                                sectionIndex !==
                                                    3 * page + index,
                                            'cursor-not-allowed text-ooolab_text_section_disabled':
                                                section.disabled,
                                        })}
                                    >
                                        {section.title}
                                    </div>
                                )
                            )}
                        </div>
                        <div
                            onClick={() => {
                                if (page !== Math.ceil(data.length / 3) - 1) {
                                    setPage(page + 1);
                                }
                            }}
                            className="cursor-pointer flex items-center justify-center w-ooolab_w_5 h-ooolab_h_5"
                        >
                            <DoubleArrow
                                reverse={false}
                                disabled={
                                    page === Math.ceil(data.length / 3) - 1
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center py-2 mt-3">
                <div
                    onClick={() => ref.current && ref.current.slickPrev()}
                    className={genClassNames({
                        'hover:bg-ooolab_blue_2 cursor-pointer flex items-center justify-center rounded-full w-ooolab_w_10 h-ooolab_h_10 shadow-ooolab_sub_item': true,
                        invisible: index === 0,
                    })}
                >
                    <Arrow reverse />
                </div>
                <div className="w-ooolab_w_h5p_preview ml-20 shadow-ooolab_sub_item rounded-ooolab_h5p p-4">
                    <div className="flex mb-4">
                        <div className="flex-1 flex items-center">
                            <img
                                className="w-ooolab_w_6 h-ooolab_h_6"
                                alt=""
                                src={h5pIcon}
                            />
                            <div className="text-ooolab_sm text-ooolab_text_username ml-3">
                                {data.length > index && !!data[index]
                                    ? data[index].file_name
                                    : ''}
                            </div>
                        </div>
                        <div className="text-ooolab_sm text-ooolab_dark_2">
                            {data.length > index && !!data[index]
                                ? data[index].index
                                : ''}
                        </div>
                        <div className="text-ooolab_sm text-ooolab_dark_2 flex-1 text-right">
                            {data.length > index && !!data[index]
                                ? ({
                                      'application/h5p': 'H5P',
                                  } as any)[data[index].file_mimetype]
                                : ''}
                        </div>
                    </div>
                    <Slider
                        ref={ref}
                        arrows={false}
                        beforeChange={beforeChange}
                    >
                        {frames}
                    </Slider>
                </div>
                <div
                    onClick={() => ref.current && ref.current.slickNext()}
                    className={genClassNames({
                        'hover:bg-ooolab_blue_2 cursor-pointer ml-20 flex items-center justify-center rounded-full w-ooolab_w_10 h-ooolab_h_10 shadow-ooolab_sub_item': true,
                        invisible: index === data.length - 1,
                    })}
                >
                    <Arrow reverse={false} />
                </div>
            </div>
        </>
    );
};

export default H5PPreview;
