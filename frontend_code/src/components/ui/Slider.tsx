'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const items = [
  { id: 1, title: "Pie Charts", icon: "/imgs/new-piechart.jpg" },
  { id: 2, title: "Line Charts", icon: "/imgs/new-linechart.png" },
  { id: 3, title: "Heat Maps", icon: "/imgs/new-geographychart.png" },
  { id: 5, title: "Sunburst Charts", icon: "/imgs/new-sunburstchart.png" },
  { id: 6, title: "Keyword Networks", icon: "/imgs/new-scatterplotchart.png" },
  { id: 7, title: "Bar Graphs", icon: "/imgs/new-bargraph.png" },
];

export default function Slider() {
  const [index, setIndex] = useState(0);

  {/* Sliding Effect */}
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getItem = (offset: number) => {
    return items[(index + offset + items.length) % items.length];
  };

  const positions = [
    { x: -260, scale: 0.8, opacity: 0.4, blur: "blur(6px)" },
    { x: 0, scale: 1, opacity: 1, blur: "blur(0px)" },
    { x: 260, scale: 0.8, opacity: 0.4, blur: "blur(6px)" },
  ];

  return (
    <div className="relative w-full flex justify-center items-center h-[420px]">
      <div className="relative w-[800px] h-full flex items-center justify-center">

        {[getItem(-1), getItem(0), getItem(1)].map((item, i) => {
          const pos = positions[i];

          return (
            <motion.div
              key={item.id}
              initial={false}
              animate={{
                x: pos.x,
                scale: pos.scale,
                opacity: pos.opacity,
                filter: pos.blur,
              }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-72 h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#6b3a7a]"
              style={{
                boxShadow:
                  i === 1
                    ? "0 20px 80px rgba(189,124,208,0.35)"
                    : "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={140}
                  height={140}
                  className="object-contain"
                />
                <p className="mt-4 text-lg font-semibold text-center text-white">
                  {item.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}