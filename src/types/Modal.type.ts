export interface ModalPropTypes {
    component: {
        type: string;
        title: string;
        subTitle: string;
        btnCancel: string;
        btnSubmit: string;
        color: string;
        img: string;
    };
    onFetch: Function;
}
