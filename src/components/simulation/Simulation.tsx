import React from 'react';

interface Props {
    xAngle: number;
    yAngle: number;
    zAngle: number;
}

const Simulation: React.FC<Props> = ({ xAngle, yAngle, zAngle }) => {
    return (
        <div>
            <div className="sim-container">
                <div className="sim-box" id="box" style={{
                    transform: `rotateX(${xAngle}deg) rotateY(${yAngle}deg) rotateZ(${zAngle}deg)`
                }}>
                    <div className="sim-face sim-front">Front</div>
                    <div className="sim-face sim-back">Back</div>
                    <div className="sim-face sim-top">Top</div>
                    <div className="sim-face sim-bottom">Bottom</div>
                    <div className="sim-face sim-right">Right</div>
                    <div className="sim-face sim-left">Left</div>
                </div>
            </div>
            <div className="sim-gyro-data">
                <span><strong>X Angle:</strong> {xAngle.toFixed(2)}° </span><br/>
                <span><strong> Y Angle:</strong> {yAngle.toFixed(2)}° </span><br/>
                <span><strong> Z Angle:</strong> {zAngle.toFixed(2)}° </span>
            </div>
        </div>
    );
};

export default Simulation;
