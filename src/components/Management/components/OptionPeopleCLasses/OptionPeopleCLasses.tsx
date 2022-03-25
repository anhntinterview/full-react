/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import {
    CheckIcon,
    ExclamationCircleIcon,
    TrashIcon,
} from '@heroicons/react/outline';
import { REMOVE_USER_CLASSES } from 'constant/modal.const';
import TheSecondCommonModal from 'components/CommonModals/TheSecondCommonModal';
import { useTranslation } from 'react-i18next';
import { ModalPropTypes } from 'types/Modal.type';
import { MemberClasses } from 'types/Class.type';
import classService from 'services/class.service';
import { errorNoti, successNoti } from 'components/H5P/H5PFN';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const iconStyle = 'w-ooolab_w_4 h-ooolab_w_4 text-ooolab_dark_2';

interface OptionPeopleCLassesInterface {
    itemOptions: MemberClasses;
    typeUser: 'teacher' | 'student';
}

const OptionPeopleCLasses: React.FC<OptionPeopleCLassesInterface> = ({
    itemOptions,
    typeUser,
}) => {
    const { t: translator } = useTranslation();
    const params: { id: string; classId: string } = useParams();
    const { dispatch: dispatchWorkspace } = useContext(GetWorkspaceContext);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<ModalPropTypes>();
    const onDelete = () => {
        workspaceMiddleware.removeUserClasses(
            dispatchWorkspace,
            params.id,
            params.classId,
            itemOptions.membership?.id,
            typeUser
        );
    };

    async function onDeleteUserClasses() {
        setIsModal(true);
        const modalProps: ModalPropTypes = {
            component: REMOVE_USER_CLASSES(translator),
            onFetch: onDelete,
        };
        await setModalProps(modalProps);
    }

    const MenuList = [
        {
            name: translator('CLASSES.REMOVE'),
            icons: <TrashIcon className={iconStyle} />,
            function: () => onDeleteUserClasses(),
            isDisplay: true,
        },
    ];

    return (
        <>
            <Menu as="div" className="inline-block text-left mr-ooolab_m_1">
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
                            <Menu.Items className="z-9999 shadow-ooolab_box_shadow_container origin-top-right absolute right-ooolab_inset_12 top-0  w-ooolab_w_36 rounded-header_menu divide-y divide-gray-100 focus:outline-none">
                                <div className="py-ooolab_p_1">
                                    {MenuList.map((i) => {
                                        return (
                                            <Menu.Item key={i.name}>
                                                {({}) => (
                                                    <div
                                                        onClick={(e) => {
                                                            if (i.function) {
                                                                i.function();
                                                            }
                                                        }}
                                                        className={`flex  px-ooolab_p_2 w-full bg-white hover:bg-ooolab_bg_sub_tab_hover cursor-pointer ${
                                                            !i.isDisplay &&
                                                            'hidden'
                                                        } `}
                                                    >
                                                        {i.icons}
                                                        <a
                                                            className={classNames(
                                                                'block px-ooolab_p_4 py-ooolab_p_1 text-ooolab_sm'
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
                        <TheSecondCommonModal
                            isModal={isModal}
                            setIsModal={setIsModal}
                            modalProps={modalProps}
                        />
                    </>
                )}
            </Menu>
        </>
    );
};

export default OptionPeopleCLasses;
