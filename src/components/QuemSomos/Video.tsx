import { makeStyles } from "@mui/styles";
import video from "../../assets/vecteezy-assortment-of-fabrics-in-textile-store-many-colorful-and-23222036-1_GmPaDAdH.mp4";
import { theme } from "../../Style/Theme";

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    marginTop: "2rem",
  },
  video: {
    width: "70%",
    borderRadius: "30px",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
}));

const Video: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <video className={classes.video} autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
};

export default Video;
