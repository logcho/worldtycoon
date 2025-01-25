import * as React from "react";
import Image from "next/image";

import { FooterSection } from "./_components/footer";
import { HeroSection } from "./_components/hero";
import { RulesSection } from "./_components/rules";

const HomePage: React.FC = () => {
  return (
    <main className="h-dvh snap-y snap-mandatory overflow-y-auto scroll-smooth bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat *:pt-20">
      <div className="[background-image:radial-gradient(circle_at_center,rgba(0,0,0,0.4),rgba(0,0,0,0.2),rgba(0,0,0,0))]">
        <HeroSection />
        <Image
          src="/images/border_2.png"
          alt="border"
          width={1000}
          height={100}
          className="h-1.5 w-screen shadow-md"
        />
        <RulesSection />
        <Image
          src="/images/border_2.png"
          alt="border"
          width={1000}
          height={100}
          className="h-1.5 w-screen shadow-md"
        />
        <FooterSection />
      </div>
    </main>
  );
};

export default HomePage;
