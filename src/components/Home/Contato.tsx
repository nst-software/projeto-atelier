import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import floral1 from "../../assets/ImagemFundo1/floralBuque01.png";
import floral2 from "../../assets/ImagemFundo1/floralBuque02.png";
import floral3 from "../../assets/ImagemFundo1/floralBuque03.png";
import CallIcon from "@mui/icons-material/Call";
import Instagram from "@mui/icons-material/Instagram";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  containerPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: "4rem",
    borderRadius: "45px",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      width: "100%",
      borderRadius: "0",
    },
    maxWidth: "1800px",
  },
  divContato: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    aspectRatio: "16 / 10",

    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  divText: {
    left: "0",
    alignItems: "center",
    width: "70%",
    maxWidth: "70%",
    [theme.breakpoints.down("sm")]: {
      width: "95%",
    },
    flexDirection: "column",
  },
  buttonContato: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: "0",
    padding: "0.5rem",
    borderRadius: "10px",
    borderColor: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: "semiBold",
    fontSize: "1.2vw",
    cursor: "pointer",
    "&:hover": {
      fontSize: "1.3vw",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem",
      "&:hover": {
        fontSize: "1.3rem",
      },
    },
  },

  textPrincipal: {
    color: theme.palette.secondary.contrastText,
    fontWeight: "bold",
    fontSize: "2.6vw",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.up("xl")]: {
      fontSize: "3.5rem",
    },
  },
  divImagem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    background: "#ffffff",
    aspectRatio: "16 / 10",
    position: "relative",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "50%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(172, 10, 11, 0.9)", //cor principal com transparência
    zIndex: 1,
  },
  textCard: {
    color: theme.palette.secondary.contrastText,
    fontWeight: "bold",
    fontSize: "2vw",
    textAlign: "center",
    maxFontSize: "2rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem",
    },
    [theme.breakpoints.up("xl")]: {
      fontSize: "2.3rem",
    },
  },
  buttonInstagram: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "10px",
    borderColor: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: "semiBold",
    fontSize: "1.2vw",
    cursor: "pointer",
    "&:hover": {
      fontSize: "1.3vw",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
      "&:hover": {
        fontSize: "1.3rem",
      },
    },
  },
  imagem: {
    width: "100%",
    maxWidth: "100%",
    position: "absolute",
  },
  floral1: { position: "absolute", top: "0", left: "-20%", width: "60%" },
  floral2: {
    position: "absolute",
    bottom: "-10%",
    right: "0",
    width: "60%",
    transform: "rotate(-30deg)",
  },
  floral3: {
    position: "absolute",
    top: "-10%",
    right: "-8%",
    width: "40%",
  },
}));

const Contato: React.FC = () => {
  const classes = useStyles();
  const navigateToWhatsApp = () => {
    // Substitua o número de telefone pelo número desejado, com o código do país (sem sinais como +, -, etc.)
    const phoneNumber = "5562999999999"; // Exemplo para um número do Brasil (55 é o código do país)
    window.open(`https://wa.me/${phoneNumber}`, "_blank"); // Abre o WhatsApp em uma nova aba
  };
  const goToInstagram = () => {
    window.open("https://www.instagram.com/atelier.tecidosoficial/", "_blank");
  };

  return (
    <div className={classes.divPrincipal}>
      <div className={classes.containerPrincipal}>
        <div className={classes.divContato}>
          <div className={classes.divText}>
            <h2 className={classes.textPrincipal}>
              ENTRE EM CONTATO COM NOSSOS REPRESENTANTES
            </h2>
            <button
              className={classes.buttonContato}
              onClick={navigateToWhatsApp}
            >
              <CallIcon style={{ paddingRight: "0.5rem", width: "20%" }} />
              Contato
            </button>
          </div>
        </div>
        <div className={classes.divImagem}>
          <img src={floral1} className={classes.floral1} />
          <img src={floral2} className={classes.floral2} />
          <img src={floral3} className={classes.floral3} />
          <div className={classes.card}>
            <h3 className={classes.textCard}>Acesse o Instagram!</h3>
            <button className={classes.buttonInstagram} onClick={goToInstagram}>
              <Instagram style={{ paddingRight: "0.5rem", width: "20%" }} />
              Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
