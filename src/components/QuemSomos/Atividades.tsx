import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import { Update, Build } from "@mui/icons-material";
import { Recycling } from "@mui/icons-material";

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

    alignItems: "center",
    gap: "1rem",
    width: "250px",
    height: "300px",
    borderRadius: "30px",
    padding: "1rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  divImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
  },
  divText: {
    display: "flex",

    height: "200px",
    justifyContent: "center",

    marginTop: "-1rem",
  },
  text: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.1rem",
    fontWeight: 100,
    height: "100%",
    textAlign: "center",
  },
}));

const NossasAtividades: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <h2 className={classes.text1}>NOSSA MISSÃO</h2>
      <div className={classes.divCards}>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Update sx={{ fontSize: "80px" }} />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Levar aos nossos clientes as atualizações do mercado, mantendo um
              contato próximo, para que todos os seus anseios tornem-se
              realidade.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Build sx={{ fontSize: "55px" }} />
          </div>
          <div className={classes.divText}>
            <p className={classes.text} style={{ marginTop: "0" }}>
              Buscar o aprimoramento e as inovações que o mercado da moda exige,
              trabalhando com equipamentos e suprimentos que nos forneçam as TAP
              necessárias de padronização e exclusividade.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Recycling sx={{ fontSize: "70px" }} />
          </div>
          <div className={classes.divText}>
            <p className={classes.text} style={{ marginTop: "0" }}>
              Promover uma cultura de excelência e sustentabilidade, garantindo
              que todos os nossos processos sejam realizados de forma ética e
              responsável, respeitando o meio ambiente e contribuindo para o
              desenvolvimento social.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NossasAtividades;
