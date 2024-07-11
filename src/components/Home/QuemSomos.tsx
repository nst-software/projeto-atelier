import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import video from "../../assets/vecteezy-assortment-of-fabrics-in-textile-store-many-colorful-and-23222036-1_GmPaDAdH.mp4";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "25px",
    width: "95%",
  },
  containerTexto: {
    display: "flex",
    marginLeft: "10%",
    flexDirection: "column",
    maxWidth: "70%",
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
          <p className={classes.texto2}>
            Lorem ipsum dolor sit amet consectetur
          </p>
          <p className={classes.texto3}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero odit
            dignissimos obcaecati quas earum magni nesciunt voluptatum,
            necessitatibus quam, a sed, distinctio illo praesentium harum
            voluptas quo veritatis enim rem.
          </p>
        </div>
        <div className={classes.containerVideo}>
          <video
            className={classes.video}
            src={video}
            controls
            title="Video Quem Somos nós"
            autoPlay
            muted
            loop
          />
        </div>
        <div className={classes.divButton}>
          <button className={classes.button}>Saiba mais</button>
        </div>
      </div>
    </div>
  );
}

export default QuemSomos;
