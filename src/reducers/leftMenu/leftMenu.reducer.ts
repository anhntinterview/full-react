import { SET_MENU_LEFT } from 'actions/leftmenu.action';
import { LeftMenuState, LeftMenunAction } from 'types/LeftMenu.type';

export function leftMenuReducers(
    state: LeftMenuState,
    action: LeftMenunAction
) {
    switch (action.type) {
        case SET_MENU_LEFT.REQ_GET_FILE_UPLOAD:
            return {
                ...state,
                data: action.data,
                isLoading: false,
            };
        case SET_MENU_LEFT.REQ_REMOVE_FILE_UPLOAD:
            return {
                ...state,
                data: undefined,
                isLoading: false,
            };

        case SET_MENU_LEFT.REQ_GET_FOLDER_NAME_UPLOAD:
            return {
                ...state,
                folderName: action.folderName,
                isLoading: false,
            };
        case SET_MENU_LEFT.REQ_REMOVE_FOLDER_NAME_UPLOAD:
            return {
                ...state,
                folderName: undefined,
                isLoading: true,
            };
        default:
            return state;
    }
}
