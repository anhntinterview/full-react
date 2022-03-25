import { Tab } from '@headlessui/react';
import { useContext, useEffect } from 'react';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import GroupProfileForm from './GroupProfileForm';
import workspaceMiddleware from 'middleware/workspace.middleware';

const listTab = ['Profile', 'Calendar', 'Students', 'Teachers', 'Classrooms'];

const GroupDetail = () => {
    const { dispatch: workspaceDispatch } = useContext(GetWorkspaceContext);

    useEffect(() => {
        workspaceMiddleware.setCurrentRouteDetail(workspaceDispatch, [
            {
                name: 'D7 PMH',
                routeId: 'groupId',
            },
        ]);
    }, []);

    return (
        <Tab.Group>
            <Tab.List className="w-full min-h-ooolab_h_18 text-ooolab_xs p-ooolab_p_5 grid grid-cols-7 items-center border-b border-ooolab_bar_color">
                {listTab.map((i) => (
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
                <div className="col-span-1 text-ooolab_dark_2 font-semibold">
                    Group Id:{' '}
                    <span className="bg-ooolab_light_100 text-ooolab_dark_1 px-ooolab_p_2 py-ooolab_p_1">
                        S0123456789
                    </span>
                </div>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel>
                    <GroupProfileForm />
                </Tab.Panel>
                <Tab.Panel></Tab.Panel>
                <Tab.Panel></Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
};

export default GroupDetail;
