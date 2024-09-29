import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import video from "../../assets/vecteezy-assortment-of-fabrics-in-textile-store-many-colorful-and-23222036-1_GmPaDAdH.mp4";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "25px",
    width: "95%",
    overflow: "hidden",
    maxWidth: "1800px",
  },
  containerTexto: {
    display: "flex",
    marginLeft: "10%",
    flexDirection: "column",
    maxWidth: "70%",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "90%",
      marginLeft: "5%",
    },
  },
  texto: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.2rem",
    fontWeight: 200,
    marginTop: "5%",
    marginBottom: "0",
  },
  texto2: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.6rem",
    fontWeight: 600,
    margin: "0",
  },
  texto3: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.2rem",
    fontWeight: 100,
    margin: "0",
  },
  containerVideo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "80%",
    aspectRatio: "16 / 9",
    marginTop: "5%",
    marginBottom: "5%",
    borderRadius: "25px",
    overflow: "hidden",
    minWidth: "360px",
  },
  divButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%",
  },
  button: {
    color: theme.palette.secondary.contrastText,
    borderRadius: "25px",
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: theme.palette.secondary.main,
    cursor: "pointer",
    border: `2px solid ${theme.palette.primary.main}`,
    "&:hover": {
      padding: "13px 28px",
    },
  },
}));

function QuemSomos() {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={classes.containerPrincipal}>
        <div className={classes.containerTexto}>
          <h2 className={classes.texto}>QUEM SOMOS</h2>
          <p className={classes.texto2}>ATELIER TECIDOS E ESTAMPARIA</p>
          <p className={classes.texto3}>
            Nosso propósito é oferecer tecidos que unem qualidade e design,
            ajudando nossos clientes a criar peças que expressem sua
            personalidade com estilo e sofisticação.
          </p>
        </div>
        <div className={classes.containerVideo}>
          <video
            className={classes.video}
            src={video}
            title="Video Quem Somos nós"
            autoPlay
            muted
            loop
          />
        </div>
        <div className={classes.divButton}>
          <button
            className={classes.button}
            onClick={() => navigate(`quemSomos`)}
          >
            Saiba mais
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuemSomos;
