import {
    Fragment,
    useCallback,
    FC,
    useState,
    useRef,
    useEffect,
    useContext,
} from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Transition, Popover } from '@headlessui/react';

import AdminCheckBox from './AdminCheckBox';

import { CheckboxType } from 'types/Lesson.type';
import { WorkspaceService } from 'services';
import { FORM_FIlTER } from 'constant/form.const';
import { GetWorkspaceAdminContext } from 'contexts/Workspace/WorkspaceContext';
import { ParamsAdmin } from 'types/AdminWorkspace.type';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

const AdminFilter: React.FC = () => {
    const { t: translator } = useTranslation();
    const paramsUrl: { id: string } = useParams();
    const [listContentType, setlistContentType] = useState<CheckboxType[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<CheckboxType[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<CheckboxType[]>([]);
    const {
        getWorkspaceAdminState: { params },
        dispatch,
    } = useContext(GetWorkspaceAdminContext);
    const handleMembers = async (e?: string) => {
        const res = await WorkspaceService.getWorkspaceMembers(
            {
                id: paramsUrl.id,
            },
            {
                q: e,
            }
        );
        const result = await res;
        if (result && result.items) {
            const tmpSelectedAuthor = [...selectedAuthor];
            const listSelectedAuthor: (
                | string
                | number
            )[] = tmpSelectedAuthor.map((i) => i.id);
            const tmp = result.items.map((i: any) => {
                return {
                    name: i.display_name,
                    id: i.id,
                    check:
                        (listSelectedAuthor.length &&
                            listSelectedAuthor.includes(`${i.id}`)) ||
                        false,
                };
            });
            if (!e) {
                selectedAuthor
                    .filter((j) => !listSelectedAuthor.includes(j.id))
                    .forEach((i) => {
                        tmp.unshift({
                            name: i.name,
                            check: i.check,
                            id: i.id,
                        });
                    });
            }
            setSelectedAuthor(tmp);
        } else setSelectedAuthor([]);
    };

    const debounceInput = useCallback(
        debounce((nextValue: string, asyncFunction: (e: string) => void) => {
            asyncFunction(nextValue);
        }, 1000),
        []
    );

    useEffect(() => {
        Object.keys(FORM_FIlTER.typeFilter).forEach((d, i) => {
            const type = {
                check: false,
                id: i,
                name: d,
            };
            setlistContentType((pre) => [...pre, type]);
        });
        Object.keys(FORM_FIlTER.statusType).forEach((d, i) => {
            const type = {
                check: false,
                id: i,
                name: d,
            };
            setSelectedStatus((pre) => [...pre, type]);
        });
        handleMembers();
    }, []);

    const { getValues, handleSubmit, register } = useForm();

    const submit = () => {
        const values = getValues();
        const listCheckedType: string[] = [];
        const listCheckedStatus: string[] = [];
        const listCheckedAuthor: string[] = [];
        Object.keys(values.Authors).forEach((i) => {
            if (values.Authors[i]) {
                if (i !== 'all') {
                    const arr = i.split('-');
                    const id = arr.shift() || '';
                    listCheckedAuthor.push(`${id}`);
                }
            }
        });
        // Object.keys(values.Status).forEach((i) => {
        //     if (values.Status[i]) {
        //         if (i !== 'all') {
        //             const arr = i.split('-');
        //             listCheckedStatus.push(`${arr[1].toLowerCase()}`);
        //         }
        //     }
        // });
        Object.keys(values.Type).forEach((i) => {
            if (values.Type[i]) {
                if (i !== 'all') {
                    const arr = i.split('-');
                    listCheckedType.push(`${arr[1].toLowerCase()}`);
                }
            }
        });

        const search: ParamsAdmin = {
            ...params,
            status: 'pending',
            type: listCheckedType.join(','),
            created_by: listCheckedAuthor.join(','),
        };
        workspaceMiddleware.getAdminList(dispatch, paramsUrl.id, search);
    };

    return (
        <Popover as="div" className="relative inline-block">
            {({ open }) => (
                <>
                    <Popover.Button
                        as="button"
                        className={`flex border justify-center items-center focus:outline-none  rounded-md border-none`}
                    >
                        <div className="flex items-center bg-ooolab_bg_bar px-ooolab_p_3 py-ooolab_p_2 rounded-lg text-ooolab_blue_1 text-ooolab_base focus:outline-none">
                            <span className="bg-img-item-filter bg-no-repeat bg-contain w-ooolab_w_6 h-ooolab_h_6 mr-ooolab_m_2 "></span>
                            <span>
                                {translator('DASHBOARD.ADMIN_APPROVAL.FILTER')}
                            </span>
                        </div>
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
                            className="z-9999 min-w-ooolab_w_56 p-ooolab_p_5 bg-white shadow-ooolab_box_shadow_container origin-top-right absolute right-0 mt-2 rounded-header_menu focus:outline-none"
                        >
                            {({ close }) => (
                                <>
                                    <span className="text-ooolab_dark_1 text-ooolab_base font-medium">
                                        {translator(
                                            'DASHBOARD.ADMIN_APPROVAL.FILTER'
                                        )}{' '}
                                        /{' '}
                                        <span className="text-ooolab_blue_3">
                                            {' '}
                                            {translator(
                                                'DASHBOARD.WORKSPACE_SETTING.ALL_FILES'
                                            )}
                                        </span>
                                    </span>
                                    <form onSubmit={handleSubmit(submit)}>
                                        <div className="flex mt-ooolab_m_4">
                                            <div className="min-w-ooolab_w_56 mr-ooolab_m_1">
                                                <AdminCheckBox
                                                    title="Type"
                                                    listCheckBox={
                                                        listContentType
                                                    }
                                                    register={register}
                                                    placeholder={translator(
                                                        'DASHBOARD.ADMIN_APPROVAL.SEARCH_TYPE'
                                                    )}
                                                    getValues={getValues}
                                                />
                                            </div>
                                            <div className="min-w-ooolab_w_56 mr-ooolab_m_1">
                                                <AdminCheckBox
                                                    title="Authors"
                                                    listCheckBox={
                                                        selectedAuthor
                                                    }
                                                    register={register}
                                                    placeholder={translator(
                                                        'DASHBOARD.ADMIN_APPROVAL.SEARCH_AUTHOR'
                                                    )}
                                                    getValues={getValues}
                                                    onSearch={(e) =>
                                                        debounceInput(
                                                            e,
                                                            handleMembers
                                                        )
                                                    }
                                                />
                                            </div>
                                            {/* <div className="min-w-ooolab_w_56 mr-ooolab_m_1">
                                                <AdminCheckBox
                                                    title="Status"
                                                    listCheckBox={
                                                        selectedStatus
                                                    }
                                                    register={register}
                                                    placeholder="Search Status"
                                                />
                                            </div> */}
                                        </div>

                                        <div className="pt-ooolab_p_3 text-right">
                                            <button
                                                onClick={() => {
                                                    handleSubmit(submit);
                                                    setTimeout(
                                                        () => close(),
                                                        500
                                                    );
                                                }}
                                                className="bg-ooolab_blue_1 text-white px-ooolab_p_3 py-ooolab_p_1 rounded-lg focus:outline-none"
                                            >
                                                {translator(
                                                    'DASHBOARD.ADMIN_APPROVAL.APPLY'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default AdminFilter;
