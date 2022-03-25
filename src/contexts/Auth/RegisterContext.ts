import { Dispatch, createContext } from 'react';
import { initRegisterState } from 'state/Auth/register.state';
import {RegisterAction, RegisterState} from 'types/Register.type';

export const RegisterContext = createContext<{
    registerState: RegisterState;
    dispatch: Dispatch<RegisterAction>;
}>({
    registerState: initRegisterState,
    dispatch: () => null,
});
