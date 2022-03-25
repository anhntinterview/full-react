import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { shareOptions } from 'constant/google.const';
import { GoogleFileUser } from 'types/GoogleType';

interface SharedMembersCustomProps extends GoogleFileUser {
    isOwner?: boolean;
    control?: Control<FieldValues>;
}

const SharedMember: React.FC<SharedMembersCustomProps> = (props) => {
    const {
        displayName,
        emailAddress,
        photoLink,
        id,
        role,
        isOwner = false,
        control,
    } = props;
    const customPermissionSelect: StylesConfig<any, false> = {
        // clearIndicator: (base) => ({ ...base, display: 'none' }),
        control: (_, props) => ({
            display: 'flex',
            border: 'none',
            borderBottom: props.isFocused ? '1px solid blue' : '1px solid grey',
            height: '100%',
        }),
        indicatorSeparator: (base) => ({ ...base, display: 'none' }),
        valueContainer: (base) => ({
            ...base,
            display: 'flex',
            justifyContent: 'flex-end',
        }),
    };

    return (
        <div className="grid grid-cols-4 mb-ooolab_m_2">
            <div className="flex col-span-3">
                <img
                    src={photoLink}
                    className="h-10 w-10 rounded-full"
                    alt="avatar"
                />
                <div className="ml-ooolab_m_3 ">
                    <p>{displayName}</p>
                    <p className="text-gray-400">{emailAddress}</p>
                </div>
            </div>
            {control ? (
                <Controller
                    control={control}
                    name={`selectedMembers-${id}`}
                    render={({ field, formState }) => (
                        <Select
                            {...field}
                            {...formState}
                            defaultValue={shareOptions.find(
                                (i) => i.value === role
                            )}
                            isDisabled={isOwner}
                            className="col-span-1"
                            options={shareOptions}
                            styles={{
                                ...customPermissionSelect,
                                control: (_, props) => ({
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                }),
                            }}
                        />
                    )}
                />
            ) : (
                <Select
                    isDisabled={isOwner}
                    className="col-span-1"
                    options={shareOptions}
                    styles={{
                        ...customPermissionSelect,
                        control: (_, props) => ({
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                        }),
                        indicatorsContainer: () => ({
                            display: 'none',
                        }),
                    }}
                    defaultValue={
                        (!isOwner && {
                            value: 'view',
                            label: 'can view',
                        }) || { value: 'owner', label: 'Onwer' }
                    }
                />
            )}
        </div>
    );
};

export default SharedMember;
