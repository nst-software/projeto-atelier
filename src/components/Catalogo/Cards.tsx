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

const animalPrintUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/animal_print/a10053_onca_aquarela.jpg";
const barradosUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/barrados/b_178_x_gemotrico_com_flores_mais_cheio.jpg";
const boladosPoaUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/bolados_poa/a1086_z_bolado_2cm_preto_nude.jpg";
const etnicasUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/etnicas/a654_penas_etnicas..jpg";
const figurativosRomanticosUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/figurativos_romanticos/a033_x_passarinho_com_fundo_azul.jpg";
const floraisClassicosUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/florais_classicos/a10031z_floral_com_fundo_pink.jpg";
const floraisRomanticosUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/florais_romanticos/a8628_floral_rosa_fd_rosa_claro..jpg";
const folhagensUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/folhagens/a9475_v_folhagem_verde..png";
const geometricosUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/geometricos/a2901_x_geometrico_azul_e_preto_e_bege_menor.jpg";
const infantilBebesUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/infantil_bebes/ib001_elefante_carrinho_aamrelo_florzinhas_fundo_azul.jpg";
/* const infantilFemininoUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/infantil_masculino/inf_1055_futebol.jpg"; */
const infantilMasculinoUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/infantil_masculino/inf_1055_futebol.jpg";
const libertyUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/liberty/a2620x_coqueiro_folhagem_menor.jpg";
const listradasUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/listradas/a1481_listrado_5_milimetros..png";
const masculinasUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/masculinas/ab7853_coqueiros_marrom_e_bege.jpg";
const pareosUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/pareos/p_269_x.jpg";
const tropicalUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/tropical/a1582_estampa_tropical_com_folhas_e_passarinhos.jpg";
const xadrezUri =
  "https://storage.googleapis.com/tecidosatelier_estampas/xadrez/a10077_quadriculado_colorido_xadrez.jpg";

const catalogos = [
  /* {
    id: 1,
    name: "Abstratas",
    images: [abstratasUri],
    rota: "/catalogo/abstratas",
  }, */
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
  /*   {
    id: 12,
    name: "Infantil Feminino",
    images: [infantilFemininoUri],
    rota: "/catalogo/infantil-feminino",
  }, */
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
    name: "Pareôs",
    images: [pareosUri],
    rota: "/catalogo/pareos",
  },
  {
    id: 18,
    name: "Tropical",
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
