"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SignInModal from "./ui/signin";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (pathname.includes("about")) {
      setActiveTab("about");
    }
  }, [pathname]);

  const linkStyle = (tab: string) =>
    `relative px-4 py-2 text-sm md:text-base font-medium transition-all duration-300 ${
      activeTab === tab ? "text-white" : "text-white/70"
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          <nav
			className={`
				relative flex items-center justify-between
				rounded-full
				bg-[#6b3a7a] backdrop-blur-xl
				border border-white/10
				px-6 py-3
				shadow-[0_10px_40px_rgba(0,0,0,0.4)]
			`}
			>
            <div className="flex items-center gap-6">
              <Link href="/" className={linkStyle("home")}>
                <span className="nav-hover">Home</span>
              </Link>

              <Link href="/about" className={linkStyle("about")}>
                <span className="nav-hover">Our Product</span>
              </Link>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
			<Link href="/">
				<div className="relative flex items-center justify-center">
				
				<div className="absolute w-20 h-20 rounded-full blur-2xl opacity-40 bg-[#bd7cd0]" />

				<img
					src="/imgs/luminex.png"
					alt="Luminex"
					className= {`
					h-30 w-30 md:h-32 md:w-32 object-contain
					opacity-90
					[mask-image:radial-gradient(circle,white_60%,transparent_100%)]
					hover:scale-105 transition-all duration-300
					`}
				/>
				</div>
			</Link>
			</div>

            {/* Sign In Button */}
            <div className="flex items-center">
              <button
				onClick={() => setIsModalOpen(true)}
				className={`
					flex items-center gap-2
					bg-white text-[#6b3a7a]
					px-5 py-2 rounded-full text-sm font-semibold
					transition-all duration-300
					hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]
				`}
				>
                <img
                  src="/imgs/profile.jpg"
                  alt="Profile"
                  className="w-6 h-6 rounded-full"
                />
                Sign In
              </button>
            </div>
          </nav>
        </div>
      </header>

      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style jsx>{`
        .nav-hover {
          position: relative;
        }

        .nav-hover::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #f8dfff, #ffffff);
          transition: width 0.3s ease;
        }

        .nav-hover:hover::after {
          width: 100%;
        }

        .nav-hover:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}