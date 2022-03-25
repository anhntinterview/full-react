import { Popover, RadioGroup, Transition } from '@headlessui/react';
import { FC, Fragment, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import workspaceMiddleware from 'middleware/workspace.middleware';
import { CheckIcon, DotsVerticalIcon, XIcon } from '@heroicons/react/outline';
import CancelChanges from 'assets/SVG/cancel.svg';
import Modal from 'components/Modal';
import { WORKSPACE_SETTING_REMOVE_MEMBER } from 'constant/modal.const';
import { useTranslation } from 'react-i18next';

interface MemberOptionsProps {
    role: string;
    id: string;
    onRemove: (id: string, role: string) => void;
    onChangeRole: (id: string, role: string) => void;
    canRemove: boolean;
}

const MemberOptions: FC<MemberOptionsProps> = ({
    role,
    id,
    onRemove,
    onChangeRole,
    canRemove,
}) => {
    const { t: translator } = useTranslation();
    const params: { id: string; courseId: string } = useParams();
    const [plan, setPlan] = useState(role);
    const [modalRemove, setModalRemove] = useState(false);

    return (
        <>
            <Modal
                imgSrc={CancelChanges}
                title={translator(
                    'MODALS.WORKSPACE_SETTING_REMOVE_MEMBER.CONFIRM_REMOVE'
                )}
                contentText={translator(
                    'MODALS.WORKSPACE_SETTING_REMOVE_MEMBER.CONTENT_TEXT'
                )}
                isOpen={modalRemove}
                onClose={() => setModalRemove(false)}
                mainBtn={
                    <button
                        onClick={() => {
                            onRemove(id, role);
                            setTimeout(() => setModalRemove(false), 600);
                        }}
                        className="bg-ooolab_blue_1 text-white text-ooolab_sm px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none"
                    >
                        {translator('MODALS.CONFIRM')}
                    </button>
                }
                subBtn={
                    <button
                        onClick={() => setModalRemove(false)}
                        className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        {translator('MODALS.NO_CANCEL')}
                    </button>
                }
            />
            <Popover
                as="div"
                className="relative inline-block text-ooolab_xs font-normal"
            >
                {({ open, close }) => (
                    <>
                        <Popover.Button as="span">
                            <DotsVerticalIcon className=" right-ooolab_inset_12px top-5 w-ooolab_w_6 h-ooolab_h_6 p-ooolab_p_1 rounded-full bg-white cursor-pointer" />
                        </Popover.Button>

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
                            <Popover.Panel
                                unmount
                                className="z-9999 bg-white shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 w-ooolab_w_50 rounded-lg overflow-hidden divide-y divide-gray-100 focus:outline-none"
                            >
                                <div className="w-full py-ooolab_p_2 border-b">
                                    <RadioGroup value={plan} onChange={setPlan}>
                                        <RadioGroup.Option value="admin">
                                            {({ checked }) => (
                                                <span
                                                    onClick={() => {
                                                        if (!checked) {
                                                            onChangeRole(
                                                                id,
                                                                'admin'
                                                            );
                                                        }
                                                        close();
                                                    }}
                                                    className={` w-full py-ooolab_p_1 inline-flex items-center text-ooolab_sm px-ooolab_p_3 hover:bg-ooolab_blue_0`}
                                                >
                                                    <CheckIcon
                                                        className={`${
                                                            (checked &&
                                                                'opacity-100') ||
                                                            'opacity-0'
                                                        } w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2 text-ooolab_dark_2`}
                                                    />
                                                    {translator('ADMIN')}
                                                </span>
                                            )}
                                        </RadioGroup.Option>
                                        <RadioGroup.Option value="member">
                                            {({ checked }) => (
                                                <span
                                                    onClick={() => {
                                                        if (!checked) {
                                                            onChangeRole(
                                                                id,
                                                                'member'
                                                            );
                                                        }
                                                        close();
                                                    }}
                                                    className={` w-full py-ooolab_p_1 inline-flex items-center text-ooolab_sm px-ooolab_p_3 hover:bg-ooolab_blue_0`}
                                                >
                                                    <CheckIcon
                                                        className={`${
                                                            (checked &&
                                                                'opacity-100') ||
                                                            'opacity-0'
                                                        } w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2 text-ooolab_dark_2`}
                                                    />
                                                    {translator('MEMBERS')}
                                                </span>
                                            )}
                                        </RadioGroup.Option>
                                    </RadioGroup>
                                </div>
                                {(canRemove && (
                                    <div className="w-full py-ooolab_p_2 border-b">
                                        <span
                                            onClick={() => setModalRemove(true)}
                                            className="w-full py-ooolab_p_1 inline-flex items-center text-ooolab_sm px-ooolab_p_3 hover:bg-ooolab_blue_0"
                                        >
                                            <XIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2 text-ooolab_dark_2" />
                                            {translator('REMOVE')}
                                        </span>
                                    </div>
                                )) ||
                                    null}
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </>
    );
};

export default MemberOptions;
