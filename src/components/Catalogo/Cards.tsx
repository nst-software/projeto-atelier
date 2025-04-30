import Card from "@mui/material/Card";
import CustomCardMedia from "./CustomCardMedia";

import {
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { theme } from "../../Style/Theme";

const abstratasUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_abstrato.jpg";
const animalPrintUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_animal_print.jpg";
const barradosUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_barrado.jpg";
const boladosPoaUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_bolado_poa.jpg";
const etnicasUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_etnica.jpg";
const figurativosRomanticosUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_figurativo_romantico.jpg";
const floraisClassicosUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_floral_classicos.jpg";
const floraisRomanticosUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_floral_romantico.jpg";
const folhagensUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_folhagem.jpg";
const geometricosUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_geometricas.jpg";
const infantilBebesUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_infantil_bebe.jpg";
const infantilFemininoUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_infantil_femininas.jpg";
const infantilMasculinoUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_infantil_masculina.jpg";
const libertyUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_liberty.jpg";
const listradasUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_listrado.jpg";
const masculinasUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_masculinas.jpg";
const pareosUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_pareo_e_cangas.jpg";
const tropicalUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_tropicais.jpg";
const xadrezUri =
  "https://storage.googleapis.com/tecidosatelier_public/capas/capa_xadrez.jpg";

const catalogos = [
  {
    id: 1,
    name: "Abstratas",
    images: [abstratasUri],
    rota: "/catalogo/abstratas",
  },
  {
    id: 2,
    name: "Animal Print",
    images: [animalPrintUri],
    rota: "/catalogo/animal-print",
  },
  {
    id: 3,
    name: "Barrados",
    images: [barradosUri],
    rota: "/catalogo/barrados",
  },
  {
    id: 4,
    name: "Bolados-Poa",
    images: [boladosPoaUri],
    rota: "/catalogo/bolados-poa",
  },
  {
    id: 5,
    name: "Étnicas",
    images: [etnicasUri],
    rota: "/catalogo/etnicas",
  },
  {
    id: 6,
    name: "Figurativos Românticos",
    images: [figurativosRomanticosUri],
    rota: "/catalogo/figurativos-romanticos",
  },
  {
    id: 7,
    name: "Florais Clássicos",
    images: [floraisClassicosUri],
    rota: "/catalogo/florais-classicos",
  },
  {
    id: 8,
    name: "Florais Românticos",
    images: [floraisRomanticosUri],
    rota: "/catalogo/florais-romanticos",
  },
  {
    id: 9,
    name: "Folhagens",
    images: [folhagensUri],
    rota: "/catalogo/folhagens",
  },
  {
    id: 10,
    name: "Geométricos",
    images: [geometricosUri],
    rota: "/catalogo/geometricos",
  },
  {
    id: 11,
    name: "Infantil Bebês",
    images: [infantilBebesUri],
    rota: "/catalogo/infantil-bebes",
  },
  {
    id: 12,
    name: "Infantil Feminino",
    images: [infantilFemininoUri],
    rota: "/catalogo/infantil-feminino",
  },
  {
    id: 13,
    name: "Infantil Masculino",
    images: [infantilMasculinoUri],
    rota: "/catalogo/infantil-masculino",
  },
  {
    id: 14,
    name: "Liberty",
    images: [libertyUri],
    rota: "/catalogo/liberty",
  },
  {
    id: 15,
    name: "Listradas",
    images: [listradasUri],
    rota: "/catalogo/listradas",
  },
  {
    id: 16,
    name: "Masculinas",
    images: [masculinasUri],
    rota: "/catalogo/masculinas",
  },
  {
    id: 17,
    name: "Pareôs e Cangas",
    images: [pareosUri],
    rota: "/catalogo/pareos",
  },
  {
    id: 18,
    name: "Tropicais",
    images: [tropicalUri],
    rota: "/catalogo/tropical",
  },
  {
    id: 19,
    name: "Xadrez",
    images: [xadrezUri],
    rota: "/catalogo/xadrez",
  },
];

const Cards: React.FC = () => {
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
              <CardActionArea>
                <div style={{ width: "100%", height: "370px" }}>
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
