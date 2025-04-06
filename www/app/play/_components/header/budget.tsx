"use client";
import { FC, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Hex, stringToHex } from "viem";
import { Button } from "~/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
 } from "~/components/ui/dialog";
 import { Card, CardContent } from "~/components/ui/card"
import { Slider } from "~/components/ui/slider"
import { Input } from "~/components/ui/input"
 type BudgetProps = {
    cityTax: number,
    cashFlow: number,
    funds: number,
    taxFund: number,
    roadPercent: number,
    roadFund: number,
    firePercent: number,
    fireFund: number,
    policePercent: number,
    policeFund: number, 
    loading?: boolean;
    setInput?: (input: Hex) => void;
    write?: () => void;
    setIsOpen: (input: boolean) => void;
    isOpen: boolean;
}
// Time units in the game engine
const CITYTIMES_PER_MONTH = 4;
const CITYTIMES_PER_YEAR = CITYTIMES_PER_MONTH * 12;

export const Budget: FC<BudgetProps> = ({
    cityTax,
    cashFlow,
    funds,
    taxFund,
    roadPercent,
    roadFund,
    firePercent,
    fireFund,
    policePercent,
    policeFund,
    loading,
    setInput,
    write,
    setIsOpen,
    isOpen
}) => {
    const [tax, setTax] = useState(cityTax);
    const [rp, setRP] = useState(roadPercent);
    const [fp, setFP] = useState(firePercent);
    const [pp, setPP] = useState(policePercent);

    // Divide percentages by 100
    useEffect(() => {
        if(setInput && isOpen){
            setInput(
                stringToHex(
                    `{"method": "doBudget", "roads": ${rp / 100}, "fire": ${fp / 100}, "police": ${pp / 100}, "tax": ${tax}}`
                )
            )
        }
    }, [tax, rp, fp, pp])

    
    return (
        <div className="font-fixedsys">
            <Dialog 
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                    setTax(cityTax);
                    setRP(roadPercent);
                    setFP(firePercent);
                    setPP(policePercent);
                    }
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        className="bg-muted text-white text-xl"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        Budget
                    </Button>
                </DialogTrigger>
                <DialogContent className="font-fixedsys">
                    <DialogHeader>
                    <DialogTitle>Edit Budget</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <p>Tax Collected: ${taxFund}</p>
                        <p>Cashflow: ${cashFlow}</p>
                        <p>Current Funds: ${funds}</p>
                        <p>Collected Funds: ${funds + taxFund}</p>

                        <Card className="bg-black text-white col-span-1">
                            <CardContent className="p-2 space-y-2">
                            <p>Roads</p>
                            <Slider value={[rp]} onValueChange={setRP} max={100} step={1} />
                            <p>{rp}% of ${roadFund} = ${(rp / 100) * roadFund}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black text-white col-span-1">
                            <CardContent className="p-2 space-y-2">
                            <p>Fire</p>
                            <Slider value={[fp]} onValueChange={setFP} max={100} step={1} />
                            <p>{fp}% of ${fireFund} = ${(fp / 100) * fireFund}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black text-white col-span-1">
                            <CardContent className="p-5 space-y-4">
                            <p>Police</p>
                            <Slider value={[pp]} onValueChange={setPP} max={100} step={1} />
                            <p>{pp}% of ${policeFund} = ${(pp / 100) * policeFund}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-black text-white col-span-1">
                            <CardContent className="p-5 space-y-4">
                            <p>Tax</p>
                            <Slider value={[tax]} onValueChange={setTax} max={100} step={1} />
                            <p>Tax rate: {tax}%</p>
                            </CardContent>
                        </Card>

                        <Button onClick={() => {write && write()}} disabled={loading}>
                            {loading ? "Loading..." : "Confirm"}
                        </Button>

                        <DialogTrigger asChild>
                            <Button 
                                disabled={loading}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                Okay
                            </Button>
                        </DialogTrigger>
                       

                    </div>

                    

                </DialogContent>
            </Dialog>
        </div>
        
    )
    // return (
    //     <div
    //         className="font-fixedsys"
    //     >
            
    //         { visible && (
    //             <div>
    //                 Hello World
    //             </div>    
    //         )}
    //     </div>
    // )
};
