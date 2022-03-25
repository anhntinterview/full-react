// TYPES
import { CreateWorkspaceArgsType } from 'types/CreateWorkspace.type';
import { GetListOfWorkspaceBodyType } from 'types/GetListOfWorkspace.type';
import { UpdatePasswordArgsType } from 'types/UpdatePassword.type';

const fakeCreateWorkspace = async (args: CreateWorkspaceArgsType) => {
    const delay = Math.ceil(Math.random() * 2) * 1000;
    if (args) {
        const { name } = args;
        const fakeRes = {
            id: 0,
            name,
            subdomain: null,
        };
        const res = await new Promise((resolve) =>
            setTimeout(() => resolve(fakeRes), delay)
        );
        return res;
    }
};

const fakeGetListOfWorkspace = async (args: GetListOfWorkspaceBodyType) => {
    const delay = Math.ceil(Math.random() * 2) * 1000;
    if (args) {
        const fakeRes = {
            items: [
                {
                    id: 1,
                    is_creator: true,
                    name: 'ooolab1',
                    status: 'active',
                    subdomain: null,
                },
                {
                    id: 2,
                    is_creator: true,
                    name: 'ooolab2',
                    status: 'active',
                    subdomain: null,
                },
                {
                    id: 3,
                    is_creator: true,
                    name: 'ooolab3',
                    status: 'active',
                    subdomain: null,
                },
            ],
            page: 10,
            per_page: 5,
            total: 10,
            sort_by: 0,
            order: 0,
        };
        const res = await new Promise((resolve) =>
            setTimeout(() => resolve(fakeRes), delay)
        );

        return res;
    }
};

const fakeUpdatePassword = async (body: UpdatePasswordArgsType) => {
    const delay = Math.ceil(Math.random() * 2) * 1000;
    if (body) {
        const { access_token, old_password, new_password } = body;
        const fakeRes = 204;
        const res = await new Promise((resolve) =>
            setTimeout(() => resolve(fakeRes), delay)
        );
        return res;
    }
};

export default {
    fakeCreateWorkspace,
    fakeGetListOfWorkspace,
    fakeUpdatePassword,
};
