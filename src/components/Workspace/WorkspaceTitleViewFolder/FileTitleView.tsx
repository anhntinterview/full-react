import React from 'react';
import {
    FolderIcon,
    DocumentIcon,
    PhotographIcon,
} from '@heroicons/react/solid';
import { useDrag, DragSourceMonitor, useDrop } from 'react-dnd';

// import { MIME_TYPE } from 'constant/google.const';
import { GoogleFiles } from 'types/GoogleType';
// import bookmark from 'assets/SVG/bookmarks.svg';

import googleMiddleware from 'middleware/google.middleware';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';

type FileDataProps = {
    data: GoogleFiles;
    allowDrop?: boolean;
    allowDrag?: boolean;
    //drop
};

// interface DropResult {
//     allowedDropEffect: string;
//     dropEffect: string;
//     name: string;
// }

const FileTitleView: React.FC<FileDataProps> = ({
    data,
    allowDrag = true,
    allowDrop = true,
}) => {
    const { dispatch, googleState } = React.useContext(
        GoogleAPIAndServicesContext
    );

    const { status, targetId } = googleState;

    //drag setup
    const [{ opacity }, drag] = useDrag(
        () => ({
            type: 'file',
            item: {
                id: data.id,
                name: data.name,
            },
            options: {
                dropEffect: 'copy',
            },
            end(item, monitor) {
                const rs: any = monitor.getDropResult();
                const isDrop = monitor.didDrop();
                if (isDrop) {
                    if (rs.id && item.id && rs.id !== item.id) {
                        googleMiddleware.updateFile(dispatch, {
                            action: 'move',
                            fieldId: item.id,
                            files: {
                                target: item.name,
                                targetId: item.id,
                                destination: rs.name,
                            },
                            args: {
                                addParents: rs.id,
                                fields: '*',
                            },
                        });
                    }
                }
            },
            collect: (monitor: DragSourceMonitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
                name: monitor.getDropResult(),
            }),
            canDrag: data.isAppAuthorized && allowDrag,
        }),
        [data.id]
    );

    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: 'file',
            drop: () => ({
                id: data.id,
                type: data.mimeType,
                isAppAuthorized: data.isAppAuthorized,
                name: data.name,
            }),
            collect: (monitor: any) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
            canDrop: () => {
                if (data?.capabilities?.canAddChildren && allowDrop)
                    return true;

                return false;
            },
        }),
        []
    );

    const active = canDrop && isOver;

    const generateType = (type: string) => {
        let tmp = 'file';
        if (type.includes('image')) {
            tmp = 'image';
        } else if (type.includes('folder')) {
            tmp = 'folder';
        }
        return tmp;
    };

    const generateIcon = (i: string) => {
        const type = generateType(i);
        const iconStyle =
            'text-ooolab_gray_2 w-ooolab_w_8 h-ooolab_h_6 ml-ooolab_m_2 mr-ooolab_m_3';
        switch (type) {
            case 'folder':
                return <FolderIcon className={iconStyle} />;
                break;
            case 'image':
                return <PhotographIcon className={iconStyle} />;
            default:
                return <DocumentIcon className={iconStyle} />;
                break;
        }
    };

    return (
        <div
            ref={drag}
            className={`${
                active && 'bg-ooolab_blue_5 border-white text-white'
            } relative w-full focus:border-ooolab_blue_2 focus:outline-none focus:bg-ooolab_blue_2  hover:bg-ooolab_blue_2 rounded-xl hover:border-ooolab_blue_2 border-2 border-transparent`}
        >
            {(targetId === data.id && googleState.status === 'pending' && (
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 inline-flex items-center rounded-xl z-9999">
                    <svg
                        className="animate-spin h-ooolab_h_6 w-ooolab_w_6 text-white opacity-100 block m-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )) ||
                null}
            <div ref={drop} className="w-full z-50">
                <div className="my-ooolab_m_3 ">
                    <div className="flex w-full items-center mb-ooolab_m_1">
                        {generateIcon(data.mimeType)}
                        <span className="text-ooolab_sm font-normal">
                            {data.name.length < 10
                                ? data.name
                                : `${data.name.slice(0, 10)}...`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileTitleView;
