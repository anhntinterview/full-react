import cancel from '../assets/SVG/cancel_2.svg';
import confirm from '../assets/SVG/confirm.svg';
import deleteModal from '../assets/SVG/delete.svg';
import approve from '../assets/SVG/approve_img.svg';
import decline from '../assets/SVG/decline_img.svg';
import removeStudent from '../assets/SVG/removeStudent.svg';

export const HOME_PAGE_MODALS = {
    titleText: 'Update password',
    contentText: `You have just been invited to a new workspace. Would you like to update your password?`,
};

export const CREATE_PASSWORD_MODALS = {
    titleText: 'Create password success!',
    contentText:
        'You have just updated your password. You will be redirected to the login page to sign in again. Or click Create workspace to create your first workspace',
    dismissName: 'Create workspace',
};

export const CREATE_WORKSPACE_MODALS = {
    titleText: 'Create workspace success!',
    contentText:
        'You have your own workspace. Would you like to redirect to invite members to yours. Please click Agree or Dismiss to back the current page',
};

export const INVITE_MEMBERS_MODALS = {
    titleText: 'Invited member success!',
    contentText:
        'You invited a member to your workspace. Please click Agree to close this Dialog',
};

export const FORGOT_PASSWORD_MODALS = {
    titleText: 'Password sent email success!',
    contentText:
        'Password sent to your email. Please check you email and do next steps continue',
};

export const RESET_PASSWORD_MODALS = {
    titleText: 'Reset password success!',
    contentText:
        'You have reseted your password. Please login to access account.',
};

export const UPDATE_PASSWORD_MODALS = {
    titleText: 'Code Valid',
    contentText: 'Your password was updated.',
};

export const UPDATE_USER_MODALS = {
    titleText: 'Update user success!',
    errotText: 'Update user failed!',
};

export const PUBLISH_H5P = (translator: Function) => {
    const type = {
        type: 'publish',
        title: translator('MODALS.PUBLISH_H5P.TILTE'),
        subTitle: translator('MODALS.PUBLISH_H5P.SUBTILE'),
        btnCancel: translator('MODALS.PUBLISH_H5P.BTN_CANCEL'),
        btnSubmit: translator('MODALS.PUBLISH_H5P.BTN_SUBMIT'),
        color: '#0071CE',
        img: confirm,
    };
    return type;
};

export const CANCEL_H5P = (translator: Function) => {
    const type = {
        type: 'cancelNewH5P',
        title: translator('MODALS.CANCEL_H5P.TILTE'),
        subTitle: translator('MODALS.CANCEL_H5P.SUBTILE'),
        btnCancel: translator('MODALS.CANCEL_H5P.BTN_CANCEL'),
        btnSubmit: translator('MODALS.CANCEL_H5P.BTN_SUBMIT'),
        color: '#0071CE',
        img: cancel,
    };
    return type;
};

export const DELETE_H5P = (translator: Function) => {
    const type = {
        type: 'deleteH5P',
        title: translator('MODALS.DELETE_H5P.TILTE'),
        subTitle: translator('MODALS.DELETE_H5P.SUBTILE'),
        btnCancel: translator('MODALS.DELETE_H5P.BTN_CANCEL'),
        btnSubmit: translator('MODALS.DELETE_H5P.BTN_SUBMIT'),
        color: '#E7443C',
        img: deleteModal,
    };
    return type;
};

export const SAVE_H5P = (translator: Function) => {
    const type = {
        type: 'saveH5P',
        title: translator('MODALS.SAVE_H5P.TILTE'),
        subTitle: translator('MODALS.SAVE_H5P.SUBTILE'),
        btnCancel: translator('MODALS.SAVE_H5P.BTN_CANCEL'),
        btnSubmit: translator('MODALS.SAVE_H5P.BTN_SUBMIT'),
        color: '#0071CE',
        img: confirm,
    };
    return type;
};

export const EDIT_H5P = (translator: Function) => {
    const type = {
        type: 'editH5P',
        title: translator('MODALS.EDIT_H5P.TILTE'),
        subTitle: translator('MODALS.EDIT_H5P.SUBTILE'),
        btnCancel: translator('MODALS.EDIT_H5P.BTN_CANCEL'),
        btnSubmit: translator('MODALS.EDIT_H5P.BTN_SUBMIT'),
        color: '#0071CE',
        img: cancel,
    };
    return type;
};

