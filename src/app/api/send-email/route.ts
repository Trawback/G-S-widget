import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 👇 Asegura runtime Node para que Nodemailer funcione en Vercel
export const runtime = 'nodejs';

// Types
interface VehicleSelected {
  id: number;
  nombre: string;
  capacidad: string;
  descripcion?: string;
  precio?: string;
  imagen?: string; // puede venir como "/images/cars/sedan.png" o URL absoluta
  categoria?: 'Sedan' | 'SUV' | 'Sprinter' | 'Bus' | 'Electric' | 'Van';
  features?: string[];
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  fuelEfficiency?: string;
  gallery?: string[];
}

interface ReservationData {
  nombre: string;
  telefono: string;
  email: string;
  tipoServicio: string | null;
  hourlyHours: number;
  fecha: string;
  hora: string;
  puntoRecogida: string;
  stops: string[];
  puntoDestino: string;
  vehiculoSeleccionado: VehicleSelected | null;
  phoneCountryCode?: string;
  phoneLocal?: string;
}

interface EmailBody {
  summary?: string;
  userEmail?: string;
  subject?: string;
  clientName?: string;
  formData?: ReservationData;
}

// Helper: resuelve URL absoluta a assets
function makeAbsolute(urlOrPath: string | undefined, base: string): string | undefined {
  if (!urlOrPath) return undefined;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  // normaliza doble slash
  const u = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
  return `${base}${u}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmailBody = await req.json();
    const { summary, userEmail, subject, clientName, formData } = body || {};

    // 1) Base público de assets (usa el dominio que SÍ sirve /public)
    //    Recomiendo setear en Vercel: NEXT_PUBLIC_ASSETS_URL="https://TU-DOMINIO.com"
    const host = req.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.startsWith('127.');
    const fallbackBase = `${isLocal ? 'http' : 'https'}://${host}`;
    const ASSETS_BASE = process.env.NEXT_PUBLIC_ASSETS_URL || fallbackBase;

    const logoAbs = makeAbsolute('/Logo_icon.png', ASSETS_BASE);
    const carAbs = makeAbsolute(formData?.vehiculoSeleccionado?.imagen, ASSETS_BASE);

    // 2) Transporter (Gmail + App Password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 3) HTML con CID (logo/car)
    const buildSummaryHTML = (data: ReservationData | undefined, fallbackSummary?: string): string => {
      if (!data) {
        return `<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;background:#f8f9fa;padding:20px;border-radius:8px;">${fallbackSummary ?? 'No details provided'}</pre>`;
      }

      const features = Array.isArray(data.vehiculoSeleccionado?.features)
        ? (data.vehiculoSeleccionado?.features as string[]).join(', ')
        : '';

      return `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Luxury Chauffeur Service Reservation</title></head>
        <body style="margin:0;padding:0;background-color:#f6f6f6;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f6f6f6;padding:20px 0;">
            <tr>
              <td align="center" style="padding:20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background-color:#000000;padding:30px 25px;text-align:center;">
                      <img src="cid:logo" alt="Godandi & Sons" style="height:60px;display:block;margin:0 auto 15px auto;border-radius:8px;" />
                      <h1 style="margin:0;color:#ebc651;font-size:24px;font-weight:bold;letter-spacing:.5px;">Quote confirmation</h1>
                      <div style="margin:15px 0;color:#d1d5db;font-size:12px;line-height:1.4;">
                        <p style="margin:5px 0;color:#ebc651;font-weight:500;">215 Lorenzo Boturini Transito Ciudad de México 06820 MX</p>
                        <p style="margin:5px 0;">United States Office: +1 888-462-1424</p>
                        <p style="margin:5px 0;">Mexico City Office: +52.55.5989.8000</p>
                        <p style="margin:5px 0;">US WhatsApp +1.808.647.1416</p>
                        <p style="margin:5px 0;">info@godandiandsons.com</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:30px 25px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:25px;">
                        <tr>
                          <td valign="top" width="48%" style="padding-right:10px;">
                            <div style="background-color:#f8f9fa;border:2px solid #ebc651;border-radius:10px;padding:20px;text-align:center;">
                              <h3 style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Client Information</h3>
                              <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Name:</strong> ${data?.nombre ?? ''}</p>
                              <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Phone:</strong> ${data?.telefono ?? ''}</p>
                              <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Email:</strong> ${data?.email ?? ''}</p>
                            </div>
                          </td>
                          <td valign="top" width="48%" style="padding-left:10px;">
                            <div style="background-color:#f8f9fa;border:2px solid #ebc651;border-radius:10px;padding:20px;text-align:center;">
                              <h3 style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Service Details</h3>
                              <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Type:</strong> ${data?.tipoServicio ?? ''}${data?.tipoServicio === 'Hourly' ? ` (${data?.hourlyHours} hours)` : ''}</p>
                              <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Date:</strong> ${data?.fecha ?? ''}</p>
                              <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Time:</strong> ${data?.hora ?? ''}</p>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <div style="background-color:#f8f9fa;border:2px solid #ebc651;border-radius:10px;padding:20px;margin-bottom:25px;text-align:center;">
                        <h3 style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Route Information</h3>
                        <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Pickup:</strong> ${data?.puntoRecogida ?? ''}</p>
                        ${data?.stops && data.stops.length > 0 ? `<p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Stops:</strong> ${data.stops.join(', ')}</p>` : ''}
                        <p style="margin:8px 0;color:#374151;font-size:14px;"><strong style="color:#ebc651;">Drop-off:</strong> ${data?.puntoDestino ?? ''}</p>
                      </div>

                      <div style="background-color:#f8f9fa;border:2px solid #ebc651;border-radius:10px;padding:20px;margin-bottom:25px;text-align:center;">
                        <h3 style="margin:0 0 15px 0;color:#000000;font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Selected Vehicle</h3>
                        ${carAbs ? `
                          <div style="margin-bottom:20px;">
                            <img src="cid:car" alt="${data?.vehiculoSeleccionado?.nombre ?? 'Vehicle'}" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);" />
                          </div>
                        ` : ''}
                        <p style="margin:8px 0;color:#000000;font-size:18px;font-weight:bold;">${data?.vehiculoSeleccionado?.nombre ?? ''}</p>
                        <p style="margin:8px 0;color:#6b7280;font-size:14px;">${data?.vehiculoSeleccionado?.capacidad ?? ''}</p>
                        ${data?.vehiculoSeleccionado?.descripcion ? `<p style="margin:8px 0;color:#6b7280;font-size:14px;">${data.vehiculoSeleccionado.descripcion}</p>` : ''}
                        <p style="margin:15px 0 8px 0;color:#ebc651;font-size:20px;font-weight:bold;text-transform:uppercase;">${data?.vehiculoSeleccionado?.precio ?? ''}</p>
                        ${features ? `<p style="margin:8px 0;color:#6b7280;font-size:14px;"><strong style="color:#ebc651;">Features:</strong> ${features}</p>` : ''}
                      </div>

                      <p style="margin:25px 0 0 0;color:#6b7280;font-size:12px;text-align:center;font-style:italic;">Submitted on ${new Date().toLocaleString()}</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color:#000000;padding:20px 25px;text-align:center;color:#9ca3af;">
                      <img src="cid:logo" alt="Godandi & Sons" style="height:30px;display:block;margin:0 auto 10px auto;opacity:.9;border-radius:6px;" />
                      <p style="margin:8px 0 0 0;font-size:14px;font-weight:500;">Godandi & Sons</p>
                      <p style="margin:5px 0 0 0;font-size:12px;color:#ebc651;font-style:italic;">Discreet. Punctual. Tailored.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    };

    const clientTo = userEmail || formData?.email;
    if (!clientTo) {
      return NextResponse.json({ success: false, message: 'Missing user email' }, { status: 400 });
    }

    const html: string = formData
      ? buildSummaryHTML(formData)
      : `<pre style="white-space:pre-wrap;font-family:Arial,sans-serif;background:#f8f9fa;padding:20px;border-radius:8px;">${summary ?? 'Reservation details not available'}</pre>`;

    const emailSubject: string = subject || `New Luxury Transport Reservation - ${clientName ?? formData?.nombre ?? ''}`;

    // 4) Adjuntos inline (CID). Nodemailer acepta URL pública en "path".
    const attachments = [
      logoAbs ? { filename: 'logo.png', path: logoAbs, cid: 'logo' } : undefined,
      carAbs ? { filename: 'vehicle.png', path: carAbs, cid: 'car' } : undefined,
    ].filter(Boolean) as Array<{ filename: string; path: string; cid: string }>;

    // 5) Enviar (cliente)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: clientTo,
      subject: '✅ Reservation Confirmed - Godandi & Sons Luxury Chauffeur',
      html,
      attachments, // <-- imprescindible
    });

    // 6) Enviar (admin)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: emailSubject,
      html,
      attachments, // <-- también para que el admin vea las imágenes
    });

    return NextResponse.json({ success: true, message: 'Emails sent' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Email API error:', message);
    return NextResponse.json({ success: false, message: 'Email send failed', error: message }, { status: 500 });
  }
}
