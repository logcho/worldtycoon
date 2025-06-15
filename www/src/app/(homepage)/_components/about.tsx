import { fixedsys } from "@/lib/fonts";
export default function AboutSection(){
    return (
        <section className="bg-[url('/images/backgrounds/bg2.png')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center w-full h-screen">
            <div className="container flex w-full grow flex-col gap-6 px-10 pt-24">
                <h1 className={`${fixedsys.className} border-b-2 border-b-yellow-500 pb-2 text-3xl text-yellow-500 [text-shadow:_2px_4px_0_#000] md:text-4xl`}>
                    Our Mission
                </h1>
                <div
                    className="animate-in slide-in-from-left-1/2 m-auto h-fit w-full max-w-4xl space-y-2 rounded-[2rem] bg-[#151515]/80 p-2 backdrop-blur-xs duration-700 md:space-y-4 md:p-6"
                    style={{
                        border: "16px solid transparent",
                        borderImage: "url('/images/borders/border_2.png') 16 stretch",
                    }}
                >
                    <div className={`${fixedsys.className} text-sm text-gray-300 md:text-lg`}>
                        World Tycoon represents a revolutionary fusion of traditional
                        city-building gameplay with blockchain technology, creating an
                        ecosystem where your strategic decisions have real-world value.{" "}
                        <p className="py-2" />
                        Our mission is to empower players by providing a platform where
                        gaming expertise translates into tangible rewards. Through
                        Cartesi's advanced blockchain infrastructure, we've
                        created a decentralized gaming experience that maintains the depth
                        and engagement of classic city simulators while introducing
                        innovative economic mechanics. 
                        <p className="py-2" />
                        We believe in a future where gaming transcends entertainment,
                        becoming a legitimate avenue for wealth creation and economic
                        participation. By combining immersive gameplay with cryptocurrency
                        integration, we're building more than just a game - we're
                        creating an ecosystem where players can truly own their achievements
                        and trade their success. 
                        <p className="py-2" />
                        Join us in revolutionizing the gaming industry by being part of a
                        community where strategic thinking, resource management, and city
                        planning skills can lead to real-world prosperity. Welcome to the
                        future of gaming - welcome to World Tycoon.
                    </div>
                </div>
            </div>
        </section>
    );
}