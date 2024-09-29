import { FC } from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import CustomCardMedia from "../../components/Catalogo/CustomCardMedia";
import abstrata1 from "../../assets/IMG.jpg";
import { theme } from "../../Style/Theme";
import CatalogoCompleto from "../../components/Catalogo/CatalogoCompleto";

const abstratas = [
  {
    id: 1,
    name: "Abstrata Lorem",
    image: abstrata1,
  },
  {
    id: 2,
    name: "Abstratas Ipsum",
    image: abstrata1,
  },
  {
    id: 3,
    name: "Abstratas Dolor",
    image: abstrata1,
  },
];

const Abstratas: FC = () => {
  return (
    <Container>
      <CatalogoCompleto />
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100px",
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          Abstratas
        </Typography>
      </div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        alignItems="center"
        justifyContent="center"
      >
        {abstratas.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                borderRadius: "15px",
                width: "100%",
                height: "100%",
                backgroundColor: theme.palette.secondary.main,
              }}
            >
              <CardActionArea>
                <div style={{ width: "100%", height: "300px" }}>
                  <CustomCardMedia images={[item.image]} title={item.name} />
                </div>
                <CardContent>
                  <Typography
                    color={theme.palette.common.white}
                    variant="h5"
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

export default Abstratas;
