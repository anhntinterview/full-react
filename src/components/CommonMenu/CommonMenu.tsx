import * as React from 'react';
import { Link } from 'react-router-dom';

import { MenuTypes } from 'types/Menu.type';
import { Menu, Transition } from '@headlessui/react';

//CONTEXT
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';

//MIDDLEWARE
import googleMiddleware from 'middleware/google.middleware';

// ASSETS
import lock from 'assets/SVG/lock.svg';
import { handleCopyFile, handleCreateShortcut } from './CommonMenuFN';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import Preview from '../GoogleDriver/Preview';
import { useTranslation } from 'react-i18next';
export interface ContextMenuProps {
    menuItems: string[];
    elRefs?: HTMLDivElement[];
}
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const ContextMenu: React.FC<ContextMenuProps> = ({ menuItems, elRefs }) => {
    const { t: translator } = useTranslation('', {
        keyPrefix: 'DASHBOARD.GOOGLE_DRIVE',
    });
    const [isVisible, setVisibility] = React.useState(false);
    const [showPreview, setPreview] = React.useState(false);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [target, setTarget] = React.useState<{
        name: string;
        id: string;
        canShare: boolean;
        canCopy: boolean;
        fileType: string;
        thumbnail: string | null;
        webViewLink: string;
    }>();

    const { dispatch: googleDispatch } = React.useContext(
        GoogleAPIAndServicesContext
    );
    const { getWorkspaceDetailState } = React.useContext(GetWorkspaceContext);
    const checkGoogleAuth = localStorage.getItem('google_auth');
    const {
        workspaceDriveId,
        result: workspaceDetailInformation,
    } = getWorkspaceDetailState;
    const menu = React.useMemo(() => {
        if (
            !checkGoogleAuth &&
            workspaceDetailInformation.drive_default_path &&
            workspaceDetailInformation.id !== -1
        ) {
            return menuItems.filter(
                (item: string) =>
                    item !== `${translator('ADD_TO_WORKSPACE_DRIVE')}`
            );
        }
        return menuItems;
    }, [workspaceDetailInformation.drive_default_path]);
    React.useEffect(() => {
        if (!elRefs) {
            return;
        }
        const showMenu = (event: any, item?: HTMLDivElement) => {
            event.preventDefault();
            if (item) {
                const customId = item.getAttribute('custom-id');
                const idCanShare = item.getAttribute('custom-share');
                const idCanCopy = item.getAttribute('custom-copy');
                const fileType = item.getAttribute('custom-mime');
                const name = item.getAttribute('custom-name');
                const thumbnail = item.getAttribute('custom-thumbnail');
                const webViewLink = item.getAttribute('custom-webviewlink');
                setTarget({
                    name: name || '',
                    id: customId || '',
                    canShare: idCanShare ? true : false,
                    canCopy: idCanCopy ? true : false,
                    fileType: fileType || '',
                    thumbnail,
                    webViewLink,
                });
            }
            setVisibility(true);
            setX(event.clientX);
            setY(event.clientY);
        };
        const closeMenu = () => {
            setVisibility(false);
        };

        elRefs.map((item: any) => {
            item?.addEventListener('contextmenu', (e: any) =>
                showMenu(e, item)
            );
            window.addEventListener('click', closeMenu);
        });
        return function cleanUp() {
            elRefs.map((item: any) => {
                item?.removeEventListener('contextmenu', showMenu);
                window.addEventListener('click', closeMenu);
            });
        };
    }, [elRefs]);

    const style = {
        top: `min(calc(100vh - (1rem + 20*100vw/1440) * ${menuItems.length} - 0.5rem - 20px), ${y}px)`,
        left: `min(calc(1170*(100vw/1440)), ${x}px)`,
    };

    function onClickMenu(item: string) {
        switch (item) {
            case 'DELETE':
                {
                    if (target?.name && target.id) {
                        googleMiddleware.updateFile(googleDispatch, {
                            action: 'delete',
                            fieldId: target?.id,
                            body: {
                                trashed: true,
                            },
                            args: {
                                fields: '*',
                            },
                            files: {
                                destination: '',
                                target: target.name,
                                targetId: target.id,
                            },
                        });
                    }
                }
                break;
            case 'SHARE':
                {
                    googleMiddleware.setRightMenuContext(
                        googleDispatch,
                        'share'
                    );

                    googleMiddleware.getFile(googleDispatch, target?.id || '');
                }
                break;
            case 'ADD_TO_WORKSPACE_DRIVE': {
                if (target?.fileType && target.fileType.includes('folder')) {
                    handleCreateShortcut({
                        name: target?.name || '',
                        id: target?.id || '',
                        parents: workspaceDetailInformation.drive_default_path,
                    });
                } else if (target?.canCopy) {
                    handleCopyFile({
                        name: target?.name || '',
                        id: target?.id || '',
                        parents: workspaceDetailInformation.drive_default_path,
                    });
                }
                break;
            }
            case 'PREVIEW':
                setPreview(true);
                break;
            default:
                break;
        }
    }

    return isVisible ? (
        <div>
            <Menu
                as="div"
                style={style}
                className="fixed w-ooolab_w_menu_1 h-auto mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
                <div className="py-1">
                    {menu.map((item, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <button
                                    value={index}
                                    onClick={() => onClickMenu(item)}
                                    className={`${classNames(
                                        active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )} flex items-center justify-start cursor-pointer w-full focus:outline-none`}
                                >
                                    <img
                                        src={lock}
                                        className="w-ooolab_w_8 h-ooolab_h_5 pr-ooolab_p_3"
                                    />
                                    <p className="text-ooolab_sm">{translator(item)}</p>
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </div>
            </Menu>
        </div>
    ) : showPreview ? (
        <Preview target={target} onClosePreview={() => setPreview(false)} />
    ) : null;
};

export default ContextMenu;
