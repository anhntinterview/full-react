import { HomeIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import googleService from 'services/google.service';

import FolderColor from 'assets/SVG/folder_color.svg';

import { useTranslation } from 'react-i18next';

const WorkspaceDriveBreadCrumb = ({
    id,
    openPicker,
}: {
    id: string;
    openPicker: Function;
}) => {
    const { t: translator } = useTranslation();
    const [pages, setPages] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const getAndSetId = async () => {
        setLoading(true);
        let hasParents = true;
        const tempBreadCrumb = [];
        do {
            const res = await googleService.getGoogleDriveFile(id);
            if (!res) return { tempBreadCrumb };
            if (res?.parents && res.parents?.length) {
                id = res.parents[0];
                const item = {
                    id: res.id,
                    name: res.name,
                };
                tempBreadCrumb.unshift(item);
            } else {
                tempBreadCrumb.unshift({
                    id: res?.id,
                    name: res.name,
                });
                hasParents = false;
            }
        } while (hasParents);
        setPages(tempBreadCrumb);
        setLoading(false);
    };

    useEffect(() => {
        if (id) getAndSetId();
    }, [id]);

    return (
        <div className="lg:flex md:flex justify-between items-center text-black">
            <nav
                className="flex items-center text-ooolab_base "
                aria-label="Breadcrumb"
            >
                <ol role="list" className="flex items-center">
                    <li>
                        <p
                            className={`inline-flex items-center ${
                                loading && 'animate-pulse'
                            }`}
                        >
                            <img src={FolderColor} alt="" />
                            <span className="ml-ooolab_m_1">
                                {translator(
                                    'DASHBOARD.WORKSPACE_SETTING.ALL_FILES'
                                )}
                            </span>
                        </p>
                    </li>
                    {pages.map((page) => (
                        <li key={page.name}>
                            <div className="flex items-center">
                                <ChevronRightIcon
                                    className="flex-shrink-0 h-5 w-5"
                                    aria-hidden="true"
                                />
                                <a
                                    className="ml-4 text-sm font-medium"
                                    aria-current={page ? 'page' : undefined}
                                >
                                    {page.name}
                                </a>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
            <button
                onClick={() => openPicker()}
                type="button"
                className="border-none focus:outline-none text-ooolab_blue_1"
            >
                {translator('DASHBOARD.WORKSPACE_SETTING.CHANGE_FOLDER')}
            </button>
        </div>
    );
};

export default WorkspaceDriveBreadCrumb;
