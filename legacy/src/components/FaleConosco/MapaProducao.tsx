import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import PlaceIcon from "@mui/icons-material/Place";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { Button } from "@mui/material";

const MapProducao = () => {
  const center: LatLngExpression = [-16.679694914737137, -49.306819273367566];

  const iconMarkup = renderToStaticMarkup(
    <PlaceIcon style={{ fontSize: "40px", color: "#ac0a0b" }} />,
  );
  const customIcon = new DivIcon({
    html: iconMarkup,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  const openMap = () => {
    // Substitua a URL pelo link do local desejado no Google Maps
    const mapUrl =
      "https://www.google.com/maps/place/Atelier+Estamparia+Têxtil/@-16.6796345,-49.3069259,20z/data=!4m9!1m2!2m1!1sRua+11+de+Janeiro,+Qd+02,+Lt+01+e+02,+Vila+Aurora+Oeste,+Goiânia+-+GO,+Cep:+74425-100!3m5!1s0x935ef5858515cea9:0x468dcbe16a349116!8m2!3d-16.6797211!4d-49.3068142!16s%2Fg%2F11rsrrq2cc?entry=ttu&g_ep=EgoyMDI0MTAyMC4xIKXMDSoASAFQAw%3D%3D";
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
      <Marker position={center} icon={customIcon}>
        <Popup>
          <div>
            <Button
              sx={{
                color: "white",
                background: "#ac0a0b",
                "&:hover": {
                  background: "darkred", // Cor ao passar o mouse
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

export default MapProducao;
