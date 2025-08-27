import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "Quotes";
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;

function mustEnv() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) {
    throw new Error("Missing Airtable env vars");
  }
}

function toISO(dateStr: string, hourStr: string) {
  const date = new Date(`${dateStr} ${hourStr}`);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid Date/Hour");
  }
  return date.toISOString();
}

function fingerprint(input: {
  email?: string;
  date?: string;
  hour?: string;
  pickup?: string;
  dropoff?: string;
  vehicle?: string;
}) {
  const base = [
    (input.email || "").trim().toLowerCase(),
    (input.date || "").trim(),
    (input.hour || "").trim(),
    (input.pickup || "").trim().toLowerCase(),
    (input.dropoff || "").trim().toLowerCase(),
    (input.vehicle || "").trim().toLowerCase(),
  ].join("|");
  return crypto.createHash("sha256").update(base).digest("hex");
}

async function airtableSearchByFingerprint(fp: string) {
  const formula = `FIND('${fp}',LOWER(CONCATENATE({Email},"|",{Date},"|",{Hour},"|",LOWER({Pickup Adress Data}),"|",LOWER({Drop off Adress Data}),"|",LOWER({Vehicle type}))))`;
  const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`);
  url.searchParams.set("filterByFormula", formula);
  
  // Debug logging
  console.log('🔍 Airtable Search Debug:');
  console.log('Base ID:', AIRTABLE_BASE_ID);
  console.log('Table:', AIRTABLE_TABLE);
  console.log('Full URL:', url.toString());
  console.log('Formula:', formula);
  
  const res = await fetch(url.toString(), { 
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }, 
    cache: "no-store" 
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Airtable API Error:', res.status, errorText);
    throw new Error(`Airtable search error: ${res.status} ${errorText}`);
  }
  
  const data = await res.json();
  return (data.records || []) as Array<{ id: string }>;
}

async function airtableCreate(fields: Record<string, any>) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  
  // Debug logging
  console.log('📝 Airtable Create Debug:');
  console.log('URL:', url);
  console.log('Fields being sent:', fields);
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Airtable Create Error:', res.status, errorText);
    throw new Error(`Airtable create error: ${res.status} ${errorText}`);
  }
  
  const data = await res.json();
  return data.records?.[0];
}

export async function POST(req: NextRequest) {
  try {
    mustEnv();
    const p = await req.json();

    // Extract data from request
    const passengerName = p.passengerName || p["Passenger Name"];
    const phone = p.phone || p["Phone"];
    const email = p.email || p["Email"];
    const serviceType = p.serviceType || p["Service Type"];
    const dateStr = p.date || p["Date"];
    const hourStr = p.hour || p["Hour"];
    const pickup = p.pickup || p["Pickup Adress Data"];
    const dropoff = p.dropoff || p["Drop off Adress Data"];
    const vehicle = p.vehicleType || p["Vehicle type"];

    // Validation
    if (!passengerName || !email || !dateStr || !hourStr || !pickup || !dropoff || !serviceType || !vehicle) {
      return NextResponse.json({ 
        ok: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Create fingerprint for duplicate detection
    const fp = fingerprint({ 
      email, 
      date: dateStr, 
      hour: hourStr, 
      pickup, 
      dropoff, 
      vehicle 
    });
    
    const dup = await airtableSearchByFingerprint(fp);
    if (dup.length > 0) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Map to Airtable fields
    const fields: Record<string, any> = {
      "Passenger Name": passengerName,
      "Phone": phone || "",
      "Email": email,
      "Service Type": serviceType,
      "Date": dateStr,
      "Hour": hourStr,
      "Pickup Adress Data": pickup,
      "Drop off Adress Data": dropoff,
      "Vehicle type": vehicle,
    };

    const rec = await airtableCreate(fields);
    return NextResponse.json({ 
      ok: true, 
      airtableId: rec.id 
    });
    
  } catch (e: any) {
    console.error("Quotes API error:", e);
    return NextResponse.json({ 
      ok: false, 
      error: e.message ?? "Server error" 
    }, { status: 500 });
  }
}
