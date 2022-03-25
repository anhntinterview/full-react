// ACTIONS
import { RouteComponentProps } from 'react-router-dom';

export function handleSelectedWorkspace(
    setSelectedWorkspaceId: React.Dispatch<
        React.SetStateAction<string | undefined>
    >,
    history: RouteComponentProps['history'],
    e: any
) {
    setSelectedWorkspaceId(e.target.value);
    history.push(`/workspace/${e.target.value}`);
    // return (e: any) => {
    //     const { value } = e.target.value;
    //     setSelectedWorkspaceId(value);
    //     if (value !== 'Workspace') {
    //         return history.push(`/workspace/${value}`);
    //     }
    // };
}
