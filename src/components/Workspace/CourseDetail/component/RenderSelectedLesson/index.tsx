import { FC, useRef } from 'react';
import { EyeIcon, XIcon } from '@heroicons/react/outline';
import { useDrop, DropTargetMonitor, XYCoord, useDrag } from 'react-dnd';

import { RadioLessonType } from '../EditLesson';
import { Link, useParams } from 'react-router-dom';

type RenderSelectedLessonProps = {
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    data: RadioLessonType;
    index: number;
    onRemove: (uid: string) => void;
};

type DragItem = RadioLessonType & {
    index: number;
};

const RenderSelectedLesson: FC<RenderSelectedLessonProps> = ({
    data,
    index,
    moveCard,
    onRemove,
}) => {
    const params: { id: string } = useParams();
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
        canDrop: () => true,
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'card',
        item: () => {
            return { id: data.id, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: true,
    });
    drag(drop(ref));
    
    return (
        <div
            // style={{ opacity }}
            ref={preview}
            data-handler-id={handlerId}
            className="flex justify-between items-center mb-ooolab_m_5 p-ooolab_p_2 hover:bg-ooolab_bg_bar hover:border-opacity-0 rounded-sub_tab border border-ooolab_border_logout group"
        >
            <div className="flex items-center">
                <div
                    ref={ref}
                    className="relative bg-ooolab_blue_1 group-hover:bg-white group-hover:shadow-ooolab_box_shadow_container w-ooolab_w_10 h-ooolab_h_10 flex items-center justify-center cursor-pointer border rounded-full "
                >
                    <svg
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-ooolab_w_4 h-ooolab_h_4 group-hover:hidden"
                    >
                        <path
                            d="M0 2C0 0.895432 0.89543 0 2 0H10C10.2652 0 10.5196 0.105357 10.7071 0.292893L15.7071 5.29289C15.8946 5.48043 16 5.73478 16 6V18C16 19.1046 15.1046 20 14 20H2C0.895432 20 0 19.1046 0 18V2ZM13.5858 6L10 2.41421V6H13.5858ZM8 2L2 2V18H14V8H9C8.44772 8 8 7.55228 8 7V2ZM4 11C4 10.4477 4.44772 10 5 10H11C11.5523 10 12 10.4477 12 11C12 11.5523 11.5523 12 11 12H5C4.44772 12 4 11.5523 4 11ZM4 15C4 14.4477 4.44772 14 5 14H11C11.5523 14 12 14.4477 12 15C12 15.5523 11.5523 16 11 16H5C4.44772 16 4 15.5523 4 15Z"
                            fill="white"
                        />
                    </svg>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-ooolab_m_5 h-ooolab_h_5 hidden fill-ooolab_bg_dark_1 group-hover:inline-block hover:fill-ooolab_blue_1"
                    >
                        <path d="M8.5 7C9.60457 7 10.5 6.10457 10.5 5C10.5 3.89543 9.60457 3 8.5 3C7.39543 3 6.5 3.89543 6.5 5C6.5 6.10457 7.39543 7 8.5 7Z" />
                        <path d="M8.5 14C9.60457 14 10.5 13.1046 10.5 12C10.5 10.8954 9.60457 10 8.5 10C7.39543 10 6.5 10.8954 6.5 12C6.5 13.1046 7.39543 14 8.5 14Z" />
                        <path d="M10.5 19C10.5 20.1046 9.60457 21 8.5 21C7.39543 21 6.5 20.1046 6.5 19C6.5 17.8954 7.39543 17 8.5 17C9.60457 17 10.5 17.8954 10.5 19Z" />
                        <path d="M15.5 7C16.6046 7 17.5 6.10457 17.5 5C17.5 3.89543 16.6046 3 15.5 3C14.3954 3 13.5 3.89543 13.5 5C13.5 6.10457 14.3954 7 15.5 7Z" />
                        <path d="M17.5 12C17.5 13.1046 16.6046 14 15.5 14C14.3954 14 13.5 13.1046 13.5 12C13.5 10.8954 14.3954 10 15.5 10C16.6046 10 17.5 10.8954 17.5 12Z" />
                        <path d="M15.5 21C16.6046 21 17.5 20.1046 17.5 19C17.5 17.8954 16.6046 17 15.5 17C14.3954 17 13.5 17.8954 13.5 19C13.5 20.1046 14.3954 21 15.5 21Z" />
                    </svg>
                </div>
                <p className="ml-ooolab_m_5 text-ooolab_dark_1 text-ooolab_sm font-medium">
                    {data.title}
                </p>
            </div>
            <div className=" items-center text-ooolab_dark_2 hidden group-hover:flex">
                <Link target="_blank" to={`/workspace/${params.id}/lesson/${data.id}/preview`}>
                    <EyeIcon className="w-ooolab_w_5 h-ooolab_h_4 mr-ooolab_m_1 hover:text-ooolab_blue_1 cursor-pointer" />
                </Link>
                <XIcon
                    onClick={() => onRemove(data.uid)}
                    className="w-ooolab_w_5 h-ooolab_h_4 hover:text-ooolab_blue_1 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default RenderSelectedLesson;
