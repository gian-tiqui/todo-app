"use client";
import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const PageTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large productivity-themed gradient orb */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>

        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-18 animate-pulse delay-2000"></div>

        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float"></div>

        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-r from-slate-600 to-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>

        <div className="absolute top-3/4 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-12 animate-float delay-3000"></div>

        <div className="absolute top-1/2 right-1/6 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1500"></div>
      </div>

      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none bg-noise"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 min-h-screen">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

export default PageTemplate;
