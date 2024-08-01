import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

const MapComponent = () => {
  const center: LatLngExpression = [-16.708869, -49.260226];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ width: "90%", height: "300px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>Localização desejada.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
