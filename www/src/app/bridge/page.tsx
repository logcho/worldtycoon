"use client";

import BridgeTabs from "./_components/bridge-tabs";


export default function Bridge() {
  return (
    <main className="bg-[url('/images/backgrounds/bg.png')] bg-cover bg-center bg-no-repeat w-full h-screen custom-scroll">
        <div className="flex items-center justify-center w-full h-screen">
            <BridgeTabs />
        </div>
    </main>
  );
}