export const APPROVE_ADMIN = (translator: Function) => {
    const type = {
        type: 'approveAdmin',
        title: translator('MODALS.APPROVE_ADMIN.TILTE'),
        subTitle: translator('MODALS.APPROVE_ADMIN.SUBTILE'),
        btnCancel: translator('MODALS.APPROVE_ADMIN.BTN_CANCEL'),
        btnSubmit: translator('MODALS.APPROVE_ADMIN.BTN_SUBMIT'),
        color: '#0071CE',
        img: approve,
    };
    return type;
};

export const DECLINE_ADMIN = (translator: Function) => {
    const type = {
        type: 'declineAdmin',
        title: translator('MODALS.DECLINE_ADMIN.TILTE'),
        subTitle: translator('MODALS.DECLINE_ADMIN.SUBTILE'),
        btnCancel: translator('MODALS.DECLINE_ADMIN.BTN_CANCEL'),
        btnSubmit: translator('MODALS.DECLINE_ADMIN.BTN_SUBMIT'),
        color: '#0071CE',
        img: decline,
    };
    return type;
};

export const REMOVE_USER_CLASSES = (translator: Function) => {
    const type = {
        type: 'removeUserClasses',
        title: translator('CLASSES.CONFIRM_REMOVE_MEMBER'),
        subTitle: translator('CLASSES.SUB_TITLE_REMOVE'),
        btnCancel: translator('CLASSES.NO_CANCEL'),
        btnSubmit: translator('CLASSES.YES_REMOVE'),
        color: '#E7443C',
        img: removeStudent,
    };
    return type;
};

export const H5P_MODAL = {
    publishH5P: {
        type: 'publish',
        title: 'Confirm Publish H5P',
        subTitle: 'Are you sure you want to publish H5P?',
        btnCancel: 'No, cancel',
        btnSubmit: 'Yes, publish it!',
        color: '#0071CE',
        img: confirm,
    },
    cancelNewH5P: {
        type: 'cancelNewH5P',
        title: 'Confirm Cancel New H5P',
        subTitle: 'Are you sure you want to cancel new H5P?',
        btnCancel: 'No, later',
        btnSubmit: 'Yes, cancel it!',
        color: '#0071CE',
        img: cancel,
    },
    deleteH5P: {
        type: 'deleteH5P',
        title: 'Confirm Delete This H5P',
        subTitle: 'Are you sure you want to delete this H5P?',
        btnCancel: 'No, later',
        btnSubmit: 'Yes, delete it!',
        color: '#E7443C',
        img: deleteModal,
    },
    saveH5P: {
        type: 'saveH5P',
        title: 'Confirm Save this H5P',
        subTitle: 'Are you sure you want to save this H5P?',
        btnCancel: 'No, cancel',
        btnSubmit: 'Yes, save it!',
        color: '#0071CE',
        img: confirm,
    },
    editH5P: {
        type: 'editH5P',
        title: 'Confirm Edit this H5P',
        subTitle: 'Are you sure you want to delete this H5P?',
        btnCancel: 'No, later',
        btnSubmit: 'Yes, edit it!',
        color: '#0071CE',
        img: cancel,
    },
    approveAdmin: {
        type: 'approveAdmin',
        title: 'Confirm Approve',
        subTitle: 'Are you sure you want to approve?',
        btnCancel: 'No, later',
        btnSubmit: 'Yes, publish it!',
        color: '#0071CE',
        img: approve,
    },
    declineAdmin: {
        type: 'declineAdmin',
        title: 'Confirm Decline',
        subTitle: 'Are you sure you want to decline?',
        btnCancel: 'No, cancel',
        btnSubmit: 'Yes, decline it!',
        color: '#0071CE',
        img: decline,
    },
};
export const CONFIRM_CANCEL_MODAL = {
    titleText: 'Confirm Cancel',
    contentText: 'Are you sure you want to cancel this?',
};
export const CONFIRM_SAVE_CHANGE_MODAL = {
    titleText: 'Confirm Save Changes',
    contentText: 'Are you sure you want to change your user profile?',
};
export const CONFIRM_SAVE_PHOTO_CHANGE_MODAL = {
    titleText: 'Confirm Change Profile Photo',
    contentText: 'Are you sure you want to change your profile photo?',
};

export const CONFIRM_UPDATE_WORKSPACE = {
    titleText: 'Confirm update workspace',
    contentText: 'Are you sure you want to change your Workspace information?',
};

export const INFORM_UPDATE_WORKSPACE_RESULT = {
    DONE: 'Workspace Update Successfully!',
    ERROR: 'Something went wrong, please try again!',
};

export const WORKSPACE_SETTING_REMOVE_MEMBER = {
    titleText: 'Confirm Remove',
    contentText: 'Are you sure you want to remove this member?',
};
