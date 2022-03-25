import { EmojiSadIcon, PaperClipIcon, XIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { IClass } from 'types/Class.type';
import { NormalResponseError } from 'types/Common.type';

interface CreateClassResultProps {
    classDetail: IClass;
    goBack: () => void;
    closeModal: () => void;
    createStatus: 'success' | 'error' | 'init';
    createError?: NormalResponseError;
}

const CreateClassResult: React.FC<CreateClassResultProps> = ({
    classDetail = {},
    goBack,
    createStatus,
    createError,
    closeModal,
}) => {
    const { t: translator } = useTranslation();

    const listErrors: Record<string, string> = {
        INVALID_TIME_RANGE: translator('FORM_CONST.INVALID_TIME_RANGE'),
    };

    return (
        <>
            {(createStatus === 'success' && (
                <div>
                    {' '}
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Class created successfully
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Class Name
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {classDetail.name}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    VC Link
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {classDetail.vc_link}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    Start Date
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {classDetail.start_date}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                    End Date
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {classDetail.end_date}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {classDetail.description}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )) ||
                null}
            {createStatus === 'error' && (
                <>
                    <div />
                    <div className="px-4 py-5">
                        <p className="flex justify-center text-ooolab_lg font-medium items-center">
                            <EmojiSadIcon className="w-ooolab_w_6 h-ooolab_h_6 pr-ooolab_p_1_e" />{' '}
                            Something went wrong when create class!
                        </p>
                        <ul className="text-left list-disc ">
                            {createError?.error?.body_params &&
                                createError?.error?.body_params.map((i) => (
                                    <li className="text-ooolab_xs text-red-500 flex items-center">
                                        <XIcon className="w-ooolab_w_3 h-ooolab_h_3 mr-ooolab_m_1" />
                                        <span>
                                            {listErrors[i.msg] || i.msg}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </>
            )}
            <div className="flex justify-center items-center mt-ooolab_m_4">
                {createStatus === 'error' ? (
                    <button
                        className="px-ooolab_p_2 flex items-center justify-center text-center py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded text-ooolab_xs min-w-ooolab_h_20"
                        type="button"
                        onClick={goBack}
                    >
                        Back
                    </button>
                ) : (
                    <button
                        className="px-ooolab_p_2 flex items-center justify-center text-center py-ooolab_p_1_e bg-ooolab_dark_300 text-white rounded text-ooolab_xs min-w-ooolab_h_20"
                        type="button"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                )}
            </div>
        </>
    );
};

export default CreateClassResult;
