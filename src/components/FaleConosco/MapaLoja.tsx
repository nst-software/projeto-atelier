import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Button } from "@mui/material";

const MapComponent = () => {
  const center: LatLngExpression = [-16.670700487404332, -49.29092395092388];

  const openMap = () => {
    const mapUrl =
      "https://www.google.com/maps/place/Av.+São+Paulo,+298+-+St.+Campinas/@-16.6708341,-49.2908864,17z/data=!4m7!3m6!1s0x935ef40f1af1d067:0xed6202900c04fe09!4b1!8m2!3d-16.6708341!4d-49.2908864!16s%2Fg%2F11dzsdy4lb?entry=ttu&g_ep=EgoyMDI0MTAyMC4xIKXMDSoASAFQAw%3D%3D";
    window.open(mapUrl, "_blank");
  };

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
        <Popup>
          <div>
            <Button
              sx={{
                color: "white",
                background: "blue",
                "&:hover": {
                  background: "darkblue",
                },
              }}
              onClick={openMap}
            >
              Abrir no Mapa
            </Button>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
