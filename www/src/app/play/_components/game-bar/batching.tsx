"use client";

import { fixedsys } from "@/lib/fonts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { PlacedSprite } from "../stage-area";

export default function Batching({
        batching, 
        setBatching, 
        loading, 
        write,
        setPlacedSprites,
    }
    : 
    {
        batching: boolean, 
        setBatching: (batching: boolean) => void, 
        loading: boolean, 
        write: () => void,
        setPlacedSprites: React.Dispatch<React.SetStateAction<PlacedSprite[]>>,
    }){
    return (
        <div className={`${fixedsys.className}`}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        className={`bg-blue-400 text-xl text-white relative ${
                        batching ? "ring-4 ring-yellow-300 ring-offset-2" : ""
                        }`}
                    >
                        Blueprint
                    </Button>
                </DialogTrigger>
                <DialogContent className={`${fixedsys.className} bg-blue-400`}>
                    <DialogHeader>
                        <DialogTitle>Blueprint</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-white">
                        Blueprint your city and batch your inputs! After you finish blueprinting, all buildings placed will be built in the order they were placed... only if you can afford it.
                    </DialogDescription>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-white">
                            Start Blueprint
                            <Switch
                            id="batching-toggle"
                            checked={batching}
                            onCheckedChange={setBatching}
                            />
                        </div>
                        <Button 
                            className="bg-yellow-400"
                            onClick={() => setPlacedSprites([])}
                        >
                            Clear
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Button 
                            onClick={() => {
                                write();
                                setPlacedSprites([]);
                            }} 
                            disabled={loading}
                        >
                        {loading ? "Loading..." : "Build"}
                        </Button>

                        <DialogTrigger asChild>
                            <Button disabled={loading}>
                                Okay
                            </Button>
                        </DialogTrigger>
                    </div>



                </DialogContent>
            </Dialog>
        </div>
    )
}