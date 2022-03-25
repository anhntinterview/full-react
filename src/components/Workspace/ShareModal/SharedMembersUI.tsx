import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// COMPONENT
import SharedMember from './components/SharedMember';
// TYPE
import { GoogleFiles } from 'types/GoogleType';
import { GoogleService } from 'services';

interface SharedMemberUIProps {
    data: GoogleFiles | undefined;
    onClose: () => void;
}

const SharedMembersUI: React.FC<SharedMemberUIProps> = ({ data, onClose }) => {
    const { control, getValues, formState, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRequestSuccess = () => {
        onClose();
        setIsLoading(false);
        toast.info('Change permission successfully', {
            position: 'bottom-left',
            hideProgressBar: true,
        });
    };

    const onSubmit = async (e: any) => {
        // e.preventDefault();
        if (!data?.id) return;
        const touchedFields = formState.dirtyFields;
        const params: any[] = [];
        const touchedFieldsKeys = Object.keys(touchedFields);
        if (touchedFields && touchedFieldsKeys.length) {
            touchedFieldsKeys.forEach((element) => {
                const permissionId = element.replace('selectedMembers-', '');
                const fieldValue: { value: string; label: string } = getValues(
                    element
                );
                params.push({
                    permissionId,
                    role: fieldValue.value.trim(),
                });
            });
        } else onClose();
        if (params.length > 1) {
            const listRequest = params.map((i) => {
                return GoogleService.updateFilePermissions(
                    data?.id,
                    i.permissionId,
                    {
                        role: i.role,
                    }
                );
            });
            setIsLoading(true);
            Promise.all(listRequest).then((res) => {
                handleRequestSuccess();
            });
        } else if (params.length === 1) {
            setIsLoading(true);
            GoogleService.updateFilePermissions(
                data?.id,
                params[0].permissionId,
                {
                    role: params[0].role,
                }
            ).then(() => {
                handleRequestSuccess();
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div
                className={`px-10 pt-5 pb-4 bg-white ${
                    data?.permissions &&
                    data.permissions.length > 4 &&
                    'max-h-48 overflow-y-scroll'
                }`}
            >
                {data?.permissions &&
                    data.permissions
                        .filter((i) => i.role.toLowerCase() === 'owner')
                        .map((j) => <SharedMember isOwner key={j.id} {...j} />)}
                {data?.permissions &&
                    data.permissions
                        .filter((j) => j.role.toLowerCase() !== 'owner')
                        .map((i) => (
                            <SharedMember control={control} key={i.id} {...i} />
                        ))}
            </div>
            <div className="px-10 pt-5 pb-4 border-t-2 flex justify-between items-center bg-white rounded-b-3xl w-full">
                <button>Embed</button>
                <button
                    type="submit"
                    className="bg-ooolab_blue_4 text-white py-3 px-ooolab_p_12 rounded-xl focus:outline-none relative"
                >
                    {(isLoading && (
                        <span className="absolute top-0 right-0 h-3 w-3 flex">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                    )) ||
                        null}
                    Done
                </button>
            </div>
        </form>
    );
};

export default SharedMembersUI;
