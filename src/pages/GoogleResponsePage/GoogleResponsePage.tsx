import React from 'react';
import { useHistory } from 'react-router-dom';

const GoogleResponsePage = () => {
    const history = useHistory();
    
    React.useEffect(() => {
        let id;
        const fragmentString = location.hash.substring(1);
        const params: any = {};
        const regex = /([^&=]+)=([^&]*)/g;
        let m: any;
        while ((m = regex.exec(fragmentString))) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        if (Object.keys(params).length > 0) {
            if (params['state']) {
                id = params['state'];
                delete params['state'];
            }
            localStorage.setItem('google_auth', JSON.stringify(params));
        }
        if (id) {
            history.push(`/workspace/${id}`);
        } else {
            localStorage.removeItem('google_auth');
            history.push('/workspace/create');
        }
    }, []);

    return <div>Loading</div>;
};

export default GoogleResponsePage;
