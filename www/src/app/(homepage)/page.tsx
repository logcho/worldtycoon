import HeroSection from "./_components/hero";
import Border from "./_components/border";
import AboutSection from "./_components/about";
import RulesSection from "./_components/rules";
import FooterSection from "./_components/footer";
export default function Home() {
  return (
    <main className="h-dvh snap-y snap-mandatory overflow-y-auto scroll-smooth bg-[url('/images/backgrounds/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="[background-image:radial-gradient(circle_at_center,rgba(0,0,0,0.4),rgba(0,0,0,0.2),rgba(0,0,0,0))] flex flex-col items-center justify-center">
        <HeroSection />
        <Border />
        <RulesSection />
        <Border />
        <AboutSection />
        <Border />
        <FooterSection />
      </div>
    </main>
  );
}
