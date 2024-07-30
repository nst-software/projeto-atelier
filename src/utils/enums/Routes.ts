import { Home } from "@mui/icons-material";

export class Routes {
  public static enum = {
    Home: "/",
    QuemSomos: "quemSomos",
    Catalogo: "catalogo",
    FaleConosco: "fale-conosco",
    
  } as const;
  public static label = {
    [this.enum.Home]: "Home",
    [this.enum.QuemSomos]: "Quem Somos",
    [this.enum.Catalogo]: "Catálogo",
    [this.enum.FaleConosco]: "Fale Conosco",
    
  };
  public static values = Object.values(this.enum);
  public static getLabel(
    value: (typeof Routes.enum)[keyof typeof Routes.enum],
  ) {
    return this.label[value];
  }
}
