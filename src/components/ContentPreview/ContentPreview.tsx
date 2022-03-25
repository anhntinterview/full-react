import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import h5pMiddleware from 'middleware/h5p.middlware';

import h5pIcon from 'assets/h5p_icon.png';
import editIcon from 'assets/SVG/pencil.svg';
import listIcon from 'assets/SVG/list.svg';
import closeIcon from 'assets/SVG/close.svg';
import shareIcon from 'assets/SVG/share.svg';
import Slider from 'react-slick';
import { LessonSection } from 'types/GetListOfWorkspace.type';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { genClassNames } from 'utils/handleString';
import { LibraryIcon } from 'constant/setupBars.const';
import { HOST_URL } from 'constant/api.const';
import H5PPlayerContentComponent from 'components/H5P/H5PPlayer/H5PPlayerContentComponent';
import { H5PContext } from 'contexts/H5P/H5PContext';
import { IContentListEntry } from 'types/H5P.type';

const ContentPreview: React.FC = () => {
    const params: { id: string; contentId: string } = useParams();
    const argsId = {
        workspaceId: params.id,
        contentId: params.contentId,
    };
    const [entryState, setEntryState] = React.useState({
        editing: false,
        playing: false,
        loading: false,
        saved: false,
        saving: false,
        saveError: false,
        saveErrorMessage: '',
    });
    const h5PCtx = React.useContext(H5PContext);
    React.useEffect(() => {
        h5pMiddleware.getCurentH5P(dispatch, argsId);
    }, []);
    const [
        h5pContentListEntryState,
        setH5PContentListEntryState,
    ] = React.useState<IContentListEntry>();
    const [h5pData, setH5PData] = React.useState<IContentListEntry>();
    React.useEffect(() => {
        if (h5pContentListEntryState) {
            setH5PData(h5pContentListEntryState);
        }
    }, [h5pContentListEntryState]);

    const {
        dispatch,
        H5PState: {
            h5PContentListResult,
            err,
            h5PApproveContentResult,
            currentH5P,
        },
    } = h5PCtx;

    React.useEffect(() => {
        if (currentH5P) {
            setH5PContentListEntryState({
                argsId: argsId,
                contentId: argsId.contentId,
                mainLibrary: currentH5P?.metadata?.mainLibrary,
                title: currentH5P?.metadata?.title,
                status: currentH5P?.status,
                tags: currentH5P?.tags,
                uid: currentH5P?.uid,
                updated_on: currentH5P?.updated_on,
            });
        }
    }, [currentH5P]);

    // React.useEffect(() => {
    //     if (h5PContentListResult?.items) {
    //         const temp = h5PContentListResult?.items.filter(
    //             (item) => JSON.stringify(item.contentId) === params.contentId
    //         )[0];
    //         setH5PContentListEntryState(temp);
    //     }
    // }, [h5PContentListResult]);

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-min my-6 rounded-sub_tab shadow-ooolab_inset_navigation">
                    <div className="items-center flex px-3 shadow-ooolab_box_shadow_container w-min rounded-sub_tab h-ooolab_h_13">
                        <Link to={`/workspace/${params.id}/h5p-content`}>
                            <div className="bg-ooolab_bar_icon bg-bg-bar-item flex items-center justify-center w-ooolab_w_7_n h-ooolab_h_7">
                                <LibraryIcon active />
                            </div>
                        </Link>
                        <Link
                            to={`/workspace/${params.id}/h5p-content/${params.contentId}`}
                            className="ml-8"
                        >
                            <div className="w-ooolab_w_7_n h-ooolab_h_7 flex items-center justify-center border-ooolab_transparent border-ooolab_border_bar_button hover:bg-ooolab_bg_sub_tab_hover hover:border-ooolab_transparent p-ooolab_p_1_e rounded-full">
                                <img src={editIcon} />
                            </div>
                        </Link>
                        <div className="mx-8 w-ooolab_w_0.0625 bg-ooolab_border_logout self-stretch my-2" />
                        <div className="whitespace-nowrap pr-2">
                            {h5pData?.title}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center py-2 mt-3">
                <div className="w-ooolab_w_h5p_preview ml-20 shadow-ooolab_sub_item rounded-ooolab_h5p p-4">
                    <div className="flex mb-4">
                        <div>{h5pData?.mainLibrary?.split('.')[1]}</div>
                    </div>
                    <H5PPlayerContentComponent
                        argsId={argsId}
                        entryState={entryState}
                        setEntryState={setEntryState}
                    />
                </div>
            </div>
        </>
    );
};

export default ContentPreview;
