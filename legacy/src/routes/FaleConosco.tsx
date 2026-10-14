import { FC } from "react";
import ImagemLogo from "../components/Home/ImagemLogo";
import Contato from "../components/FaleConosco/Contato";
import NossaLoja from "../components/FaleConosco/NossaLoja";
import NossaProducao from "../components/FaleConosco/NossaProducao";

const FaleConosco: FC = () => {
  return (
    <div>
      <ImagemLogo />
      <Contato />
      <NossaLoja />
      <NossaProducao />
    </div>
  );
};

export default FaleConosco;
