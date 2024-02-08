import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

interface MapProps {
    id: string;
    lat: number;
    long: number;
    center: {
        lat: number,
        long: number
    };
    username: string;
    classname: string;
}

const MapComponent: React.FC<MapProps> = ({id, lat,long,username, center, classname}) => {
    // const { lat, lang, username } = this.props;
    return(
        <LeafletMap center={[center.lat, center.long]} zoom={16} scrollWheelZoom={false} className={classname} id={id}>
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, long]}>
                <Popup>
                    {username}<br /> Latitude: {lat}<br/> Longitude:{long}
                </Popup>
            </Marker>
        </LeafletMap>
    );
}
export default MapComponent;
