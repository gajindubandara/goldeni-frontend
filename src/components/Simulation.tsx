import React, { useState } from 'react';

const Simulation: React.FC = () => {
    const [rotating, setRotating] = useState<boolean>(false);
    const [xAngle, setXAngle] = useState<number>(0);
    const [yAngle, setYAngle] = useState<number>(0);
    const [zAngle, setZAngle] = useState<number>(0);

    const updateGyroData = () => {
        const newXAngle = Math.floor(Math.random() * 360);
        const newYAngle = Math.floor(Math.random() * 360);
        const newZAngle = Math.floor(Math.random() * 360);

        setXAngle(newXAngle);
        setYAngle(newYAngle);
        setZAngle(newZAngle);
    };

    const startAnimation = () => {
        setRotating(!rotating);
        if (!rotating) {
            setInterval(updateGyroData, 1000);
        } else {
            clearInterval(updateGyroData as any); // Typescript does not allow clearInterval directly on a function
        }
    };

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
                <span>X Angle: {xAngle}° </span>
                <span>Y Angle: {yAngle}° </span>
                <span>Z Angle: {zAngle}° </span>
            </div>
            <button onClick={startAnimation}>{rotating ? 'Stop Animation' : 'Start Animation'}</button>
        </div>
    );
};

export default Simulation;
