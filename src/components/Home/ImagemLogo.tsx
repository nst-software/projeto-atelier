import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    height: "70vh",
  },
}));

const ImagemLogo = () => {
  const classes = useStyles();
  return (
    <div className={classes.containerPrincipal}>
      <img />
    </div>
  );
};

export default ImagemLogo;
