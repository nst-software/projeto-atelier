import Card from "@mui/material/Card";
import CustomCardMedia from "./CustomCardMedia";
import { useNavigate } from "react-router-dom";
import image1 from "../../assets/IMG.jpg";
import logo from "../../assets/ATELIER-LOGO.png";
import placeholder1 from "../../assets/placeholder_image1.png";
import placeholder2 from "../../assets/placeholder_image2.png";
import {
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { theme } from "../../Style/Theme";

const catalogos = [
  {
    id: 1,
    name: "Abstratas",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/abstratas",
  },
  {
    id: 2,
    name: "Animal Print",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/animal-print",
  },
  {
    id: 3,
    name: "Barrados",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/barrados",
  },
  {
    id: 4,
    name: "Bolados-Poa",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/bolados-poa",
  },
  {
    id: 5,
    name: "Étnicas",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/etnicas",
  },
  {
    id: 6,
    name: "Figurativos Românticos",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/figurativos-romanticos",
  },
  {
    id: 7,
    name: "Florais Clássicos",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/florais-classicos",
  },
  {
    id: 8,
    name: "Florais Românticos",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/florais-romanticos",
  },
  {
    id: 9,
    name: "Folhagens",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/folhagens",
  },
  {
    id: 10,
    name: "Geométricos",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/geometricos",
  },
  {
    id: 11,
    name: "Infantil Bebês",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/infantil-bebes",
  },
  {
    id: 12,
    name: "Infantil Feminino",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/infantil-feminino",
  },
  {
    id: 13,
    name: "Infantil Masculino",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/infantil-masculino",
  },
  {
    id: 14,
    name: "Liberty",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/liberty",
  },
  {
    id: 15,
    name: "Listradas",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/listradas",
  },
  {
    id: 16,
    name: "Masculinas",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/masculinas",
  },
  {
    id: 17,
    name: "Pareôs",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/pareos",
  },
  {
    id: 18,
    name: "Tropical",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/tropical",
  },
  {
    id: 19,
    name: "Xadrez",
    images: [image1, logo, placeholder1, placeholder2],
    rota: "/catalogo/xadrez",
  },
];

const Cards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="center"
        justifyContent="center"
      >
        {catalogos.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                backgroundColor: theme.palette.secondary.main,
                borderRadius: "15px",
                width: "100%",
                height: "100%",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  cursor: "pointer",
                },
              }}
            >
              <CardActionArea onClick={() => navigate(item.rota)}>
                <div style={{ width: "100%", height: "300px" }}>
                  <CustomCardMedia images={item.images} title={item.name} />
                </div>
                <CardContent>
                  <Typography
                    color={theme.palette.common.white}
                    variant="h6"
                    component="h2"
                    textAlign="center"
                  >
                    {item.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Cards;
