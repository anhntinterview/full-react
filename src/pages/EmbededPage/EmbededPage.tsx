import React from 'react';
import { useParams } from 'react-router-dom';
import H5PPublicViewer from 'components/H5P/H5PPublicViewer';

export type EmbededType = {
    uid: string;
};

const EmbededPage: React.FC = () => {
    const params: EmbededType = useParams();
    const { uid } = params;
    return (
        <>
            <H5PPublicViewer contentUid={uid} />
        </>
    );
};

export default EmbededPage;
