import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import MapProducao from "./MapaProducao";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",

    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
  },
  titulo: {
    fontSize: "2rem",
    color: theme.palette.primary.contrastText,
    marginTop: "2rem",
    marginLeft: "15%",
  },
  divTexto: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  texto: {
    fontSize: "1rem",
    color: theme.palette.primary.contrastText,
    width: "90%",
    marginLeft: "15%",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  mapaProducao: {
    width: "50%",

    marginLeft: "5%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      marginTop: "2rem",
      marginLeft: "10%",
      overFlow: "hidden",
    },
  },
  separator: {
    width: "75%",
    borderTop: `1px solid ${theme.palette.primary.contrastText}`,
    margin: "20px 0",
    marginLeft: "13.5%",
  },
}));

const NossaProducao: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <h2 className={classes.titulo}>Nossa Producao</h2>
      <div className={classes.separator}></div>
      <div className={classes.container}>
        <div className={classes.divTexto}>
          <p className={classes.texto}>(62)3642-8432</p>
          <p className={classes.texto}>
            Rua 11 de Janeiro, Qd 02, Lt 01 e 02, Vila Aurora Oeste, Goiânia -
            GO, Cep: 74425-100
          </p>
        </div>
        <div className={classes.mapaProducao}>
          <MapProducao />
        </div>
      </div>
    </div>
  );
};

export default NossaProducao;
