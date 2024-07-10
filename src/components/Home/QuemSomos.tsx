import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "25px",
    width: "95%",
  },
  containerTexto: {
    display: "flex",
    marginLeft: "5%",
  },
  texto: {
    color: theme.palette.secondary.contrastText,
    fontSize: "1.2rem",
  },
  containerVideo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "80%",
    aspectRatio: "16 / 9",
    marginTop: "2%",
    marginBottom: "5%",
    borderRadius: "25px",
    overflow: "hidden",
    minWidth: "320px",
  },
}));

function QuemSomos() {
  const classes = useStyles();

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
        </div>
        <div className={classes.containerVideo}>
          <iframe
            className={classes.video}
            src="https://www.youtube.com/embed/5qap5aO4i9A"
            title="Video Quem Somos nós"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default QuemSomos;
