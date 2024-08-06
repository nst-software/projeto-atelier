import { FC } from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import animalPrint1 from "../../assets/IMG.jpg";

const animalPrint = [
  {
    id: 1,
    name: "Animal Print 1",
    image: animalPrint1,
  },
  {
    id: 2,
    name: "Animal Print 2",
    image: animalPrint1,
  },
  {
    id: 3,
    name: "Animal Print 3",
    image: animalPrint1,
  },
];

const useStyles = makeStyles(() => ({
  divPrincipal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  card: {
    margin: "2rem",
    marginTop: "2rem",
    marginBottom: "0",
    overflow: "hidden",
  },
  divCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "32%",
    [theme.breakpoints.down("sm")]: {
      width: "85%",
    },
  },
}));
/* Catalogo pra floral */
const AnimalPrint: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.divPrincipal}>
      <h1>Animal Print</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {animalPrint.map((item) => (
          <div className={classes.divCard}>
            <div
              key={item.id}
              className={classes.card}
              style={{ borderRadius: "25px" }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", overflow: "hidden" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalPrint;
