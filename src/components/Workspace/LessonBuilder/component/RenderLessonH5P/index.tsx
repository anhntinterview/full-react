import { useRef } from 'react';
import { useDrop, DropTargetMonitor, XYCoord, useDrag } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import { SectionState } from 'types/Lesson.type';

type RenderLessonH5pProps = {
    onClickLessonH5p: (e: SectionState, idx: number) => void;
    data: SectionState;
    index: number;
    currentSectionIndex: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
};

type DragItem = SectionState & {
    index: number;
};

const RenderLessonH5P: React.FC<RenderLessonH5pProps> = ({
    onClickLessonH5p,
    data,
    index,
    currentSectionIndex,
    moveCard,
}) => {
    const { t: translator } = useTranslation();

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
            return { index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: true,
    });
    drag(drop(ref));
    return (
        <div
            ref={preview}
            data-handler-id={handlerId}
            onClick={() => onClickLessonH5p(data, index)}
            className={`${
                currentSectionIndex === index &&
                'bg-ooolab_bg_bar text-ooolab_blue_1'
            } cursor-pointer flex justify-between py-ooolab_p_5 pr-ooolab_p_5 pl-ooolab_p_2 border border-ooolab_bar_color rounded-lg my-ooolab_m_2`}
        >
            <p ref={ref} className="inline-flex items-center">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-ooolab_m_5 h-ooolab_h_5 fill-ooolab_bg_dark_1 mr-ooolab_m_3 cursor-move"
                >
                    <path d="M8.5 7C9.60457 7 10.5 6.10457 10.5 5C10.5 3.89543 9.60457 3 8.5 3C7.39543 3 6.5 3.89543 6.5 5C6.5 6.10457 7.39543 7 8.5 7Z" />
                    <path d="M8.5 14C9.60457 14 10.5 13.1046 10.5 12C10.5 10.8954 9.60457 10 8.5 10C7.39543 10 6.5 10.8954 6.5 12C6.5 13.1046 7.39543 14 8.5 14Z" />
                    <path d="M10.5 19C10.5 20.1046 9.60457 21 8.5 21C7.39543 21 6.5 20.1046 6.5 19C6.5 17.8954 7.39543 17 8.5 17C9.60457 17 10.5 17.8954 10.5 19Z" />
                    <path d="M15.5 7C16.6046 7 17.5 6.10457 17.5 5C17.5 3.89543 16.6046 3 15.5 3C14.3954 3 13.5 3.89543 13.5 5C13.5 6.10457 14.3954 7 15.5 7Z" />
                    <path d="M17.5 12C17.5 13.1046 16.6046 14 15.5 14C14.3954 14 13.5 13.1046 13.5 12C13.5 10.8954 14.3954 10 15.5 10C16.6046 10 17.5 10.8954 17.5 12Z" />
                    <path d="M15.5 21C16.6046 21 17.5 20.1046 17.5 19C17.5 17.8954 16.6046 17 15.5 17C14.3954 17 13.5 17.8954 13.5 19C13.5 20.1046 14.3954 21 15.5 21Z" />
                </svg>
                <span className="text-ooolab_base">{data.title}</span>
            </p>
            <span className="text-ooolab_dark_2">
                {data.files && data.files.length
                    ? `${data.files.length} ${translator('FILES')}`
                    : `${0} ${translator('FILE')}`}
            </span>
        </div>
    );
};

export default RenderLessonH5P;
