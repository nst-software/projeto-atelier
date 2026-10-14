import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import imagem from "../../assets/QuemSomos.jpeg";

const useStyles = makeStyles(() => ({
  divInicial: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  divPrincipal: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    maxWidth: "1700px",
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
    fontSize: "3rem",
    fontWeight: "bold",
    color: theme.palette.primary.contrastText,
    marginLeft: "10%",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      fontSize: "6vw",
    },
  },
  texto: {
    fontSize: "1.2rem",
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
    width: "45%",
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
    <div className={classes.divInicial}>
      <div className={classes.divPrincipal}>
        <div className={classes.divTexto}>
          <h1 className={classes.titulo}>Atelier Tecidos</h1>
          <p className={classes.texto}>
            Fundada em 2005, na cidade de Goiânia-GO, o Atelier Estamparia
            Digital é fruto do sonho de sua proprietária Cléia Souza.
          </p>
          <p className={classes.texto}>
            Realizando trabalhos com estampas manuais exclusivas, rapidamente a
            empresa passou a atuar nos mercados do Centro-Oeste, Nordeste e
            Sudeste.
          </p>
          <p className={classes.texto}>
            Com a evolução do processo manual para o digital, a empresa
            modernizou, contando hoje com um moderno e amplo parque industrial
            em sua sede própria.
          </p>
          <p className={classes.texto}>
            Chegamos a uma produção de mais de 120.000 metros por mês, sem
            abandonar a qualidade, a padronização, o desenvolvimento de estampas
            exclusivas e o compromisso com a pontualidade na entrega.
          </p>
        </div>
        <div className={classes.divImagem}>
          <img src={imagem} alt="Imagem" className={classes.imagem} />
        </div>
      </div>
    </div>
  );
};

export default ImagemTexto;
