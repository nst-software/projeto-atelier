import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CustomCardMedia from "./CustomCardMedia";

const catalogos = [
  {
    id: 1,
    name: "Floral",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
  },
  {
    id: 2,
    name: "Geometrico",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
  },
  {
    id: 3,
    name: "Minimalista",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
  },
];

const Catalogo: FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Catalogo</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {catalogos.map((item) => (
          <Card key={item.id} sx={{ maxWidth: 345, m: 2 }}>
            <CustomCardMedia images={item.images} title={item.name} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
