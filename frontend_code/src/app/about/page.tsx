'use client';
import { useState } from "react";
import Link from "next/link";
import Hover from "@/components/ui/Hover";
import SignInModal from "@/components/ui/signin";

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-[#0a0010] text-white" style={{ fontFamily: "'Syne', sans-serif" }}>

      {/* Starting section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0010]/40 via-[#0a0010]/80 to-[#0a0010]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#e879f9]/20 blur-3xl" />

        <div className="relative z-10 text-center space-y-6 px-6">
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-tight">
            Our <span className="gradient-text">Product</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Accessible expert research. Designed for clarity.
          </p>
          <p className="gradient-text" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Scroll ↓
          </p>
        </div>

      </section>

      {/* Discover Section */}
      <section className="pt-0 pb-10 text-center relative overflow-hidden">

        <div className="bg-[#0f0018] border-y border-white/5 py-16 px-8 lg:px-20">

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold">
            Discover Something New
          </h2>

          <p className="text-gray-400 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Explore research insights, uncover patterns, and visualize knowledge in entirely new ways.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="glow-btn bg-[#bd7cd0] text-[#0a0010] py-4 px-10 rounded-full text-base font-bold tracking-wide"
          >
            Start Your Research →
          </button>
        </div>
        </div>
      </section>

      {/* Possible Visualizations */}
      <section className="py-24 px-8 bg-[#0a0010]">
        <Hover />
      </section>

      {/* Footer */}
      <section className="relative py-32 px-8 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0026] via-[#2d0044] to-[#1a0026]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#bd7cd0_0%,transparent_70%)]" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[18vw] font-extrabold text-white/[0.02]">LUMINEX</span>
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-tight">
            Research at the speed of thought
          </h2>

          <p className="text-gray-400 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            One keyword. Infinite insight. Start exploring now.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4"></div>
          <Link href="/about#what-do-you-want-to-research">
            <button className="glow-btn bg-[#bd7cd0] text-[#0a0010] py-5 px-14 rounded-full text-lg font-bold tracking-wide">
                Explore Luminex →
            </button>
          </Link>
        </div>
        
      </section>

      {/* Sign In Option */}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, #e879f9, #bd7cd0, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glow-btn {
          box-shadow: 0 0 30px rgba(189,124,208,0.4);
          transition: all 0.3s ease;
        }

        .glow-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(189,124,208,0.8);
        }
      `}</style>
    </div>
  );
}