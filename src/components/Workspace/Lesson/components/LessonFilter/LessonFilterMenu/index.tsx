import { Fragment, useCallback, FC, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Transition, Popover } from '@headlessui/react';

import SearchAndCheckBox from './SearchAndCheckbox';
import { WorkspaceService } from 'services';
import { debounce, toInteger } from 'lodash';
import { CheckboxType } from 'types/Lesson.type';

interface Props {
    selectedTag: CheckboxType[];
    selectedAuthor: CheckboxType[];
    setFilterMenu: (tags: CheckboxType[], authors: CheckboxType[]) => void;
}

const FilterMenu: FC<Props> = ({
    selectedTag,
    setFilterMenu,
    selectedAuthor,
}) => {
    const params: { id: string } = useParams();
    const [listTags, setListTags] = useState<CheckboxType[]>([]);
    const [listMember, setListMember] = useState<CheckboxType[]>([]);

    const [loadingTag, setLoadingTag] = useState(false);
    const [loadingMember, setLoadingMember] = useState(false);

    const { getValues, handleSubmit, register } = useForm();
    const handleTag = useCallback(
        (e?: string) => {
            setLoadingTag(true);
            WorkspaceService.getLessonTags(params.id, e)
                .then((res) => {
                    if (res && res.items) {
                        const tmpSelectedTag = [...selectedTag];
                        const listSelectedTag: (string | number)[] = Array.from(
                            new Set(tmpSelectedTag.map((i) => i.id))
                        );
                        const tmp: CheckboxType[] = res.items.map((i) => {
                            const index = listSelectedTag.findIndex(
                                (id) => toInteger(id) === i.id
                            );
                            const check = index > -1;
                            if (index > -1) {
                                listSelectedTag.splice(index, 1);
                            }
                            return {
                                name: i.name,
                                id: i.id,
                                check,
                            };
                        });
                        if (!e && selectedTag.length) {
                            selectedTag
                                .filter((j) => listSelectedTag.includes(j.id))
                                .forEach((i) => {
                                    tmp.unshift({
                                        name: i.name,
                                        check: i.check,
                                        id: i.id,
                                    });
                                });
                        }
                        setListTags(tmp);
                    } else setListTags([]);
                })
                .catch(() => setListTags([]))
                .finally(() => setLoadingTag(false));
        },
        [params.id, selectedTag]
    );

    const handleMembers = async (e?: string) => {
        setLoadingMember(true);
        const res = await WorkspaceService.getWorkspaceMembers(
            {
                id: params.id,
            },
            {
                email: e,
            }
        );
        const result = await res?.json();
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
            setListMember(tmp);
        } else setListMember([]);
        setLoadingMember(false);
    };

    const debounceInputTag = useCallback(
        debounce((e: string) => {
            handleTag(e);
        }, 1000),
        []
    );
    const debounceInputMember = useCallback(
        debounce((e: string) => {
            handleMembers(e);
        }, 1000),
        []
    );

    const handleSearchMember = (e: string) => {
        debounceInputMember(e);
    };

    const handleSearchTag = (e: string) => {
        debounceInputTag(e);
    };

    const submit = () => {
        const values = getValues();
        const listCheckedAuthor: CheckboxType[] = [];
        const listCheckedTags: CheckboxType[] = [];
        Object.keys(values.Author).forEach((i) => {
            if (values.Author[i]) {
                const id = i.split('-')[0];
                const name = i.split('-')[1];
                const check = values.Author[i];
                listCheckedAuthor.push({ id, name, check });
            }
        });
        Object.keys(values.Tags).forEach((i) => {
            if (values.Tags[i]) {
                const id = i.split('-')[0];
                const name = i.split('-')[1];
                const check = values.Tags[i];
                listCheckedTags.push({ id, name, check });
            }
        });
        setFilterMenu(listCheckedTags, listCheckedAuthor);
    };

    const resetListTag = () => setListTags([]);
    const resetListAuthor = () => setListMember([]);

    return (
        <Popover as="div" className="relative inline-block">
            {({ open }) => (
                <>
                    <Popover.Button
                        as="button"
                        className={`flex border justify-center items-center focus:outline-none  rounded-md border-none`}
                    >
                        <div className="flex items-center bg-ooolab_bg_bar px-ooolab_p_3 py-ooolab_p_2 rounded-lg text-ooolab_blue_1 focus:outline-none">
                            <span className="bg-img-item-filter bg-no-repeat bg-contain w-ooolab_w_6 h-ooolab_h_6 mr-ooolab_m_2 "></span>
                            <span>Filter</span>
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
                                    <p className="mb-ooolab_m_5">Filter</p>
                                    <form onSubmit={handleSubmit(submit)}>
                                        <div className="flex">
                                            <div className="min-w-ooolab_w_56 mr-ooolab_m_1">
                                                <SearchAndCheckBox
                                                    title="Tags"
                                                    listCheckBox={listTags}
                                                    placeholder="Search Tags"
                                                    onSearch={handleSearchTag}
                                                    fetchData={handleTag}
                                                    register={register}
                                                    loading={loadingTag}
                                                    onUnmount={resetListTag}
                                                />
                                            </div>
                                            <div className="min-w-ooolab_w_56 mr-ooolab_m_1">
                                                <SearchAndCheckBox
                                                    title="Author"
                                                    listCheckBox={listMember}
                                                    placeholder="Search Author"
                                                    onSearch={
                                                        handleSearchMember
                                                    }
                                                    fetchData={handleMembers}
                                                    register={register}
                                                    loading={loadingMember}
                                                    onUnmount={resetListAuthor}
                                                />
                                            </div>
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
                                                Apply
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

export default FilterMenu;
