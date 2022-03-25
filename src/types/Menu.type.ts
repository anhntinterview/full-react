export type UpdatePasswordBodyType = {
    old_password: string;
    new_password: string;
};

export type UpdatePasswordResponseError = {
    loc: string[];
    msg: string;
    type: string;
};

export type MenuTypes = {
    text: string;
};
