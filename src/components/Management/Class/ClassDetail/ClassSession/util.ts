import classService from 'services/class.service';
import { IClassSessionParams, IClassSessionState } from 'types/Class.type';

export type EditStateType = Record<
    number,
    {
        start_time: string;
        end_time: string;
        index: number;
    }
>;

export const ACTIONS = {
    SET_NEW_RECORD: 'SET_NEW_RECORD',
    SET_NEW_START_RECORD: 'SET_NEW_START_RECORD',
    SET_NEW_END_RECORD: 'SET_NEW_END_RECORD',
    RESET: 'RESET',
};

export const initSessionState: IClassSessionParams = {
    page: 1,
    per_page: 20,
};

export const updateSession = async (
    workspaceId: string,
    classId: string,
    sessionId: string,
    param: {
        start_time: string;
        end_time: string;
    }
): Promise<string> => {
    const result = await classService.updateSessions(
        workspaceId,
        classId,
        sessionId,
        param
    );
    return result;
};

export async function sequentialMap<V, R, T>(
    arr: V[],
    fn: (v: V, t: T) => Promise<R>,
    wpId: T
): Promise<R[]> {
    const result: R[] = [];
    for (const value of arr) {
        result.push(await fn(value, wpId));
    }
    return result;
}

export type ActionType = {
    type: string;
    value: {
        id: number;
        start_time?: string;
        end_time?: string;
        index?: number;
    };
};

export const editStateReducer = (
    state: EditStateType,
    dispatch: ActionType
): EditStateType => {
    const { type, value } = dispatch;
    const { id, start_time, end_time, index } = value;
    switch (type) {
        case ACTIONS.SET_NEW_START_RECORD:
            return {
                ...state,
                [id]: {
                    ...state[id],
                    start_time,
                    index,
                },
            };
        case ACTIONS.SET_NEW_END_RECORD:
            console.log(end_time);
            return {
                ...state,
                [id]: {
                    ...state[id],
                    end_time,
                    index,
                },
            };
        case ACTIONS.RESET:
            return {};

        default:
            break;
    }

    return state;
};
