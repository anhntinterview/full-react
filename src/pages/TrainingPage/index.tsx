import Training from 'components/Training';
import React from 'react';
import MasterPage from '../MasterPage';

interface TrainingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrainingPage: React.FC<TrainingPageProps> = ({ setAuthStorage }) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <Training />
        </MasterPage>
    );
};

export default TrainingPage;
