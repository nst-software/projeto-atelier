import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import imagem from "../../assets/IMG.jpg";

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
            Na Atelier Tecidos, somos apaixonados por criar soluções inovadoras
            e personalizadas que atendam às necessidades dos nossos clientes.
            Com uma equipe altamente qualificada e comprometida, atuamos no
            mercado com foco em desenvolver produtos e serviços de alta
            qualidade, sempre visando superar expectativas.
          </p>
          <p className={classes.texto}>
            Nosso diferencial está na capacidade de combinar expertise técnica
            com um atendimento próximo e humanizado. Valorizamos a transparência
            e o trabalho colaborativo, e acreditamos que cada desafio é uma
            oportunidade para aprender e crescer.
          </p>
          <p className={classes.texto}>
            Ao longo dos anos, construímos uma sólida reputação baseada na
            confiança e no sucesso dos projetos que realizamos. Com um olhar
            atento para as tendências tecnológicas e de mercado, buscamos sempre
            estar à frente, oferecendo soluções que fazem a diferença.
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
