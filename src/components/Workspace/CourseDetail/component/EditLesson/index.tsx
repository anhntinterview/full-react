import { useCallback, useState, FC, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/outline';

import AddLessonModal from './AddLessonModal';
import RenderSelectedLesson from '../RenderSelectedLesson';
import { LessonInterface } from 'types/GetListOfWorkspace.type';
import { useTranslation } from 'react-i18next';

export type RadioLessonType = {
    id: number;
    uid: string;
    title: string;
};

type EditLessonProps = {
    setLessons: (e: { lesson_uid: string }[]) => void;
    lessons: LessonInterface[] | undefined;
    selectedLessonParams: { lesson_uid: string }[];
};

const EditLesson: FC<EditLessonProps> = ({
    setLessons,
    lessons,
    selectedLessonParams,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<RadioLessonType[]>([]);
    const { t: translator } = useTranslation();

    const handleAddLesson = (e: RadioLessonType) => {
        setSelectedLesson((prev) => {
            const newState = [...prev, e];
            setLessons(
                newState.map((i) => ({
                    lesson_uid: i.uid,
                }))
            );
            return newState;
        });
    };

    const handleMoveSelectedLesson = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const tmpSelected = [...selectedLesson];
            const draggedLesson = selectedLesson[dragIndex];
            let tmp;
            if (dragIndex < hoverIndex) {
                tmp = [
                    ...tmpSelected.slice(0, dragIndex),
                    ...tmpSelected.slice(dragIndex + 1, hoverIndex + 1),
                    draggedLesson,
                    ...tmpSelected.slice(hoverIndex + 1),
                ];
            } else {
                tmp = [
                    ...tmpSelected.slice(0, hoverIndex),
                    draggedLesson,
                    ...tmpSelected.slice(hoverIndex, dragIndex),
                    ...tmpSelected.slice(dragIndex + 1),
                ];
            }
            setSelectedLesson(tmp);
            setLessons(
                tmp.map((i) => ({
                    lesson_uid: i.uid,
                }))
            );
        },
        [selectedLesson]
    );

    const handleRemoveSelectedLesson = useCallback(
        (uid: string) => {
            const targetIndex = selectedLesson.findIndex((i) => i.uid === uid);
            if (targetIndex !== -1 && typeof targetIndex === 'number') {
                const tmp = [...selectedLesson];
                tmp.splice(targetIndex, 1);
                setSelectedLesson(tmp);
                setLessons(tmp.map((i) => ({ lesson_uid: i.uid })));
            }
        },
        [selectedLesson]
    );

    useEffect(() => {
        if (lessons) {
            setSelectedLesson(
                lessons.map((i) => ({
                    id: i.id,
                    title: i.title,
                    uid: i.uid,
                }))
            );
        }
    }, [lessons]);

    return (
        <>
            <div
                className={`${
                    (selectedLesson.length && 'mb-ooolab_m_4') || ''
                }`}
            >
                {selectedLesson.map((i, index) => (
                    <RenderSelectedLesson
                        key={i.uid}
                        data={i}
                        index={index}
                        moveCard={handleMoveSelectedLesson}
                        onRemove={handleRemoveSelectedLesson}
                    />
                ))}
            </div>
            <div className="border border-dashed rounded-sub_tab py-ooolab_p_3 flex items-center justify-center hover:border-ooolab_blue_1 group">
                <button
                    onClick={() => setOpenModal(true)}
                    className="px-ooolab_p_3 py-ooolab_p_1_e border-none inline-flex items-center bg-ooolab_light_blue_0 text-ooolab_dark_1 rounded-lg focus:outline-none group-hover:text-ooolab_blue_1"
                >
                    <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                    <span>{translator('COURSES.ADD_LESSON')}</span>
                </button>
            </div>
            <AddLessonModal
                open={openModal}
                onCloseModal={() => setOpenModal(false)}
                onSubmit={handleAddLesson}
                selectedLessonParams={selectedLessonParams}
            />
        </>
    );
};

export default EditLesson;
