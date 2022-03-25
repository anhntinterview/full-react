import React, { useCallback, useEffect } from 'react';

let addedScript: string[] = [];

const MetabaseReport: React.FC<{ resizer: string, url: string }> = ({
    resizer, url
}) => {
    useEffect(() => {
        if (!addedScript.includes(resizer)) {
            addedScript.push(resizer);
            const script = document.createElement("script");
            script.src = resizer;
            document.body.appendChild(script);
        }
    }, [resizer]);
    const iFrameResize = (window as any).iFrameResize;
    const onLoad = useCallback((e) => {
        if (iFrameResize) {
            iFrameResize({}, e.target)
        } else {
            setTimeout(() => onLoad(e), 20);
        }
    }, [iFrameResize]);
    return (
        <div className='h-screen'>
            <iframe src={url} onLoad={onLoad} height="100%" width="100%"></iframe>
        </div>
    );
};

export default MetabaseReport;
