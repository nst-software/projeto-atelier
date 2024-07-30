import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import imagem from "../../assets/IMG.jpg";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  divTexto: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "50%",
    marginTop: "2rem",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  titulo: {
    fontSize: "3vw",
    fontWeight: "bold",
    color: theme.palette.primary.contrastText,
    marginLeft: "10%",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      fontSize: "6vw",
    },
  },
  texto: {
    fontSize: "1.4vw",
    color: theme.palette.primary.contrastText,
    marginLeft: "10%",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      fontSize: "4vw",
      width: "90%",
      marginLeft: "0%",
    },
  },
  divImagem: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: "2rem",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },

  imagem: {
    width: "80%",
    borderRadius: "30px",
  },
}));

const ImagemTexto = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <div className={classes.divTexto}>
        <h1 className={classes.titulo}>Lorem ipsum dolor sit amet</h1>
        <p className={classes.texto}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam odit
          porro aliquid reiciendis. Asperiores non sed autem ipsum labore fugit
          id placeat, debitis nostrum esse, sequi consequuntur, quisquam
          explicabo tempore. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quam odit porro aliquid reiciendis. Asperiores non sed autem
          ipsum labore fugit id placeat, debitis nostrum esse, sequi
          consequuntur, quisquam explicabo tempore.
        </p>
        <p className={classes.texto}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam odit
          porro aliquid reiciendis. Asperiores non sed autem ipsum labore fugit
          id placeat, debitis nostrum esse, sequi consequuntur, quisquam
          explicabo tempore.Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quam odit porro aliquid reiciendis. Asperiores non sed autem
          ipsum labore fugit id placeat, debitis nostrum esse, sequi
          consequuntur, quisquam explicabo tempore.
        </p>
        <p className={classes.texto}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam odit
          porro aliquid reiciendis. Asperiores non sed autem ipsum labore fugit
          id placeat, debitis nostrum esse, sequi consequuntur, quisquam
          explicabo tempore.Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quam odit porro aliquid reiciendis. Asperiores non sed autem
          ipsum labore fugit id placeat, debitis nostrum esse, sequi
          consequuntur, quisquam explicabo tempore.
        </p>
      </div>
      <div className={classes.divImagem}>
        <img src={imagem} alt="Imagem" className={classes.imagem} />
      </div>
    </div>
  );
};

export default ImagemTexto;
