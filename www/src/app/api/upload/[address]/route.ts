// app/api/upload-map/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { hexToNumber } from "viem";

const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = process.env.PINATA_API_KEY_SECRET!;
const INSPECT_URL = process.env.INSPECT_URL || "http://localhost:8080/inspect";


// Helper: Fetch map and funds from inspect
async function getMapFunds(address: string) {
  const inspectUrl = `${INSPECT_URL}/{"method":"getMapFunds","address":"${address}"}`;

  const res = await fetch(inspectUrl);
  if (!res.ok) throw new Error("Failed to fetch");

  const json = await res.json();
  const map = json?.reports?.[0]?.payload;
  const funds = json?.reports?.[1]?.payload;
  console.log("Map", map);
  console.log("Funds", funds);

  if (!map || !funds) return undefined;

  return { map, funds };
}

// Helper: Upload file to Pinata
async function uploadToPinata(file: Blob, name: string) {
  const formData = new FormData();
  formData.append("file", file, `${name}.png`);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

// Helper: Upload metadata JSON to Pinata
async function uploadMetadata(metadata: any) {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}

export async function POST(req: Request, context: any) {
  try {

    const formData = await req.formData();

    const file = formData.get("file") as Blob;

    const { params } = await context;
    
    const address = params.address;

    if (!address) {
      return NextResponse.json({ success: false, error: "No address provided" }, { status: 400 });
    }

    const mapFunds = await getMapFunds(address);

    if (!mapFunds) {
      return NextResponse.json({ success: false, error: `No city/funds found ${address} ${mapFunds}` }, { status: 401 });
    }

    const imageUrl = await uploadToPinata(file, `city`);


    const metadata = {
      name: `World Tycoon City`,
      description: "This NFT represents the user's city.",
      image: imageUrl,
      funds: hexToNumber(mapFunds.funds),
    };

    const metadataUrl = await uploadMetadata(metadata);

    return NextResponse.json({ success: true, metadataUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
