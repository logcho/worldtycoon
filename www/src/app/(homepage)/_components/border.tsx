import Image from "next/image"

export default function Border() {
    return (
        <Image
            src="/images/borders/border.png"
            alt="border"
            width={1000}
            height={100}
            className="h-1.5 w-screen shadow-md"
        />
    )
}