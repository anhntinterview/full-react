import React from 'react';
// PACKAGES
import { IPlayerModel } from 'packages/h5p-server';
// TYPES
import { IH5PPlayerArgs } from 'types/H5P.type';
// COMPONENTS
import { H5PPlayerUI } from 'packages/h5p-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { H5PContext } from 'contexts/H5P/H5PContext';
import { useEffect } from 'react';

export interface H5PViewerContentListComponent {
    argsId: IH5PPlayerArgs;
    h5pPlayerPromise: (args: IH5PPlayerArgs) => Promise<IPlayerModel>;
    entryState: {
        editing: boolean;
        playing: boolean;
        loading: boolean;
        saved: boolean;
        saving: boolean;
        saveError: boolean;
        saveErrorMessage: string;
    };
    setEntryState: React.Dispatch<
        React.SetStateAction<{
            editing: boolean;
            playing: boolean;
            loading: boolean;
            saved: boolean;
            saving: boolean;
            saveError: boolean;
            saveErrorMessage: string;
        }>
    >;
}

const H5PViewerContentListEntryComponent: React.FC<H5PViewerContentListComponent> = ({
    argsId,
    h5pPlayerPromise,
    entryState,
    setEntryState,
}) => {
    const h5pPlayer = React.useRef(null);

    const [count, setCount] = React.useState<number>(0);

    const h5PCtx = React.useContext(H5PContext);
    const {
        dispatch,
        H5PState: { h5PApproveContentResult },
    } = h5PCtx;

    useEffect(() => {
        if (h5PApproveContentResult === 204) {
            setCount(count + 1);
        }
    }, [h5PApproveContentResult]);

    function onPlayerInitialized() {
        setEntryState({ ...entryState, loading: false });
    }

    function play() {
        setEntryState({ ...entryState, editing: false, playing: true });
    }
    function close() {
        setEntryState({ ...entryState, editing: false, playing: false });
    }

    return (
        <div className={entryState.loading ? 'loading' : ''}>
            <H5PPlayerUI
                ref={h5pPlayer}
                argsId={argsId}
                loadContentCallback={h5pPlayerPromise}
                onInitialized={onPlayerInitialized}
                onxAPIStatement={(statement: any, context: any, event) =>
                    console.log(statement, context, event)
                }
                key={`ui_${count}`}
            />
            {/* <button
                className="mr-2 mb-2 bg-ooolab_bg_bar text-ooolab_blue_1  px-4 py-2 rounded-header_menu  text-ooolab_1xs hover:bg-ooolab_bg_sub_tab_active hover:text-white"
                onClick={() => play()}
            >
                <FontAwesomeIcon icon={faPlay} className="mr-3" />
                play
            </button>
            {entryState.playing ? (
                <>
                    <button
                        className="mr-2 mb-2 bg-ooolab_blue_4 text-white font-bold px-4 py-2 rounded-2xl"
                        onClick={() => close()}
                    >
                        <FontAwesomeIcon
                            icon={faWindowClose}
                            className="mr-3"
                        />
                        close player
                    </button>
                    <H5PPlayerUI
                        ref={h5pPlayer}
                        argsId={argsId}
                        loadContentCallback={h5pPlayerPromise}
                        onInitialized={onPlayerInitialized}
                        onxAPIStatement={(
                            statement: any,
                            context: any,
                            event
                        ) => console.log(statement, context, event)}
                    />
                    <div
                        style={{
                            visibility: entryState.loading
                                ? 'visible'
                                : 'collapse',
                        }}
                        className="spinner-border spinner-border-sm m-2"
                        role="status"
                    ></div>
                </>
            ) : null} */}
        </div>
    );
};

export default H5PViewerContentListEntryComponent;
