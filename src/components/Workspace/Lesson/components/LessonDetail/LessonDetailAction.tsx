import {
    DuplicateIcon,
    EyeIcon,
    LinkIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import Modal from 'components/Modal';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CancelChanges from 'assets/SVG/cancel.svg';


const iconStyle =
    'h-ooolab_h_5 w-ooolab_w_5 mr-ooolab_m_3 text-ooolab_dark_2 cursor-pointer mt-ooolab_m_5 hover:text-ooolab_dark_1';

interface LessonActionInterface {
    lessonId: string;
    workspaceId: string;
    handleDelete: () => void;
    canRemove: boolean;
}

const LessonDetailAction: React.FC<LessonActionInterface> = ({
    lessonId,
    workspaceId,
    handleDelete,
    canRemove,
}) => {
    const history = useHistory();
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

    const handleEditLesson = () => {
        history.push(`/workspace/${workspaceId}/lesson/${lessonId}`);
    };
    return (
        <div className="flex">
            <Modal
                isOpen={modalConfirmDelete}
                title="Confirm Delete Course"
                imgSrc={CancelChanges}
                mainBtn={
                    <button
                        onClick={() => {
                            handleDelete();
                            setTimeout(() => setModalConfirmDelete(false), 300);
                        }}
                        className="px-ooolab_p_4 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        Yes, do it!
                    </button>
                }
                subBtn={
                    <button
                        onClick={() => setModalConfirmDelete(false)}
                        className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        No!
                    </button>
                }
                onClose={() => setModalConfirmDelete(false)}
            />
            <Link to={`/workspace/${workspaceId}/lesson/${lessonId}/preview`}>
                <EyeIcon className={iconStyle} />
            </Link>
            <PencilIcon
                onClick={() => handleEditLesson()}
                className={iconStyle}
            />
            {/* <DuplicateIcon className={iconStyle} /> */}
            {/* <LinkIcon className={iconStyle} /> */}

            {(canRemove && (
                <TrashIcon onClick={handleDelete} className={iconStyle} />
            )) ||
                null}
        </div>
    );
};

export default LessonDetailAction;
