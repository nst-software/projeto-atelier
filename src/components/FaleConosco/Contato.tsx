import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import CallIcon from "@mui/icons-material/Call";
import { Sick } from "@mui/icons-material";

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
  texto: {
    fontSize: "1.2rem",
    color: theme.palette.primary.contrastText,

    marginLeft: "15%",
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
    width: "9rem",
    marginLeft: "15%",
    marginTop: "1rem",

    border: "none",
    "&:hover": {
      fontSize: "1.3vw",
      padding: "0.6rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.2rem",
      "&:hover": {
        fontSize: "1.3rem",
      },
    },
  },
}));

const Contato: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <h1 className={classes.titulo}>Contato</h1>
      <p className={classes.texto}>E-mail: tecidosatelier@gmail.com</p>
      <p className={classes.texto}>Telefone: (62) 3294-0595</p>
      <button
        className={classes.buttonContato}
        onClick={() => {
          const phoneNumber = "5562984420366";
          window.open(`https://wa.me/${phoneNumber}`, "_blank");
        }}
      >
        <CallIcon style={{ paddingRight: "0.5rem", width: "20%" }} />
        Contato
      </button>
    </div>
  );
};

export default Contato;
