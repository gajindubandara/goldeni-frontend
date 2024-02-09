import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';


interface MarkerInfo {
    lat: number;
    long: number;
    username: string;
}

interface MapProps {
    center: {
        lat: number,
        long: number,
        zoom:number,
    };
    classname: string;
    markers: MarkerInfo[];
}

const MapComponent: React.FC<MapProps> = ({center,markers,classname}) => {
    // const { lat, lang, username } = this.props;

    //zoom 16 user / zoom 7 admin
    return(
        <LeafletMap center={[center.lat, center.long]} zoom={center.zoom} scrollWheelZoom={false} className={classname}>
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map(marker => (
                <Marker position={[marker.lat, marker.long]}>
                    <Popup>
                        {marker.username}<br /> Latitude: {marker.lat}<br /> Longitude: {marker.long}
                    </Popup>
                </Marker>
            ))}
        </LeafletMap>
    );
}
export default MapComponent;
