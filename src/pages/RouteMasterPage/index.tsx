import { ChevronRightIcon } from '@heroicons/react/outline';
import UserDetailMenu from 'components/MainNav/UserDetailMenu';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import lodash from 'lodash';
import { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ManagementMasterPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    fetchtingRouteId?: string[];
}

const ManagementMasterPage: React.FC<ManagementMasterPageProps> = ({
    children,
    setAuthStorage,
}) => {
    const history = useHistory();
    const { t: translator } = useTranslation();

    const params: { id: string } = useParams();
    const { url, path } = useRouteMatch();
    const [breadCrumbState, setBreadCrumbState] = useState<
        { name: string; path: string; isLoading: boolean; id?: string }[]
    >(() => {
        let prevAdmin = false;
        if (history.location?.state) {
            const historyState: any = history.location.state;
            if (historyState?.prevPath) {
                if (historyState?.prevPath.split('/')[3] === 'admin') {
                    prevAdmin = true;
                }
            }
        }
        const workspaceIdIndex = url
            .split('/')
            .findIndex((i) => i === `${params.id}`);

        const splittedUrl = url.split('/').slice(workspaceIdIndex);
        splittedUrl.shift(); //remove / from url

        const pathSplitted = path.split('/').slice(workspaceIdIndex);
        pathSplitted.shift(); //remove / from path

        const mergePathWithURL = splittedUrl.map((i, index) => {
            if (pathSplitted[index]) {
                const hasRouteParam = pathSplitted[index].includes(':');
                const pathOfBreadCrumb = url
                    .split('/')
                    .slice(0, index + workspaceIdIndex + 2)
                    .join('/');
                const hasCourseIssue =
                    pathOfBreadCrumb.split('/').reverse()[0] === 'course';
                return {
                    id: hasRouteParam ? pathSplitted[index].slice(1) : '', //id in route
                    name: hasCourseIssue
                        ? 'Courses'
                        : lodash.startCase(i.split('-').join(' ')),
                    path: hasCourseIssue
                        ? pathOfBreadCrumb.replace('course', 'courses')
                        : pathOfBreadCrumb,
                };
            }
        });
        if (splittedUrl.length) {
            if (workspaceIdIndex) {
                const tmpBreadCrumbState = [];
                mergePathWithURL.forEach((i) => {
                    if (i) {
                        tmpBreadCrumbState.push({
                            name: i.name,
                            path: i.path,
                            isLoading: !!i.id,
                            id: i.id,
                        });
                    }
                });
                if (prevAdmin) {
                    tmpBreadCrumbState[0] = {
                        name: translator('BREADCRUMB.ADMIN'),
                        path: `/workspace/${params.id}/admin`,
                        isLoading: false,
                        id: '',
                    };
                }

                return tmpBreadCrumbState;
            }
        }
        return [];
    });

    const {
        getWorkspaceDetailState: { currentRouteDetail },
    } = useContext(GetWorkspaceContext);

    useEffect(() => {
        if (currentRouteDetail.length) {
            const tmpBreadCrumbState = [...breadCrumbState];
            const newState = tmpBreadCrumbState.map((i) => {
                if (!i.isLoading) {
                    return i;
                }
                const item = currentRouteDetail.find((j) => j.routeId === i.id);
                return {
                    ...i,
                    isLoading: false,
                    name: item ? item.name : i.name,
                };
            });
            setTimeout(() => setBreadCrumbState(newState), 500);
        }
    }, [currentRouteDetail]);

    const handleTranslate = (t: string) => {
        let text = t;
        switch (t) {
            case 'H 5 P Content':
                text = translator('BREADCRUMB.H5P');
                break;
            case 'Admin':
                text = translator('BREADCRUMB.ADMIN');
                break;
            case 'Courses':
                text = translator('BREADCRUMB.COURSE');
                break;
            case 'Lesson':
                text = translator('BREADCRUMB.LESSON');
                break;
            case 'Trash':
                text = translator('BREADCRUMB.TRASH');
                break;
            case 'Management':
                text = translator('BREADCRUMB.MANAGEMENT');
                break;
            case 'Class':
                text = translator('BREADCRUMB.CLASS');
                break;
            default:
                break;
        }

        return text;
    };

    return (
        <>
            <div className="w-full h-ooolab_h_12 flex items-center justify-between px-ooolab_p_4 ">
                <p className="flex items-center text-ooolab_sm font-semibold text-ooolab_dark_1">
                    {/* <span>Management</span>
                    <span>Groups</span> */}
                    {breadCrumbState.map((i, index) =>
                        i.isLoading ? (
                            <span
                                key={`${i.name}-${index}-breadcrumb-loading`}
                                className="w-ooolab_w_14 h-ooolab_h_3 bg-ooolab_dark_50 opacity-70 animate-pulse"
                            ></span>
                        ) : (
                            <span
                                style={{ maxWidth: 650 }}
                                className="flex items-center "
                                key={`${i.name}-${index}-breadcrumb-name`}
                            >
                                {i.name !== 'Management' ? (
                                    <Link
                                        className="overflow-ellipsis whitespace-nowrap overflow-hidden"
                                        to={i.path}
                                    >
                                        {handleTranslate(i.name)}
                                    </Link>
                                ) : (
                                    <p className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                                        {handleTranslate(i.name)}
                                    </p>
                                )}

                                {(index < breadCrumbState.length - 1 && (
                                    <ChevronRightIcon className="w-ooolab_w_3 h-ooolab_h_3 mx-ooolab_m_3" />
                                )) ||
                                    null}
                            </span>
                        )
                    )}
                </p>
                <div className="flex items-center">
                    {/* <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-ooolab_m_5"
                    >
                        <g opacity="0.4">
                            <path
                                d="M11.1175 3.33268C10.9287 3.86804 10.8326 4.43168 10.8333 4.99935H4.16667V16.666H15.8333V9.99935C16.401 10.0001 16.9646 9.90399 17.5 9.71518V17.4993C17.5 17.7204 17.4122 17.9323 17.2559 18.0886C17.0996 18.2449 16.8877 18.3327 16.6667 18.3327H3.33333C3.11232 18.3327 2.90036 18.2449 2.74408 18.0886C2.5878 17.9323 2.5 17.7204 2.5 17.4993V4.16602C2.5 3.945 2.5878 3.73304 2.74408 3.57676C2.90036 3.42048 3.11232 3.33268 3.33333 3.33268H11.1175ZM15.8333 6.66602C16.2754 6.66602 16.6993 6.49042 17.0118 6.17786C17.3244 5.8653 17.5 5.44138 17.5 4.99935C17.5 4.55732 17.3244 4.1334 17.0118 3.82084C16.6993 3.50828 16.2754 3.33268 15.8333 3.33268C15.3913 3.33268 14.9674 3.50828 14.6548 3.82084C14.3423 4.1334 14.1667 4.55732 14.1667 4.99935C14.1667 5.44138 14.3423 5.8653 14.6548 6.17786C14.9674 6.49042 15.3913 6.66602 15.8333 6.66602V6.66602ZM15.8333 8.33268C14.9493 8.33268 14.1014 7.98149 13.4763 7.35637C12.8512 6.73125 12.5 5.8834 12.5 4.99935C12.5 4.11529 12.8512 3.26745 13.4763 2.64233C14.1014 2.01721 14.9493 1.66602 15.8333 1.66602C16.7174 1.66602 17.5652 2.01721 18.1904 2.64233C18.8155 3.26745 19.1667 4.11529 19.1667 4.99935C19.1667 5.8834 18.8155 6.73125 18.1904 7.35637C17.5652 7.98149 16.7174 8.33268 15.8333 8.33268Z"
                                fill="#2E3A59"
                            />
                        </g>
                    </svg> */}
                    {/* <img
                        className="w-ooolab_w_7_n h-ooolab_h_7 rounded-full bg-yellow-300"
                        src={avatar_url}
                    /> */}
                    {/* <div className="p-ooolab_p_3 mt-ooolab_m_3 ">
                        <UserDetailMenu setAuthStorage={setAuthStorage} />
                    </div> */}
                </div>
            </div>
            {/* <div className="h-ooolab_h_below_15 overflow-hidden">
                {children}
            </div> */}
        </>
    );
};

export default ManagementMasterPage;
