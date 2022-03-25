import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import googleService from 'services/google.service';

export const UseBreadCrumb = () => {
    const params: { folderId: string } = useParams();

    const [breadCrumb, setBreadCrumb] = useState<any>([]);

    return breadCrumb;
};
