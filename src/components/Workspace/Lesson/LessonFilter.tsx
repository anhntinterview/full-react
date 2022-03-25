import { useContext, FC } from 'react';
import { PlusIcon } from '@heroicons/react/outline';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

import { LessonFilterMenu, FilterButton } from './components/LessonFilter';
import { CheckboxType } from 'types/Lesson.type';

const mockStatus = [
    {
        text: 'All Lesson',
        props: {
            active: true,
        },
    },
    {
        text: 'My lesson',
    },
    {
        text: 'Starters',
    },
    {
        text: 'New View',
        props: {
            icon: (
                <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2" />
            ),
        },
    },
];

interface Props {
    selectedTag: CheckboxType[];
    selectedAuthor: CheckboxType[];
    setFilterMenu: (tags: CheckboxType[], authors: CheckboxType[]) => void;
}

const LessonFilterBar: FC<Props> = ({
    selectedTag,
    setFilterMenu,
    selectedAuthor,
}) => {
    return (
        <div className="flex justify-between items-center mb-ooolab_m_2 ">
            <div className="flex">
                {/* {mockStatus.map((i) => (
                    <FilterButton key={i.text} text={i.text} {...i?.props} />
                ))} */}
            </div>
            <div style={{ minHeight: 32 }} className="flex items-center">
                <LessonFilterMenu
                    selectedTag={selectedTag}
                    selectedAuthor={selectedAuthor}
                    setFilterMenu={setFilterMenu}
                />
            </div>
        </div>
    );
};

export default LessonFilterBar;
