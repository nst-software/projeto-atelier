import React from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CustomCardMedia from "../Catalogo/CustomCardMedia";
import {
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { theme } from "../../Style/Theme";
import Catalogo from "../../catalogoItens/catalogo";

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

const PrintsCards: React.FC = () => {
  const { category_id } = useParams<{ category_id: string }>();

  // Converta o category_id para number para comparação
  const categoryIdNumber = Number(category_id);

  const filteredCatalogo = Catalogo.find(
    (item) => item.category_id === categoryIdNumber,
  );

  if (!filteredCatalogo) {
    return <div>Categoria não encontrada</div>;
  }

  return (
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="center"
        justifyContent="center"
      >
        {filteredCatalogo.prints.map((print: Print) => (
          <Grid item xs={12} sm={6} md={4} key={print.id}>
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
                <div style={{ width: "100%", height: "500px" }}>
                  <CustomCardMedia images={print.image} title={print.image} />
                </div>
                <CardContent></CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PrintsCards;
