import CardMedia from "@mui/material/CardMedia";
import { FC, useState } from "react";

interface CustomCardMediaProps {
  images: string[];
  title: string;
}

const CustomCardMedia: FC<CustomCardMediaProps> = ({ images, title }) => {
  const [image] = useState(images[0]);

  return (
    <CardMedia
      component="img"
      image={image}
      alt={title}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        backgroundColor: "white",
      }}
    />
  );
};

export default CustomCardMedia;
