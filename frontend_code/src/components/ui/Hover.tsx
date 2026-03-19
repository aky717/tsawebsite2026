"use client";
import { useState } from "react";
import Image from "next/image";

const visualizations = [
  { name: "Pie Chart", desc: "Shows a visual of how the inputted topic is distributed by percent throughout related topics.", img: "/imgs/new-piechart.jpg" },
  { name: "Bar Graph", desc: "Uses the given topic and displays the number of publications for each subtopic.", img: "/imgs/new-bargraph.png" },
  { name: "Line Chart", desc: "Input a topic and display a trend of the topic over the years.", img: "/imgs/new-linechart.png" },
  { name: "Sunburst Chart", desc: "Shows a visual of all the keywords related to each of the subtopics within the topic selected.", img: "/imgs/new-sunburstchart.png" },
  { name: "Keyword Network", desc: "Shows the correlation between keywords and topics.", img: "/imgs/new-scatterplotchart.png" },
  { name: "Heat Map", desc: "Uses color gradients to represent the density of data.", img: "/imgs/new-geographychart.png" },
];

export default function VisualSection() {
  const [active, setActive] = useState<number | null>(null);

  {/* Interactive Visualizations */}
  const left = visualizations.slice(0, 3);
  const right = visualizations.slice(3);

  const leftPositions = [
    { top: 100, left: 40 },
    { top: 260, left: 0 },
    { top: 420, left: 40 },
  ];

  const rightPositions = [
    { top: 100, left: 760 },
    { top: 260, left: 800 },
    { top: 420, left: 760 },
  ];

  const center = { x: 450, y: 300 };

  return (
    <section className="relative py-5 bg-[#0a0010] text-white flex flex-col items-center">

      <div>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-center mb-10">
          Possible Data Visualizations
        </h2>
        <p className="text-gray-400 text-lg text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Click on each one to explore.
        </p>
      </div>

      <div className="relative w-[900px] h-[600px]">

        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {[...leftPositions, ...rightPositions].map((pos, i) => (
            <line
              key={i}
              x1={center.x}
              y1={center.y}
              x2={pos.left + 40}
              y2={pos.top + 40}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Center graphic */}
        <div className="absolute left-[200px] top-[140px]">
          <Image
            src="/imgs/computer.png"
            alt="Dashboard"
            width={500}
            height={300}
            className="rounded-xl shadow-2xl"
          />
        </div>

        {left.map((viz, i) => (
          <Node
            key={i}
            viz={viz}
            pos={leftPositions[i]}
            active={active === i}
            onClick={() => setActive(i)}
          />
        ))}

        {right.map((viz, i) => (
          <Node
            key={i + 3}
            viz={viz}
            pos={rightPositions[i]}
            active={active === i + 3}
            onClick={() => setActive(i + 3)}
          />
        ))}
      </div>

      {/* Descriptions */}
      {active !== null && (
        <div className="mt-12 max-w-xl text-center">
          <h3 className="text-xl font-bold mb-2">
            {visualizations[active].name}
          </h3>
          <p className="text-gray-400">
            {visualizations[active].desc}
          </p>
        </div>
      )}
    </section>
  );
}

function Node({ viz, pos, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer"
      style={{ top: pos.top, left: pos.left }}
    >
      <div
        className={`
          relative w-20 h-20 rounded-full
          flex items-center justify-center
          bg-[#6b3a7a]
          border border-white/10
          transition-all duration-300
          ${active
            ? "scale-125 shadow-[0_0_40px_rgba(189,124,208,0.8)]"
            : "opacity-80 hover:scale-110"}
        `}
      >
        <div className="relative w-10 h-10">
          <Image
            src={viz.img}
            alt={viz.name}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}