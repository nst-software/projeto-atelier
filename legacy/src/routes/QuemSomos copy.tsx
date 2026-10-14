import { FC } from "react";
import ImagemTexto from "../components/QuemSomos/ImagemTexto";
import Video from "../components/QuemSomos/Video";
import Atividades from "../components/QuemSomos/Atividades";
import SelosDeQualidade from "../components/Home/SelosDeQualidade";

const QuemSomos: FC = () => {
  return (
    <div>
      <ImagemTexto />
      <Video />
      <Atividades />
      <SelosDeQualidade />
    </div>
  );
};

export default QuemSomos;
