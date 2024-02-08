import {Spin} from 'antd';
import React from "react"; // Include CSS for styling loading spinner

interface LoadingSpinnerProps {
    loading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({loading}) => {
    return loading ? (
        <div className="loading-spinner-overlay">
            <Spin size="large"/>
        </div>
    ) : null;
};

export default LoadingSpinner;
