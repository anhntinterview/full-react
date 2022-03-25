export type HasingCodeArgType = {
    email: string;
};
export type HasingCodeResultType = {
    hashingCode: string;
};

export interface HasingCodeState {
    result: HasingCodeResultType | undefined;
    params: string;
    status: string;
    err: string;
}

export interface HasingCodeAction extends HasingCodeState {
    type: string;
}
