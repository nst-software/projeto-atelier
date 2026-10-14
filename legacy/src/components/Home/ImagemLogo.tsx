import { makeStyles } from "@mui/styles";
import logo from "../../assets/LogoEscrita.svg";
import floral1 from "../../assets/ImagemFundo1/floralBuque01.png";
import floral2 from "../../assets/ImagemFundo1/floralBuque02.png";
import floral3 from "../../assets/ImagemFundo1/floralBuque03.png";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    aspectRatio: "16 / 6",
    backgroundColor: "#ffffff",
    [theme.breakpoints.down("sm")]: {
      aspectRatio: "2 / 3",
    },
  },
  logo: {
    maxWidth: "40%",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "80%",
      maxWidth: "100%",
    },
  },
  floral1: {
    position: "absolute",
    top: "0",
    left: "-20%",
    width: "60%",
    [theme.breakpoints.down("sm")]: {
      top: "55%",
      width: "100%",
    },
  },
  floral2: {
    position: "absolute",
    bottom: "-30%",
    right: "0",
    width: "45%",
    transform: "rotate(-30deg)",
    [theme.breakpoints.down("sm")]: {
      bottom: "54%",
      right: "-28%",
      width: "70%",
      transform: "rotate(-90deg)",
    },
  },
  floral3: {
    position: "absolute",
    top: "-10%",
    right: "-8%",
    width: "35%",
    [theme.breakpoints.down("sm")]: {
      width: "70%",
      right: "40%",
      top: "-2%",
      transform: "rotate(180deg)",
      height: "33%",
    },
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
