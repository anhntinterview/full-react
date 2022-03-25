import { ExclamationCircleIcon } from "@heroicons/react/outline";

export const errorTitle = (statusError: number) => {
    const styleTitle = 'text-ooolab_sm text-ooolab_dark_1';
    const styleIcon = 'text-red-500 w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_1'
    switch (statusError) {
        case 3:
            return <>
                <div className="flex items-center ">
                    <ExclamationCircleIcon className={styleIcon} />
                    <p className={styleTitle}>Add tags failed!</p>
                </div>
                <div className="flex items-center">
                    <ExclamationCircleIcon className={styleIcon} />
                    <p className={styleTitle}>Delete tags failed!</p>
                </div>

            </>
        case 1:
            return <div className="flex items-center ">
                <ExclamationCircleIcon className={styleIcon} />
                <p className={styleTitle}>Add tags failed!</p>
            </div>

        case 2:
            return <div className="flex items-center">
                <ExclamationCircleIcon className={styleIcon} />
                <p className={styleTitle}>Delete tags failed!</p>
            </div>

    }

}