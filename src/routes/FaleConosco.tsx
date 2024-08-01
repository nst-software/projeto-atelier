import { FC } from "react";
import ImagemLogo from "../components/Home/ImagemLogo";
import Contato from "../components/FaleConosco/Contato";
import NossaLoja from "../components/FaleConosco/NossaLoja";

const FaleConosco: FC = () => {
  return (
    <div>
      <ImagemLogo />
      <Contato />
      <NossaLoja />
    </div>
  );
};

export default FaleConosco;
