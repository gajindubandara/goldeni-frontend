import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

interface MapProps {
    lat: number;
    long: number;
    username: string;
}

const MapComponent: React.FC<MapProps> = ({lat,long,username}) => {
    // const { lat, lang, username } = this.props;
    return(
        <LeafletMap center={[lat, long]} zoom={16} scrollWheelZoom={false} className="map-container">
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
