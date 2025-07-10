"use client";

import Link from "next/link";
import Image from "next/image";
import { fixedsys } from "@/lib/fonts";
import FooterSection from "./_components/footer"
import Border from "./_components/border";
export default function Learn() {
  return (
    <main
      style={{
        backgroundImage: "url(/images/tilesets/micropolis_tiles.png)",
        backgroundRepeat: "repeat",
      }}
    >
      <div className={`${fixedsys.className} pt-24 p-12 text-[#babec7] bg-[#151515]/90 mx-auto max-w-7xl`}>
        <h1 className="text-4xl md:text-5xl mb-10 uppercase text-yellow-400">How to Play</h1>

        {/* Intro Section */}
        <section className="mb-16 text-xl leading-relaxed space-y-4">
          <p>
            Welcome to <strong>World Tycoon</strong> — a decentralized city simulator where every decision shapes your blockchain-based metropolis.
          </p>
          <p>
            You’ll build a thriving city using tools from the <strong>toolbox</strong>. Each tool corresponds to a building type — residential, commercial, industrial, and more.
          </p>
          <p>
            Every time you place a tool, approximately <strong>one month of in-game time passes</strong>. Over time, your city evolves, demands services, and generates revenue.
          </p>
        </section>

        {/* ⚡ Power Requirement Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">⚡</span>
            <h2 className="text-3xl text-white uppercase">Power Grid</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>All buildings require power to function.</li>
            <li>Be sure to connect power sources using wires.</li>
            <li>If a zone loses electricity, it may stop working entirely.</li>
          </ul>
        </section>

        {/* ⏳ Time & Simulation Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">⏳</span>
            <h2 className="text-3xl text-white uppercase">Time & Simulation</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Use <strong>Sim Tick</strong> in the Game Bar to manually advance time.</li>
            <li>Each tick updates population, tax collection, and public service funding.</li>
            <li>Every new <strong>game year</strong>, taxes are collected and funds are paid to fire, police, and roads.</li>
          </ul>
        </section>

        {/* 🧱 Tools & Buildings Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Image src="/images/tools/power_tool.png" alt="Tools icon" width={32} height={32} />
            <h2 className="text-3xl text-white uppercase">Buildings & Tools</h2>
          </div>

          <p className="text-lg mb-6">Each tool shapes your city in different ways. Here&apos;s what each one does:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Residential", img: "/images/tools/r_tool.png", desc: "Build homes for citizens." },
              { name: "Commercial", img: "/images/tools/commercial.png", desc: "Create retail and business zones." },
              { name: "Industrial", img: "/images/tools/industrial.png", desc: "Generate jobs and production facilities." },
              { name: "Police", img: "/images/tools/police.png", desc: "Provide public safety and reduce crime." },
              { name: "Fire", img: "/images/tools/fire.png", desc: "Protect your city from disasters." },
              { name: "Roads", img: "/images/tools/road.png", desc: "Connect zones and enable traffic flow." },
            ].map((tool) => (
              <div key={tool.name} className="bg-[#1f1f1f] p-4 rounded-lg shadow-md text-center">
                <Image src={tool.img} alt={tool.name} width={64} height={64} className="mx-auto mb-2" />
                <h3 className="text-xl font-bold text-yellow-300 uppercase">{tool.name}</h3>
                <p className="text-sm text-[#aaa]">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔗 On-Chain Gameplay Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">🔗</span>
            <h2 className="text-3xl text-white uppercase">On-Chain Gameplay</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Each tool placement is a transaction. You’ll sign it with your wallet.</li>
            <li>Your city is recorded entirely on-chain — transparent, persistent, and verifiable.</li>
          </ul>
        </section>

        {/* 📐 Blueprint Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl">📐</span>
            <h2 className="text-3xl text-white uppercase">Blueprints</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Blueprint mode lets you plan your entire build layout ahead of time.</li>
            <li>Submit all changes in one batch — reducing friction and signature fatigue.</li>
            <li>Ideal for rapid expansion or high-efficiency city planning.</li>
          </ul>
        </section>

        {/* 🚧 Closing Section */}
        <section className="text-lg">
          <p className="mb-4">
            Ready to break ground? Head to the{" "}
            <Link href="/" className="text-yellow-400 underline">
              Home page
            </Link>{" "}
            and start building your legacy.
          </p>
          <p>
            🚧 Every city is unique. Every decision is permanent. Welcome to Micropolis — on-chain and unstoppable.
          </p>
        </section>
      </div>
      <Border />
      <FooterSection />
    </main>
  );
}
