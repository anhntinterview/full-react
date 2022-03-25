import { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import {
    EyeIcon,
    PencilIcon,
    DocumentDuplicateIcon,
    FolderAddIcon,
    TagIcon,
    LinkIcon,
    AtSymbolIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import { handleRemoveLesson } from '../LessonFN';
import { useTranslation } from 'react-i18next';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2';

interface LessonOptionsInterface {
    id: string;
    workspace: string;
    dispatch: React.Dispatch<any>;
    canRemove: boolean;
}

const LessonOptions: React.FC<LessonOptionsInterface> = ({
    id,
    workspace,
    dispatch,
    canRemove,
}) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const MenuList = [
        {
            name: `${translator('LESSON.PREVIEW')}`,
            icons: <EyeIcon className={iconStyle} />,
            function: () =>
                history.push(`/workspace/${workspace}/lesson/${id}/preview`),
            isDisplay: true,
        },
        {
            name: `${translator('LESSON.EDIT')}`,
            icons: <PencilIcon className={iconStyle} />,
            function: () =>
                history.push(`/workspace/${workspace}/lesson/${id}`),
            isDisplay: true,
        },
        // {
        //     name: 'Duplicate',
        //     icons: <DocumentDuplicateIcon className={iconStyle} />,
        // },
        // {
        //     name: 'Move To Course',
        //     icons: <FolderAddIcon className={iconStyle} />,
        // },
        // {
        //     name: 'Tag As',
        //     icons: <TagIcon className={iconStyle} />,
        // },
        // {
        //     name: 'Get Link',
        //     icons: <LinkIcon className={iconStyle} />,
        // },
        // {
        //     name: 'Rename',
        //     icons: <AtSymbolIcon className={iconStyle} />,
        // },
        {
            name: `${translator('LESSON.DELETE')}`,
            icons: <TrashIcon className={iconStyle} />,
            function: () => handleRemoveLesson(dispatch, workspace, id),
            isDisplay: canRemove,
        },
    ];

    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
                <>
                    <div>
                        <Menu.Button className="flex justify-center items-center text-ooolab_dark_1 hover:bg-ooolab_bg_sub_tab_hover hover:text-white focus:outline-none w-ooolab_w_6 h-ooolab_h_6 rounded-full">
                            <DotsVerticalIcon
                                className="w-ooolab_w_4 h-ooolab_h_4"
                                aria-hidden="true"
                            />
                        </Menu.Button>
                    </div>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            // style={{
                            //     boxShadow:
                            //         '0px 0px 2px rgba(40, 41, 61, 0.04), 0px 4px 8px rgba(96, 97, 112, 0.16)',
                            // }}
                            className="z-9999 shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 w-ooolab_w_56 rounded-header_menu divide-y divide-gray-100 focus:outline-none"
                        >
                            <div className="py-1">
                                {/* <Menu.Item>
                                    {({}) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                'block px-4 py-2 text-sm',
                                                'hover:bg-item_bar_hover'
                                            )}
                                        >
                                            Edit
                                        </a>
                                    )}
                                </Menu.Item> */}
                                {MenuList.map((i) => {
                                    return (
                                        <Menu.Item key={i.name}>
                                            {({}) => (
                                                <div
                                                    onClick={() => {
                                                        if (i.function) {
                                                            i.function();
                                                        }
                                                    }}
                                                    className={`flex  px-ooolab_p_2 w-full bg-white hover:bg-ooolab_bg_sub_tab_hover cursor-pointer ${
                                                        i.isDisplay
                                                            ? ''
                                                            : 'hidden'
                                                    }`}
                                                >
                                                    {i.icons}
                                                    <a
                                                        className={classNames(
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        {i.name}
                                                    </a>
                                                </div>
                                            )}
                                        </Menu.Item>
                                    );
                                })}
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
};

export default LessonOptions;
