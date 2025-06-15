import { Button } from "@/components/ui/button";
import { fixedsys } from "@/lib/fonts";

export default function CreatePage(){
    return (
        <main className="bg-[url('/images/backgrounds/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center w-full h-screen">
            <div className={`${fixedsys.className} bg-card/40 w-full max-w-xl space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl">
                    Balance: 0
                    </h2>
                </div>

                <div className="bg-card/50 rounded-xl p-4 text-center shadow-md">
                    <p className="text-muted-foreground">
                    20000 SIM will be debited from your account and deposited into the
                    city safe. If you want to add funds to your account go to bridge.
                    </p>
                </div>

                <Button
                    className="w-full shadow-md"
                    size="lg"
                >
                    Create City
                </Button>
            </div>
        </main>
    );
}