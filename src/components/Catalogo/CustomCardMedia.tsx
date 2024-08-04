import CardMedia from "@mui/material/CardMedia";
import { FC, useEffect, useState } from "react";

interface CustomCardMediaProps {
  images: string[];
  title: string;
}

const CustomCardMedia: FC<CustomCardMediaProps> = ({ images, title }) => {
  const [image, setImage] = useState(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImage(images[Math.floor(Math.random() * images.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, [images]);

  return <CardMedia component="img" image={image} alt={title} />;
};

export default CustomCardMedia;
