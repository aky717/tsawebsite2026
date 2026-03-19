import Head from "next/head";
import Link from "next/link";
import { Check } from "lucide-react";
import Slider from "@/components/ui/Slider";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-[#0a0010] text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
      <Head>
        <title>Innovative Technology. Empowering Research.</title>
        <meta name="description" content="Luminex: Built for your research experience, simplified by AI." />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes floatUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(189,124,208,0.4), 0 0 60px rgba(189,124,208,0.1); }
            50% { box-shadow: 0 0 40px rgba(189,124,208,0.8), 0 0 100px rgba(189,124,208,0.3); }
          }
          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes slideInLeft {
            0% { opacity: 0; transform: translateX(-60px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            0% { opacity: 0; transform: translateX(60px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes countUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .hero-title {
            animation: floatUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards;
            opacity: 0;
          }
          .hero-sub {
            animation: floatUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
            opacity: 0;
          }
          .hero-cta {
            animation: floatUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s forwards;
            opacity: 0;
          }
          .hero-image {
            animation: slideInRight 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards;
            opacity: 0;
          }
          .gradient-text {
            background: linear-gradient(135deg, #e879f9, #bd7cd0, #7c3aed, #bd7cd0, #e879f9);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 4s ease infinite;
          }
          .glow-btn {
            animation: pulseGlow 2.5s ease-in-out infinite;
            transition: all 0.3s ease;
          }
          .glow-btn:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 0 60px rgba(189,124,208,1), 0 0 120px rgba(189,124,208,0.5) !important;
          }
          .card-hover {
            transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          }
          .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(189,124,208,0.8) !important;
            box-shadow: 0 20px 60px rgba(189,124,208,0.2);
          }
          .noise-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 0;
          }
          .orbit-ring {
            animation: spinSlow 20s linear infinite;
          }
          .orbit-ring-reverse {
            animation: spinSlow 15s linear infinite reverse;
          }
          .stat-card {
            animation: countUp 0.6s ease forwards;
            opacity: 0;
          }
          .stat-card:nth-child(1) { animation-delay: 0.1s; }
          .stat-card:nth-child(2) { animation-delay: 0.2s; }
          .stat-card:nth-child(3) { animation-delay: 0.3s; }
          .check-row {
            transition: all 0.3s ease;
          }
          .check-row:hover {
            transform: translateX(8px);
          }
          .check-row:hover .check-icon {
            transform: scale(1.3) rotate(10deg);
            color: #e879f9;
          }
          .check-icon {
            transition: all 0.3s ease;
          }
          .marquee {
            display: flex;
            gap: 3rem;
            animation: marqueeScroll 18s linear infinite;
            white-space: nowrap;
          }
          @keyframes marqueeScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .section-tag {
            font-family: 'DM Sans', sans-serif;
            font-style: italic;
            letter-spacing: 0.15em;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #bd7cd0;
            opacity: 0.8;
          }
        `}</style>
      </Head>

      {/* Starting Section */}
      <section className="noise-bg relative min-h-screen flex items-center overflow-hidden">
        {/* Glowing circles in the background*/}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,121,249,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />

        {/* Glowing borders*/}
        <div className="absolute right-[5%] top-[10%] w-[420px] h-[420px] opacity-20 hidden lg:block">
          <div className="orbit-ring absolute inset-0 rounded-full border border-purple-400" style={{ borderStyle: "dashed" }} />
          <div className="orbit-ring-reverse absolute inset-[30px] rounded-full border border-fuchsia-400" style={{ borderStyle: "dotted" }} />
          <div className="orbit-ring absolute inset-[70px] rounded-full border border-violet-300" />
        </div>

		{/*Left-side text */}
        <div className="relative z-10 w-full grid lg:grid-cols-2 gap-12 px-8 lg:px-20 py-24 items-center">
          <div className="space-y-8">

            <h1 className="hero-title text-[clamp(2rem,5.5vw,5rem)] font-extrabold leading-[1.0] tracking-tight">
              Innovative<br />
              <span className="gradient-text">Technology.</span><br />
              Empowering<br />Research.
            </h1>

            <p className="hero-sub text-lg text-gray-400 max-w-md leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Meet <span style={{ color: "#bd7cd0", fontWeight: 700 }}>Luminex</span> - your CTM-powered research companion. One word unlocks a universe of publications, insights, and visualizations.
            </p>

            <div className="hero-cta flex flex-wrap gap-4 items-center">
              <Link href="#what-do-we-do">
                <button className="glow-btn bg-[#bd7cd0] text-[#0a0010] py-4 px-10 rounded-full text-base font-bold tracking-wide">
                  Discover Luminex →
                </button>
              </Link>
              <Link href="/about#what-do-you-want-to-research">
                <button className="border border-white/20 text-white/70 py-4 px-10 rounded-full text-base font-medium hover:border-[#bd7cd0] hover:text-white transition-all duration-300">
                  Try it now
                </button>
              </Link>
            </div>
          </div>

          {/* Right side image */}
          <div className="hero-image relative hidden lg:block">
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: "linear-gradient(135deg, rgba(189,124,208,0.3), rgba(124,58,237,0.1))", filter: "blur(2px)" }} />
            <div className="relative rounded-3xl overflow-hidden border border-white/10"
              style={{ boxShadow: "0 0 80px rgba(189,124,208,0.2), inset 0 0 40px rgba(0,0,0,0.4)" }}>
              <img src="/imgs/home_logo.jpg" alt="Luminex hero" className="w-full h-[70vh] object-cover opacity-90" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, transparent 60%, rgba(10,0,16,0.8) 100%)" }} />
            </div>
            {/* Bottom-left of the image description */}
            <div className="absolute -bottom-5 -left-8 bg-[#1a0026] border border-[#bd7cd0]/40 rounded-2xl px-6 py-4"
              style={{ boxShadow: "0 8px 40px rgba(189,124,208,0.25)" }}>
              <p className="text-xs text-[#bd7cd0] font-semibold tracking-widest uppercase mb-1">Powered by</p>
              <p className="text-2xl font-extrabold gradient-text">CTM Research</p>
            </div>
          </div>
        </div>
      </section>

      {/*Stats Bar*/}
      <section className="bg-[#0f0018] border-y border-white/5 py-16 px-8 lg:px-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: "1 Word", label: "Is all it takes to start" },
            { value: "∞ Papers", label: "Sourced from reputable databases" },
            { value: "CTM-model", label: "Visualizations and analysis" },
          ].map((s, i) => (
            <div key={i} className="stat-card text-center space-y-2 card-hover border border-white/5 rounded-2xl py-10 px-6 bg-white/[0.02]">
              <p className="text-4xl font-extrabold gradient-text">{s.value}</p>
              <p className="text-gray-500 text-sm tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What do we do */}
      <section id="what-do-we-do" className="relative py-32 px-8 lg:px-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10"
          style={{ background: "radial-gradient(circle, #e879f9 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-30"
              style={{ background: "linear-gradient(135deg, #7c3aed, #e879f9)", filter: "blur(20px)" }} />
            <img src="/imgs/data-guy.jpg" alt="Data visualization"
              className="relative rounded-3xl w-full object-cover border border-white/10"
              style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} />
          </div>

          <div className="space-y-8">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight">
              What Do<span className="gradient-text"> We Do?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              At Luminex, we harness the <span style={{ color: "#bd7cd0", fontWeight: 600 }}>power of CTM models</span> to make research more{" "}
              <span style={{ color: "#bd7cd0", fontWeight: 600 }}>accessible</span>,{" "}
              <span style={{ color: "#bd7cd0", fontWeight: 600 }}>personalized</span>, and{" "}
              <span style={{ color: "#bd7cd0", fontWeight: 600 }}>efficient</span> for everyone.
            </p>
            <Link href="/about#what-do-you-want-to-research">
              <button className="glow-btn bg-[#bd7cd0] text-[#0a0010] py-4 px-10 rounded-full text-base font-bold tracking-wide mt-4 inline-block">
                Start Researching →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="bg-[#0d0018] py-20 px-8 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #bd7cd0 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #bd7cd0 0px, transparent 1px, transparent 60px)" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold">
              Research With Ease
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
			{[
				{ title: "Save Hours", text: "Eliminate the stress of researching for hours. Let our CTM model do all the heavy lifting instantly." },
				{ title: "CTM Analysis", text: "Get collections of CTM Excel sheets and research analysis tailored to your keyword." },
				{ title: "Data Visuals", text: "Upload datasets and access specialized visualizations including sunbursts, pie charts, and more." },
			].map((f, i) => (
				<div key={i} className="card-hover bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-4">
				
				<Check className="w-10 h-10 text-[#bd7cd0]" />

				<h3 className="text-xl font-bold">{f.title}</h3>
				<p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
					{f.text}
				</p>
				</div>
			))}
		</div>
        </div>
      </section>

      {/* Slider component */}
      <section className="py-20 px-8 lg:px-20 bg-[#0a0010]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold">
              Explore the <span className="gradient-text">Platform</span>
            </h2>
			<p className="text-gray-400 text-lg" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
				Access a multitude of visualizations.
			</p>
          </div>
          <Slider />
        </div>
      </section>

      {/* Footer */}
      <section className="relative py-32 px-8 overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0026 0%, #2d0044 50%, #1a0026 100%)" }}>
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(189,124,208,0.2) 0%, transparent 70%)" }} />

        {/* Luminex Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20vw] font-extrabold text-white/[0.02] whitespace-nowrap">LUMINEX</span>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-tight">
            Illuminate your research journey.
          </h2>
          <p className="text-gray-400 text-lg" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            Start with one word. Discover everything. Ready to begin?
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/about#possible-data-visualizations">
              <button className="glow-btn bg-[#bd7cd0] text-[#0a0010] py-5 px-14 rounded-full text-lg font-bold tracking-wide">
                Explore Luminex →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface CheckListProps {
  text: string;
}

{/*For the Checklist section*/}
const CheckList = ({ text }: CheckListProps) => {
  return (
    <div className="check-row flex flex-row items-start space-x-5 w-full max-w-xl">
      <Check className="check-icon h-6 w-6 text-[#bd7cd0] mt-1 flex-shrink-0" />
      <p className="text-gray-300 text-lg flex-grow" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {text}
      </p>
    </div>
  );
};