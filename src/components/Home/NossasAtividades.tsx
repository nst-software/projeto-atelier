import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import logoRedonda from "../../assets/ATELIER-LOGO.png";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  text1: {
    fontSize: "1.6rem",
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
  },
  divCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    marginTop: "2rem",
    flexWrap: "wrap",
    width: "100%",
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    width: "200px",
    height: "330px",
    borderRadius: "30px",
    padding: "1rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      height: "200px",
    },
  },
  divImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "130px",
  },
  divText: {
    marginTop: "-2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  text: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1rem",
    fontWeight: 100,
    textAlign: "center",
  },
  logo: {
    width: "125px",
    height: "125px",
  },
}));

const NossasAtividades: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <h2 className={classes.text1}>NOSSAS ATIVIDADES</h2>
      <div className={classes.divCards}>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <img src={logoRedonda} className={classes.logo} />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Somos uma estamparia especializada em criar estampas
              personalizadas com técnicas como serigrafia e sublimação,
              garantindo qualidade e durabilidade em diversos tipos de tecidos.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <img src={logoRedonda} className={classes.logo} />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Somos uma fábrica de tecidos, produzindo materiais de alta
              qualidade com foco em durabilidade, conforto e variedade.
              Atendemos diversas indústrias, oferecendo soluções personalizadas
              para cada necessidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NossasAtividades;
