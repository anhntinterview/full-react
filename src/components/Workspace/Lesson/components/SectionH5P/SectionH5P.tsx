import { PencilAltIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from 'react-dnd';

import h5pIcon from 'assets/SVG/h5p.svg';
import dotIcon from 'assets/SVG/dotIcon.svg';
import { PlusIcon } from '@heroicons/react/solid';

import { SectionFile, SectionState } from 'types/Lesson.type';
import { IH5PContentList } from 'types/H5P.type';
import { ContentService } from 'services/h5p/ContentService';

import ListH5PModal from 'components/H5P/ListH5PModal';
import ActionsCircleButton from 'components/ActionsCircleButton';
import { H5P_LIBRARY } from 'constant/h5p.const';
import { useTranslation } from 'react-i18next';

interface SectionH5PProps {
    section?: SectionState;
    onEdit: (sec: SectionState) => void;
    onDelete: () => void;
    isActive: boolean;
    isEditable?: boolean;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const H5PItem: React.FC<{
    id: string;
    d: SectionFile;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    handleRemoveSection: (section: SectionFile) => void;
    isEditable: boolean;
}> = ({ id, d, index, moveCard, handleRemoveSection, isEditable = true }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect: (monitor) => {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover: (item: DragItem, monitor: DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
        canDrop: () => isEditable,
    });
    const [{ isDragging }, drag, preview] = useDrag({
        type: 'card',
        item: () => {
            return { id, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: isEditable,
    });
    drag(drop(ref));
    const opacity = isDragging ? 0 : 1;
    return (
        <div
            style={{ opacity }}
            ref={preview}
            data-handler-id={handlerId}
            className="flex items-center border border-ooolab_dark_1 rounded-sub_tab group hover:bg-ooolab_bg_bar cursor-pointer mb-ooolab_m_3  duration-300 "
        >
            <div className=" w-9/12  ">
                <div className=" flex items-center w-full">
                    <div className=" w-1/12 h-1/12  m-ooolab_m_1" ref={ref}>
                        <img
                            className="  mr-ooolab_m_3 w-ooolab_w_10 h-ooolab_h_10   group-hover:hidden"
                            alt=""
                            src={h5pIcon}
                        />
                        <div className="hidden w-ooolab_w_10 h-ooolab_h_10 items-center justify-center mr-ooolab_m_3  group-hover:flex rounded-ooolab_circle bg-white group ">
                            <img
                                className=" w-ooolab_w_5 h-ooolab_h_5 group-hover:flex  hover:fill-item_bar_hover"
                                alt=""
                                src={dotIcon}
                            />
                        </div>
                    </div>
                    <div className=" text-ooolab_base text-ooolab_text_username w-10/12">
                        <p>{d.file_name}</p>
                    </div>
                </div>
            </div>

            <div className="w-3/12  flex  justify-center items-center text-ooolab_dark_2 ">
                <p className="text-ooolab_sm w-5/6 ">
                    {d?.main_library &&
                        H5P_LIBRARY[d?.main_library?.split('.')[1]]}
                </p>
                {(isEditable && (
                    <div className="w-1/6">
                        <XIcon
                            onClick={() => handleRemoveSection(d)}
                            className=" justify-center w-ooolab_w_6 h-ooolab_h_6 hidden group-hover:flex hover:text-ooolab_blue_4 cursor-pointer "
                        />
                    </div>
                )) ||
                    null}
            </div>
        </div>
    );
};

const SectionH5P: React.FC<SectionH5PProps> = ({
    section,
    onEdit,
    isActive,
    isEditable = true,
    onDelete,
}) => {
    const { t: translator } = useTranslation();

    const [isOpen, setOpen] = useState<boolean>(false);
    const [sectionState, setSectionState] = useState<SectionState>({
        description: '',
        files: [],
        title: '',
    });

    const [contentList, setContentList] = useState<IH5PContentList>({
        items: [],
        order: undefined,
        page: undefined,
        per_page: undefined,
        sort_by: undefined,
        total: undefined,
    });

    const [
        filteredContentList,
        setFilteredContentList,
    ] = useState<IH5PContentList>(contentList);

    const params: { id: string } = useParams();

    const contentService: any = new ContentService(
        `/h5p/workspaces/${params.id}?status=public`
    );

    async function updateList() {
        await contentService.list().then((result: any) => {
            setContentList(result);
        });
    }

    useEffect(() => {
        updateList();
        if (section) {
            const newSection = {
                title: section.title,
                files: (section.files || []).map((file: any) => ({
                    ...file,
                    uid:
                        file.uid ||
                        Math.ceil(Math.random() * 100000000).toString(),
                })),
                description: section.description,
            };
            setSectionState(newSection);
        }
    }, [section]);

    function toggle() {
        setFilteredContentList({
            ...contentList,
            items: contentList.items.filter((item: any) =>
                (sectionState?.files || []).every((file: SectionFile) => {
                    const uid = file.file_url.match(
                        /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/g
                    );
                    if (!uid || uid.length === 0) {
                        return true;
                    }
                    return uid[0] !== item.uid;
                })
            ),
        });
        setOpen(true);
    }

    const handleRemoveSection = (section: SectionFile) => {
        const sectionRemove: SectionState = {
            title: sectionState.title,
            description: sectionState.description,
            files: sectionState?.files?.filter((c) => c !== section),
        };
        onEdit(sectionRemove);
        setSectionState(sectionRemove);
    };

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const files = sectionState.files || [];
            const card = files[dragIndex];
            let tmp;
            if (dragIndex < hoverIndex) {
                tmp = {
                    ...sectionState,
                    files: [
                        ...files.slice(0, dragIndex),
                        ...files.slice(dragIndex + 1, hoverIndex + 1),
                        card,
                        ...files.slice(hoverIndex + 1),
                    ],
                };
            } else {
                tmp = {
                    ...sectionState,
                    files: [
                        ...files.slice(0, hoverIndex),
                        card,
                        ...files.slice(hoverIndex, dragIndex),
                        ...files.slice(dragIndex + 1),
                    ],
                };
            }
            setSectionState(tmp);
            onEdit(tmp);
        },
        [sectionState]
    );

    function handleAddH5p(sec: SectionState) {
        setSectionState(sec);
        onEdit(sec);
    }
    return (
        <div>
            {isActive &&
                ((
                    <>
                        <div className="flex w-full">
                            <div className="w-3/4">
                                <h3 className="text-ooolab_dark_1 text-ooolab_lg">
                                    <input
                                        disabled={!isActive || !isEditable}
                                        onChange={(e) => {
                                            const tmp = { ...sectionState };
                                            tmp.title = e.target.value;
                                            onEdit(tmp);
                                            setSectionState(tmp);
                                        }}
                                        id="section-h5p-input"
                                        className="focus:outline-none w-ooolab_w_24 bg-white border-b border-white focus:border-ooolab_gray_2"
                                        value={sectionState.title}
                                    />
                                    <span className="text-ooolab_dark_2 text-ooolab_sm pl-ooolab_p_4">
                                        {sectionState.files &&
                                        sectionState?.files?.length > 0
                                            ? `${
                                                  sectionState.files.length
                                              } ${translator('FILE')}`
                                            : `  0 ${translator('FILE')}`}
                                    </span>
                                </h3>
                            </div>
                            <div className="w-1/4 flex justify-end items-center">
                                {(isEditable && (
                                    <div className="text-ooolab_dark_2 ">
                                        <ActionsCircleButton
                                            onclick={() => {
                                                const ele = document.getElementById(
                                                    'section-h5p-input'
                                                );
                                                if (ele) {
                                                    ele.focus();
                                                }
                                            }}
                                            icon={
                                                <PencilAltIcon className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer" />
                                            }
                                        />
                                        <ActionsCircleButton
                                            onclick={() => onDelete()}
                                            icon={
                                                <TrashIcon className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer" />
                                            }
                                        />
                                    </div>
                                )) ||
                                    null}
                            </div>
                        </div>
                        <div className="my-ooolab_m_4">
                            {sectionState?.files &&
                                sectionState.files.map((d, index) => (
                                    <H5PItem
                                        id={d.uid}
                                        d={d}
                                        index={index}
                                        moveCard={moveCard}
                                        key={d.uid}
                                        handleRemoveSection={
                                            handleRemoveSection
                                        }
                                        isEditable={isEditable}
                                    />
                                ))}
                        </div>

                        {isEditable && (
                            <div className=" flex justify-center items-center border-dashed border border-ooolab_dark_1  rounded-sub_tab h-ooolab_h_12  group group-hover:border-ooolab_selected_bar_item ">
                                <button
                                    className="flex justify-center items-center bg-ooolab_bg_btn rounded-ooolab_card p-ooolab_p_3 h-ooolab_h_8 focus:outline-none"
                                    onClick={toggle}
                                >
                                    <PlusIcon className="   w-ooolab_w_6 h-ooolab_h_6 text-ooolab_dark_1 group-hover:text-ooolab_blue_1" />
                                    <p className="text-ooolab_sm text-ooolab_dark_1 group-hover:text-ooolab_blue_1">
                                        {translator(
                                            'DASHBOARD.LESSONS.ADD_H5P'
                                        )}
                                    </p>
                                </button>
                            </div>
                        )}
                    </>
                ) ||
                    null)}
            {isOpen && (
                <ListH5PModal
                    contentList={filteredContentList}
                    isOpen={isOpen}
                    setOpen={setOpen}
                    workspaceID={params.id}
                    setSectionState={handleAddH5p}
                    sectionState={sectionState}
                />
            )}
        </div>
    );
};

export default SectionH5P;
