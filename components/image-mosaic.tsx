import React from "react";
import { Image } from "@heroui/image";
import { motion } from "framer-motion";

interface ImageMosaicProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export const ImageMosaic: React.FC<ImageMosaicProps> = ({ images }) => {
  // Assurez-vous qu'il y a au moins 5 images
  const safeImages = images.length >= 5 ? images : [
    ...images,
    ...Array(5 - images.length).fill({ src: "/images/placeholder.webp", alt: "Placeholder" })
  ];

  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      {/* Grid container avec espacement et arrondis */}
      <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full">
        {/* Image principale (grande) */}
        <motion.div 
          className="col-span-2 row-span-3 relative overflow-hidden rounded-2xl shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            isBlurred
            isZoomed
            alt={safeImages[0].alt}
            className="object-cover w-full h-full"
            src={safeImages[0].src}
            width={600}
            height={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        {/* Image en haut à droite */}
        <motion.div 
          className="col-span-2 row-span-1 relative overflow-hidden rounded-2xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            isBlurred
            isZoomed
            alt={safeImages[1].alt}
            className="object-cover w-full h-full"
            src={safeImages[1].src}
            width={300}
            height={150}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        {/* Image au milieu à droite */}
        <motion.div 
          className="col-span-1 row-span-2 relative overflow-hidden rounded-2xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            isBlurred
            isZoomed
            alt={safeImages[2].alt}
            className="object-cover w-full h-full"
            src={safeImages[2].src}
            width={150}
            height={300}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        {/* Image en bas à droite */}
        <motion.div 
          className="col-span-1 row-span-2 relative overflow-hidden rounded-2xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            isBlurred
            isZoomed
            alt={safeImages[3].alt}
            className="object-cover w-full h-full"
            src={safeImages[3].src}
            width={150}
            height={300}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        {/* Image en bas */}
        <motion.div 
          className="col-span-2 row-span-1 relative overflow-hidden rounded-2xl shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            isBlurred
            isZoomed
            alt={safeImages[4].alt}
            className="object-cover w-full h-full"
            src={safeImages[4].src}
            width={300}
            height={150}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        {/* Logo YALS avec effet de brillance */}
        <motion.div 
          className="col-span-2 row-span-1 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center overflow-hidden relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-bold text-2xl text-primary z-10">YALS</span>
          {/* Effet de brillance */}
          <div className="absolute -inset-[400%] animate-[spin_12s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </motion.div>
      </div>
      
      {/* Overlay décoratif */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
    </div>
  );
};
