import { FC } from "react";
import Card from "@mui/material/Card";
import CustomCardMedia from "./CustomCardMedia";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  card: {
    margin: "2rem",
    marginTop: "0",
    marginBottom: "0",
    cursor: "pointer",
  },
  divPrincipal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  texto: {
    fontSize: "2vw",
    color: theme.palette.primary.contrastText,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      fontSize: "5vw",
    },
  },
  divCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "32%",
    [theme.breakpoints.down("sm")]: {
      width: "85%",
    },
  },
}));

const catalogos = [
  {
    id: 1,
    name: "Abstratas",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/abstratas",
  },
  {
    id: 2,
    name: "Animal Print",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/animal-print",
  },
  {
    id: 3,
    name: "Barrados",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/barrados",
  },
  {
    id: 4,
    name: "Bolados-Poa",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/bolados-poa",
  },
  {
    id: 5,
    name: "Étnicas",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/etnicas",
  },
  {
    id: 6,
    name: "Figurativos Românticos",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/figurativos-romanticos",
  },
  {
    id: 7,
    name: "Florais Clássicos",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/florais-classicos",
  },
  {
    id: 8,
    name: "Florais Românticos",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/florais-romanticos",
  },
  {
    id: 9,
    name: "Folhagens",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/folhagens",
  },
  {
    id: 10,
    name: "Geométricos",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/geometricos",
  },
  {
    id: 11,
    name: "Infantil Bebês",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/infantil-bebes",
  },
  {
    id: 12,
    name: "Infantil Feminino",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/infantil-feminino",
  },
  {
    id: 13,
    name: "Infantil Masculino",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/infantil-masculino",
  },
  {
    id: 14,
    name: "Liberty",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/liberty",
  },
  {
    id: 15,
    name: "Listradas",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/listradas",
  },
  {
    id: 16,
    name: "Masculinas",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/masculinas",
  },
  {
    id: 17,
    name: "Pareôs",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/pareos",
  },
  {
    id: 18,
    name: "Tropical",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/tropical",
  },
  {
    id: 19,
    name: "Xadrez",
    images: [
      "src/assets/IMG.jpg",
      "src/assets/ATELIER-LOGO.png",
      "src/assets/IMG.jpg",
    ],
    rota: "/catalogo/xadrez",
  },
];

const Cards: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className={classes.divPrincipal}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {catalogos.map((item) => (
          <div className={classes.divCard}>
            <h2 className={classes.texto} onClick={() => navigate(item.rota)}>
              {item.name}
            </h2>
            <Card
              key={item.id}
              className={classes.card}
              onClick={() => navigate(item.rota)}
            >
              <CustomCardMedia images={item.images} title={item.name} />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
