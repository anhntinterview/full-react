import { RestfulService } from './restful.service';
// TYPES
import {
    GetDriveAuthentiacteUrlOAuth2ArgsType,
    AuthentiacteWithDriveOAuth2ArgsType,
    GetDriveCredentialOfWorkspaceOAuth2ArgsType,
    UpdateFilesArgs,
} from 'types/GoogleType';
// CONSTANT
import { HOST_URL, GOOGLE_SERVER_SIDE } from 'constant/api.const';

const getDriveAuthenticateUrlOAuth2 = async (
    args: GetDriveAuthentiacteUrlOAuth2ArgsType
) => {
    if (args) {
        const { workspace_id, access_token } = args;
        const res = await RestfulService.getBearerApi(
            HOST_URL +
                GOOGLE_SERVER_SIDE.OAUTH2.GET_DRIVE_AUTHENTICATE_URL(
                    workspace_id
                ),
            access_token
        );
        return res.json();
    }
};

const authenticateWithDrivelOAuth2 = async (
    args: AuthentiacteWithDriveOAuth2ArgsType
) => {
    if (args) {
        console.log(`args: `, args);
        const { workspace_id, access_token, state, code } = args;
        const body = { state, code };
        const res = await RestfulService.postBearerApi(
            HOST_URL +
                GOOGLE_SERVER_SIDE.OAUTH2.AUTHENTICATE_WITH_DRIVE(workspace_id),
            access_token,
            body
        );
        console.log(res);
        return res;
    }
};

const getDriveCredentialsOfWorkspaceOAuth2 = async (
    args: GetDriveCredentialOfWorkspaceOAuth2ArgsType
) => {
    if (args) {
        console.log(`args: `, args);
        const { workspace_id, access_token } = args;
        const res = await RestfulService.getBearerApi(
            HOST_URL +
                GOOGLE_SERVER_SIDE.OAUTH2.GET_DRIVE_CREDENTIALS_OF_WORKSPACE(
                    workspace_id
                ),
            access_token
        );
        console.log(res);
        return res.json();
    }
};

export default {
    getDriveAuthenticateUrlOAuth2,
    authenticateWithDrivelOAuth2,
    getDriveCredentialsOfWorkspaceOAuth2,
};
