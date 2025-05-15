import CardMedia from "@mui/material/CardMedia";
import { FC, useState } from "react";

interface CustomCardMediaProps {
  images: string;
  title: string;
}

const CustomCardMedia: FC<CustomCardMediaProps> = ({ images, title }) => {
  return (
    <CardMedia
      component="img"
      image={images}
      alt={title}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        backgroundColor: "white",
      }}
    />
  );
};

export default CustomCardMedia;
