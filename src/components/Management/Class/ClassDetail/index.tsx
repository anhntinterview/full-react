import { Tab } from '@headlessui/react';
import { useContext, useEffect } from 'react';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import ClassroomProfileForm from './ClassProfileForm';
import workspaceMiddleware from 'middleware/workspace.middleware';
import ClassSession from './ClassSession';
import ClassPeople from './ClassPeople';
import { UserContext } from 'contexts/User/UserContext';
import userMiddleware from 'middleware/user.middleware';
import React from 'react';
import { useTranslation } from 'react-i18next';

// const listTab = ['Information', 'Calendar', 'Sessions', 'People'];
const listTab = (translator: Function) => {
    const type = [
        {
            name: translator('CLASSES.INFO'),
            hiddenWhenDeactivate: false,
        },
        {
            name: translator('CLASSES.CALENDAR'),
            hiddenWhenDeactivate: true,
        },
        {
            name: translator('CLASSES.SESSIONS'),
            hiddenWhenDeactivate: true,
        },
        {
            name: translator('CLASSES.PEOPLE'),
            hiddenWhenDeactivate: true,
        },
    ];
    return type;
};

const ClassDetail: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();

    const { dispatch: workspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const { detail } = getWorkspaceDetailState.class;

    const listClassDetailTab = React.useMemo(
        () =>
            listTab(translator)
                .filter(
                    (i) =>
                        detail?.status !== 'deactivate' ||
                        (detail?.status === 'deactivate' &&
                            i.hiddenWhenDeactivate === false)
                )
                .map((j) => j.name),
        [detail]
    );

    const { dispatch } = useContext(UserContext);

    useEffect(() => {
        userMiddleware.getUser(dispatch);
        return () => {
            workspaceMiddleware.setCurrentRouteDetail(workspaceDispatch, []);
        };
    }, []);

    return (
        <>
            <div className=" border-b border-ooolab_bar_color py-ooolab_p_2 px-ooolab_p_4">
                {children}
            </div>
            <div className="h-ooolab_h_below_15  relative w-full">
                <Tab.Group>
                    <Tab.List className="absolute top-0 left-0 bg-white opacity-100 z-2 w-full min-h-ooolab_h_18 text-ooolab_xs p-ooolab_p_5 grid grid-cols-7 items-center border-b border-ooolab_bar_color">
                        {listClassDetailTab.map((i) => (
                            <Tab
                                className={({ selected }) => {
                                    const tabClassName = `col-span-1 px-ooolab_p_7 py-ooolab_p_2 text-left font-semibold  ${
                                        selected
                                            ? 'text-ooolab_dark_1 bg-ooolab_light_100'
                                            : 'text-ooolab_dark_2'
                                    }`;
                                    return tabClassName;
                                }}
                            >
                                {i}
                            </Tab>
                        ))}
                        <div className="col-span-1"></div>
                        <div className="col-span-1"></div>
                        <div
                            className={`col-span-1 text-ooolab_dark_2 font-semibold ${
                                detail?.status === 'deactivate' ? 'hidden' : ''
                            }`}
                        >
                          {translator('CLASSES.CLASS_ID')}
                            <span className="bg-ooolab_light_100 text-ooolab_dark_1 px-ooolab_p_2 py-ooolab_p_1">
                                {detail?.id || ''}
                            </span>
                        </div>
                    </Tab.List>
                    <Tab.Panels className="custom-scrollbar z-1 px-ooolab_p_5 pt-ooolab_p_20 h-full overflow-y-scroll">
                        <Tab.Panel>
                            <ClassroomProfileForm />
                        </Tab.Panel>
                        <Tab.Panel></Tab.Panel>
                        <Tab.Panel className="h-full">
                            <ClassSession />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ClassPeople />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    );
};

export default ClassDetail;
