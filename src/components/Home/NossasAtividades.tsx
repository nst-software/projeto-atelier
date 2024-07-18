import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

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
}));

const NossasAtividades: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <h2 className={classes.text1}>NOSSAS ATIVIDADES</h2>
      <div className={classes.divCards}>
        <div className={classes.card}> </div>
        <div className={classes.card}> </div>
        <div className={classes.card}> </div>
        <div className={classes.card}> </div>
      </div>
    </div>
  );
};

export default NossasAtividades;
