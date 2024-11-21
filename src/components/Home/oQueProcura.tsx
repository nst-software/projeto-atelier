import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: "2rem",
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: "60px",
    width: "160px",
    padding: "1rem",
    border: "1px solid black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    "&:hover": {
      padding: "1.2rem",
      [theme.breakpoints.down("sm")]: {
        padding: "1.1rem",
      },
    },
  },
  textCard: {
    fontSize: "1.2rem",
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.down("sm")]: {
      fontSize: "4vw",
    },
  },
}));

const OQueProcura: React.FC = () => {
  const classes = useStyles();
  const navigateToWhatsApp = () => {
    const phoneNumber = "5562984420366"; // Exemplo para um número do Brasil (55 é o código do país)
    window.open(`https://wa.me/${phoneNumber}`, "_blank"); // Abre o WhatsApp em uma nova aba
  };
  const navigate = useNavigate();

  return (
    <div className={classes.containerPrincipal}>
      <h2 className={classes.text1}>O QUE PROCURA</h2>
      <div className={classes.divCards}>
        <div className={classes.card} onClick={navigateToWhatsApp}>
          <h3 className={classes.textCard}>Entre em contato</h3>
        </div>
        <div className={classes.card} onClick={() => navigate("/catalogo")}>
          <h3 className={classes.textCard}>Ver catálogo</h3>
        </div>
        <div className={classes.card} onClick={() => navigate("/fale-conosco")}>
          <h3 className={classes.textCard}>Nossa loja</h3>
        </div>
        <div className={classes.card} onClick={() => navigate("/quemSomos")}>
          <h3 className={classes.textCard}>O que fazemos</h3>
        </div>
      </div>
    </div>
  );
};

export default OQueProcura;
