import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Types
interface VehicleSelected {
	id: number;
	nombre: string;
	capacidad: string;
	descripcion?: string;
	precio?: string;
	imagen?: string;
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

export async function POST(req: NextRequest) {
	try {
		const body: EmailBody = await req.json();
		const { summary, userEmail, subject, clientName, formData } = body || {};

		// Resolve absolute base URL for assets (logo)
		const host = req.headers.get('host') || '';
		const isLocal = host.includes('localhost') || host.startsWith('127.');
		const protocol = isLocal ? 'http' : 'https';
		const baseUrl = `${protocol}://${host}`;
		const logoUrl = `${baseUrl}/${encodeURI('logodorado (1).png')}`;

		// Transporter (Gmail example)
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_APP_PASSWORD,
			},
		});

		const buildSummaryHTML = (data: ReservationData | undefined, fallbackSummary?: string): string => {
			if (!data) {
				return `<pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;">${fallbackSummary ?? 'No details provided'}</pre>`;
			}

			const brandGold = '#ebc651';
			const brandBlack = '#000000';
			const brandGray = '#f6f6f6';
			const textDark = '#111827';
			const textMuted = '#6b7280';

			const features = Array.isArray(data.vehiculoSeleccionado?.features)
				? (data.vehiculoSeleccionado?.features as string[]).join(', ')
				: '';

			return `
				<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${brandGray};padding:24px 0;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
					<tr>
						<td align="center">
							<table role="presentation" cellpadding="0" cellspacing="0" width="680" style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
								<tr>
									<td style="background:${brandBlack};padding:28px 24px;text-align:center;">
										<img src="${logoUrl}" alt="Godandi & Sons" style="height:64px;display:block;margin:0 auto 12px auto;" />
										<h1 style="margin:8px 0 0 0;color:${brandGold};font-size:22px;letter-spacing:0.4px;">Luxury Chauffeur Service</h1>
										<p style="margin:6px 0 0 0;color:#d1d5db;font-size:13px;">Reservation Confirmation</p>
									</td>
								</tr>
								<tr>
									<td style="padding:24px 24px 8px 24px;">
										<h2 style="margin:0 0 16px 0;color:${textDark};font-size:18px;border-bottom:2px solid ${brandGold};padding-bottom:10px;">Reservation Details</h2>
										<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
											<tr>
												<td valign="top" width="50%" style="padding-right:8px;">
													<div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;">
														<h3 style="margin:0 0 8px 0;color:${textDark};font-size:14px;">Client</h3>
														<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Name:</strong> ${data?.nombre ?? ''}</p>
														<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Phone:</strong> ${data?.telefono ?? ''}</p>
														<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Email:</strong> ${data?.email ?? ''}</p>
													</div>
												</td>
												<td valign="top" width="50%" style="padding-left:8px;">
													<div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;">
														<h3 style="margin:0 0 8px 0;color:${textDark};font-size:14px;">Service</h3>
														<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Type:</strong> ${data?.tipoServicio ?? ''}${data?.tipoServicio === 'Hourly' ? ` (${data?.hourlyHours} hours)` : ''}</p>
														<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Date:</strong> ${data?.fecha ?? ''}</p>
														<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Time:</strong> ${data?.hora ?? ''}</p>
													</div>
												</td>
											</tr>
										</table>
										<div style="margin-top:12px;background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;">
											<h3 style="margin:0 0 8px 0;color:${textDark};font-size:14px;">Route</h3>
											<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Pickup:</strong> ${data?.puntoRecogida ?? ''}</p>
											${data?.stops && data.stops.length ? `<p style=\"margin:4px 0;color:${textMuted};font-size:13px;\"><strong>Stops:</strong> ${data.stops.join(', ')}</p>` : ''}
											<p style="margin:4px 0;color:${textMuted};font-size:13px;"><strong>Drop-off:</strong> ${data?.puntoDestino ?? ''}</p>
										</div>

										<div style="margin-top:12px;background:#fafafa;border:1px solid #eee;border-radius:10px;padding:14px;">
											<h3 style="margin:0 0 8px 0;color:${textDark};font-size:14px;">Selected Vehicle</h3>
											<p style="margin:4px 0;color:${textDark};font-size:16px;"><strong>${data?.vehiculoSeleccionado?.nombre ?? ''}</strong></p>
											<p style="margin:4px 0;color:${textMuted}">${data?.vehiculoSeleccionado?.capacidad ?? ''}</p>
											${data?.vehiculoSeleccionado?.descripcion ? `<p style=\"margin:4px 0;color:${textMuted}\">${data.vehiculoSeleccionado.descripcion}</p>` : ''}
											<p style="margin:6px 0;color:${brandGold};font-weight:700;">${data?.vehiculoSeleccionado?.precio ?? ''}</p>
											${features ? `<p style=\"margin:6px 0;color:${textMuted}\"><strong>Features:</strong> ${features}</p>` : ''}
										</div>

										<div style="margin-top:16px;text-align:center;">
											<a href="mailto:${data?.email ?? ''}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:${brandGold};color:${brandBlack};text-decoration:none;font-weight:600;">Reply to confirm</a>
										</div>

										<p style="margin:18px 0 0 0;color:${textMuted};font-size:12px;text-align:center;">Submitted on ${new Date().toLocaleString()}</p>
									</td>
								</tr>
								<tr>
									<td style="background:${brandBlack};padding:16px 24px;text-align:center;color:#9ca3af;font-size:12px;">
										<img src="${logoUrl}" alt="Godandi & Sons" style="height:26px;display:block;margin:0 auto 8px auto;opacity:.9;" />
										<p style="margin:6px 0 0 0;">Godandi & Sons – Luxury Chauffeur Service</p>
										<p style="margin:4px 0 0 0;">Discreet. Punctual. Tailored.</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			`;
		};

		const clientTo = userEmail || formData?.email;
		if (!clientTo) {
			return NextResponse.json({ success: false, message: 'Missing user email' }, { status: 400 });
		}

		const html: string = formData ? buildSummaryHTML(formData, summary) : `<pre style="white-space:pre-wrap">${summary ?? 'Reservation'}</pre>`;
		const emailSubject: string = subject || `New Luxury Transport Reservation - ${clientName ?? formData?.nombre ?? ''}`;

		// Send email to client
		await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: clientTo,
			subject: '✅ Reservation Confirmed - Godandi & Sons Luxury Chauffeur',
			html,
		});

		// Send email to admin
		await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
			subject: emailSubject,
			html,
		});

		return NextResponse.json({ success: true, message: 'Emails sent' });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		console.error('Email API error:', message);
		return NextResponse.json({ success: false, message: 'Email send failed', error: message }, { status: 500 });
	}
} 