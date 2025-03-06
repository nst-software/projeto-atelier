import { makeStyles } from "@mui/styles";
import { useEffect } from "react";
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
    maxWidth: "1200px",
  },
}));

const Video: React.FC = () => {
  const classes = useStyles();
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://fast.wistia.com/player.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://fast.wistia.com/embed/k82pzy208k.js";
    script2.async = true;
    script2.type = "module";
    document.body.appendChild(script2);
  }, []);

  return (
    <div className={classes.divPrincipal}>
      <div
        className={classes.video}
        dangerouslySetInnerHTML={{
          __html: `
          <script src="https://fast.wistia.com/embed/k82pzy208k.js" async type="module"></script>
          <wistia-player media-id="k82pzy208k" aspect="1.7843866171003717"></wistia-player>
        `,
        }}
      />
    </div>
  );
};

export default Video;
