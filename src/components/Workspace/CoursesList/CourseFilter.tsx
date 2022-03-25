import { Fragment, useState, useCallback, FC } from 'react';
import { useParams } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';

import SearchAndCheckBox from '../Lesson/components/LessonFilter/LessonFilterMenu/SearchAndCheckbox';
import { CheckboxType } from 'types/Lesson.type';
import { WorkspaceService } from 'services';
import lodash, { debounce, toInteger } from 'lodash';
import { RefreshIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

interface Props {
    selectedTag: CheckboxType[];
    selectedAuthor: CheckboxType[];
    submitFilter: ({
        tags,
        authors,
    }: {
        tags: CheckboxType[];
        authors: CheckboxType[];
    }) => void;
}

const CourseFilter: FC<Props> = ({
    selectedAuthor = [],
    selectedTag = [],
    submitFilter,
}) => {
    const { register, handleSubmit, getValues, reset, setValue } = useForm();
    const [listTags, setListTags] = useState<CheckboxType[]>([]);
    const [listAuthors, setListAuthors] = useState<CheckboxType[]>([]);
    const params: { id: string } = useParams();
    const { t: translator } = useTranslation();

    const debounceInput = useCallback(
        debounce((nextValue: string, asyncFunction: (e: string) => void) => {
            asyncFunction(nextValue);
        }, 1000),
        []
    );
    const handleTag = (e?: string) => {
        WorkspaceService.getLessonTags(params.id, e)
            .then((res) => {
                if (res && res.items) {
                    const values = getValues();
                    const listCheckedTags: CheckboxType[] = [];
                    if (values.Tags) {
                        Object.keys(values.Tags).forEach((i) => {
                            if (values.Tags[i]) {
                                const arr = i.split('-');
                                const id = arr.shift() || '';
                                const name = arr.join(' ');
                                listCheckedTags.push({ id, name, check: true });
                            }
                        });
                    }
                    const tmpSelectedTag = [...selectedTag, ...listCheckedTags];
                    const listSelectedTag: (string | number)[] = Array.from(
                        new Set(tmpSelectedTag.map((i) => i.id))
                    );

                    const tmp: CheckboxType[] = [
                        ...tmpSelectedTag,
                        ...res.items.map((i) => {
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
                        }),
                    ];

                    setListTags(
                        lodash
                            .uniqBy(tmp, (e) => toInteger(e.id))
                            .sort((a, b) => {
                                if (a.check && !b.check) return -1;
                                if (!a.check && b.check) return 2;
                                return 0;
                            })
                    );
                } else setListTags([]);
            })
            .catch(() => setListTags([]));
    };

    const handleGetAuthors = async (e?: string) => {
        const res = await WorkspaceService.getWorkspaceMembers(
            {
                id: params.id,
            },
            {
                q: e,
            }
        );
        if (res && res.items) {
            const values = getValues();
            const listCheckedAuthor: CheckboxType[] = [];
            if (values.Authors) {
                Object.keys(values.Authors).forEach((i) => {
                    if (values.Authors[i]) {
                        const arr = i.split('-');
                        const id = arr.shift() || '';
                        const name = arr.join(' ');
                        listCheckedAuthor.push({ id, name, check: true });
                    }
                });
            }
            const tmpSelectedAuthor: CheckboxType[] = [
                ...selectedAuthor,
                ...listCheckedAuthor,
            ];
            const listSelectedAuthor: (
                | string
                | number
            )[] = tmpSelectedAuthor.map((i) => i.id);
            const tmp: CheckboxType[] = res.items.map((i: any) => {
                return {
                    name: i.display_name,
                    id: i.id,
                    check:
                        (listSelectedAuthor.length &&
                            listSelectedAuthor.includes(`${i.id}`)) ||
                        false,
                };
            });

            setListAuthors(
                lodash
                    .uniqBy(tmp, (e) => toInteger(e.id))
                    .sort((a, b) => {
                        if (a.check && !b.check) return -1;
                        if (!a.check && b.check) return 2;
                        return 0;
                    })
            );
        } else setListAuthors([]);
    };

    const submit = () => {
        const values = getValues();
        const listCheckedAuthor: CheckboxType[] = [];
        const listCheckedTags: CheckboxType[] = [];
        if (values.Authors) {
            Object.keys(values.Authors).forEach((i) => {
                if (values.Authors[i]) {
                    const arr = i.split('-');
                    const id = arr.shift() || '';
                    const name = arr.join(' ');
                    listCheckedAuthor.push({ id, name, check: true });
                }
            });
        }
        if (values.Tags) {
            Object.keys(values.Tags).forEach((i) => {
                if (values.Tags[i]) {
                    const arr = i.split('-');
                    const id = arr.shift() || '';
                    const name = arr.join(' ');
                    listCheckedTags.push({ id, name, check: true });
                }
            });
        }
        submitFilter({ tags: listCheckedTags, authors: listCheckedAuthor });
    };

    const resetListTags = () => setListTags([]);
    const resetListAuthors = () => setListAuthors([]);

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
                            <span>{translator('COURSES.FILTER')}</span>
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
                                    <div className="flex justify-between">
                                        <p className="mb-ooolab_m_5">Filter</p>
                                        {/* <RefreshIcon
                                            onClick={() => reset({})}
                                            className="w-ooolab_w_4 h-ooolab_h_4 cursor-pointer text-ooolab_dark_1 hover:animate-spin"
                                        /> */}
                                    </div>
                                    <form onSubmit={handleSubmit(submit)}>
                                        <div className="min-w-ooolab_w_56 mr-ooolab_m_1 mb-ooolab_m_5">
                                            <SearchAndCheckBox
                                                title={translator('TAGS')}
                                                placeholder="Search Author"
                                                onSearch={(e) =>
                                                    debounceInput(e, handleTag)
                                                }
                                                fetchData={handleTag}
                                                register={register}
                                                loading={false}
                                                listCheckBox={listTags}
                                                onUnmount={resetListTags}
                                            />
                                        </div>
                                        <div className="min-w-ooolab_w_56 mr-ooolab_m_1 mb-ooolab_m_5">
                                            <SearchAndCheckBox
                                                title={translator(
                                                    'COURSES.AUTHOR'
                                                )}
                                                onSearch={(e) =>
                                                    debounceInput(
                                                        e,
                                                        handleGetAuthors
                                                    )
                                                }
                                                fetchData={handleGetAuthors}
                                                register={register}
                                                loading={false}
                                                listCheckBox={listAuthors}
                                                onUnmount={resetListAuthors}
                                            />
                                        </div>
                                        <div className="pt-ooolab_p_3 text-right">
                                            <button
                                                onClick={(e) => {
                                                    setTimeout(
                                                        () => close(),
                                                        500
                                                    );
                                                }}
                                                className="bg-ooolab_blue_1 text-white px-ooolab_p_3 py-ooolab_p_1 rounded-lg focus:outline-none"
                                            >
                                                {translator('APPLY')}
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

export default CourseFilter;
