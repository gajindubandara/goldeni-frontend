import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';


interface MarkerInfo {
    latitude: number;
    longitude: number;
    username: string;
}

interface MapProps {
    center: {
        latitude: number,
        longitude: number,
        zoom:number,
    };
    classname: string;
    markers: MarkerInfo[];
}

const MapComponent: React.FC<MapProps> = ({center,markers,classname}) => {
    // const { lat, lang, username } = this.props;

    //zoom 16 user / zoom 7 admin
    return(
        <LeafletMap center={[center.latitude, center.longitude]} zoom={center.zoom} scrollWheelZoom={false} className={classname}>
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map(marker => (
                <Marker position={[marker.latitude, marker.longitude]}>
                    <Popup>
                        {marker.username}<br /> Latitude: {marker.latitude}<br /> Longitude: {marker.longitude}
                    </Popup>
                </Marker>
            ))}
        </LeafletMap>
    );
}
export default MapComponent;
