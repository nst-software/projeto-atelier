import Card from "@mui/material/Card";
import CustomCardMedia from "./CustomCardMedia";
import { useNavigate } from "react-router-dom";
import {
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { theme } from "../../Style/Theme";
import Catalogo from "../../catalogoItens/catalogo.js";

interface Print {
  id: number;
  image: string;
}

interface CatalogoItem {
  category_id: number;
  name: string;
  capa: string;
  rota: string;
  prints: Print[];
}

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
        {Catalogo.map((item: CatalogoItem) => (
          <Grid item xs={12} sm={6} md={4} key={item.category_id}>
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
              <CardActionArea onClick={() => navigate(`${item.category_id}`)}>
                <div style={{ width: "100%", height: "370px" }}>
                  <CustomCardMedia images={item.capa} title={item.name} />
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
