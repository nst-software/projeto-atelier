import { makeStyles } from "@mui/styles";
import logo from "../../assets/LogoEscrita.svg";
import floral1 from "../../assets/ImagemFundo1/floralBuque01.png";
import floral2 from "../../assets/ImagemFundo1/floralBuque02.png";
import floral3 from "../../assets/ImagemFundo1/floralBuque03.png";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    height: "75vh",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  logo: { maxWidth: "40%", zIndex: 1 },
  floral1: { position: "absolute", top: "0", left: "-300px", width: "60%" },
  floral2: {
    position: "absolute",
    bottom: "-200px",
    right: "0",
    width: "45%",
    transform: "rotate(-30deg)",
  },
  floral3: {
    position: "absolute",
    top: "-30px",
    right: "-80px",
    width: "35%",
  },
}));

const ImagemLogo = () => {
  const classes = useStyles();
  return (
    <div className={classes.containerPrincipal}>
      <img src={logo} className={classes.logo} />
      <img src={floral1} className={classes.floral1} />
      <img src={floral2} className={classes.floral2} />
      <img src={floral3} className={classes.floral3} />
    </div>
  );
};

export default ImagemLogo;
