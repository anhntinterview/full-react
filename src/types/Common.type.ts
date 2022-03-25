export interface IObjectKeys {
    [key: string]: string | boolean | number | undefined;
}

export interface AuthenticateType {
    access_token: string;
}

export type NormalResponseError = {
    error: {
        code: number;
        description: string;
        body_params: ValidateResponseError[];
        name: string;
    };
};

export type ValidateResponseError = {
    loc: string[];
    msg: string;
    type: string;
};
export type ValidateResponseErrors = {
    validation_error: {
        body_params: ValidateResponseError[];
    };
};
