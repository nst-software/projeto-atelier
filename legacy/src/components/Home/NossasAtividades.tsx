import React from "react";
import { makeStyles } from "@mui/styles";
import { theme } from "../../Style/Theme";
import logoRedonda from "../../assets/ATELIER-LOGO.png";
import Local_fire_department from "@mui/icons-material/LocalFireDepartment";
import { Handyman } from "@mui/icons-material";
import { Collections } from "@mui/icons-material";
import { Brush } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
  containerPrincipal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  text1: {
    fontSize: "1.6rem",
    fontWeight: 400,
    color: theme.palette.primary.contrastText,
  },
  divCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    marginTop: "2rem",
    flexWrap: "wrap",
    width: "100%",
  },
  card: {
    backgroundColor: theme.palette.secondary.main,
    display: "flex",
    flexDirection: "column",

    alignItems: "center",

    width: "280px",
    height: "350px",
    borderRadius: "30px",
    padding: "1rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      height: "250px",
    },
  },
  divImg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90px",
  },
  divText: {
    marginTop: "-1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  text: {
    color: theme.palette.secondary.contrastText,
    fontSize: "0.9rem",
    fontWeight: 100,
    textAlign: "center",
  },
  logo: {
    width: "85px",
    height: "85px",
  },
}));

const NossasAtividades: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.containerPrincipal}>
      <h2 className={classes.text1}>NOSSAS ATIVIDADES</h2>
      <div className={classes.divCards}>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Local_fire_department
              sx={{
                fontSize: "70px",
                color: theme.palette.primary.contrastText,
              }}
            />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Trabalhamos com a técnica de estamparia digital por sublimação, um
              processo que transfere a arte para o tecido através do calor,
              garantindo cores vivas, alta durabilidade e toque imperceptível.
              Ideal para tecidos com base de poliéster, como crepes,
              microfibras, alfaiataria sintética, malhas, helancas, oxford,
              cetim e viscolycra, a sublimação permite personalização total,
              seja para moda, decoração ou produtos promocionais. Transformamos
              suas ideias em estampas com alta qualidade e produção sob medida.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Handyman
              sx={{
                fontSize: "70px",
                color: theme.palette.primary.contrastText,
              }}
            />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Oferecemos o serviço completo de estamparia digital nas técnicas
              de sublimação (para tecidos de poliéster) e impressão direta (para
              fibras naturais). Você envia o tecido, escolhe as estampas, e nós
              cuidamos da produção com qualidade, tecnologia e acabamento
              profissional. Ideal para confecções, marcas autorais e designers
              que buscam personalização e agilidade.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Collections
              sx={{
                fontSize: "70px",
                color: theme.palette.primary.contrastText,
              }}
            />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Oferecemos um acervo com mais de 40.000 estampas digitais
              disponíveis para aplicação em tecidos diversos, atendendo demandas
              de moda, decoração, cama, mesa, banho e produtos promocionais.
              Nosso portfólio é constantemente atualizado com base em pesquisas
              de tendências globais, garantindo variedade e atualidade em temas,
              cores e estilos.
            </p>
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.divImg}>
            <Brush
              sx={{
                fontSize: "70px",
                color: theme.palette.primary.contrastText,
              }}
            />
          </div>
          <div className={classes.divText}>
            <p className={classes.text}>
              Para marcas que buscam exclusividade e posicionamento
              diferenciado, disponibilizamos o serviço de desenvolvimento de
              coleções personalizadas, com criações sob medida, alinhadas ao
              perfil estético e estratégico do cliente. Trabalhamos com
              estamparia digital por sublimação e impressão direta, garantindo
              versatilidade em bases têxteis e total controle de qualidade em
              cada etapa da produção.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NossasAtividades;
