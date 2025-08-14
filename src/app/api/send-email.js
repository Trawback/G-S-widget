// pages/api/send-email.js (o app/api/send-email/route.js si usas App Router)
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { formData } = req.body;

  // Configurar transporter para Gmail Workspace
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // contraseña de aplicación
    },
  });

  try {
    // Generar el contenido HTML del resumen
    const generateSummaryHTML = (data) => {
      const selectedVariant = data.vehiculoSeleccionado?.variants ? 
        data.vehiculoSeleccionado.variants[0] : null;
      
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
          <div style="background: black; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <img src="https://your-domain.com/logodorado (1).png" alt="Godandi & Sons" style="height: 60px; margin-bottom: 20px;" />
            <h1 style="color: #ebc651; margin: 0;">Luxury Chauffeur Service</h1>
            <p style="color: #ccc; margin: 10px 0 0 0;">Reservation Confirmation</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #333; border-bottom: 2px solid #ebc651; padding-bottom: 10px;">Reservation Details</h2>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #ebc651; margin-bottom: 10px;">👤 Client Information</h3>
              <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${data.nombre}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${data.telefono}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${data.email}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #ebc651; margin-bottom: 10px;">🚗 Service Details</h3>
              <p style="margin: 5px 0; color: #333;"><strong>Service Type:</strong> ${data.tipoServicio}${data.tipoServicio === 'Hourly' ? ` (${data.hourlyHours} hours)` : ''}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Date:</strong> ${data.fecha}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Time:</strong> ${data.hora}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #ebc651; margin-bottom: 10px;">📍 Route Information</h3>
              <p style="margin: 5px 0; color: #333;"><strong>Pickup:</strong> ${data.puntoRecogida}</p>
              ${data.stops && data.stops.length > 0 ? `<p style="margin: 5px 0; color: #333;"><strong>Stops:</strong> ${data.stops.join(', ')}</p>` : ''}
              <p style="margin: 5px 0; color: #333;"><strong>Destination:</strong> ${data.puntoDestino}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #ebc651; margin-bottom: 10px;">🚙 Selected Vehicle</h3>
              <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; border-left: 4px solid #ebc651;">
                <p style="margin: 5px 0; color: #333; font-size: 18px;"><strong>${data.vehiculoSeleccionado?.nombre}</strong></p>
                <p style="margin: 5px 0; color: #666;">${data.vehiculoSeleccionado?.capacidad}</p>
                <p style="margin: 5px 0; color: #666;">${data.vehiculoSeleccionado?.descripcion}</p>
                <p style="margin: 5px 0; color: #ebc651; font-weight: bold;">${data.vehiculoSeleccionado?.precio}</p>
                ${data.vehiculoSeleccionado?.features ? `<p style="margin: 10px 0 5px 0; color: #666;"><strong>Features:</strong> ${data.vehiculoSeleccionado.features.join(', ')}</p>` : ''}
              </div>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background: #ebc651; border-radius: 8px; text-align: center;">
              <h3 style="color: black; margin: 0 0 10px 0;">Next Steps</h3>
              <p style="color: black; margin: 0;">We will contact you within 24 hours to confirm your reservation and provide your quote.</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
              <p>Godandi & Sons - Luxury Chauffeur Service</p>
              <p>Discreet. Punctual. Tailored.</p>
              <p style="margin-top: 10px;">This reservation was submitted on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      `;
    };

    const summaryHTML = generateSummaryHTML(formData);

    // Email para el cliente (confirmación)
    const clientMailOptions = {
      from: process.env.GMAIL_USER,
      to: formData.email,
      subject: '✅ Reservation Confirmed - Godandi & Sons Luxury Chauffeur',
      html: summaryHTML,
    };

    // Email para ti (notificación de nueva reserva)
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER, // tu email administrativo
      subject: `🚗 New Reservation - ${formData.nombre} - ${formData.fecha} ${formData.hora}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>🚨 NEW RESERVATION RECEIVED</h1>
            <p style="margin: 0;">A new luxury chauffeur service reservation has been submitted</p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border: 2px solid #f59e0b;">
            <h2 style="color: #92400e; margin-top: 0;">⚡ PRIORITY ACTION REQUIRED</h2>
            <p style="color: #92400e; font-weight: bold;">Contact client within 24 hours to confirm and quote</p>
          </div>
          
          ${summaryHTML}
          
          <div style="background: #1f2937; color: white; padding: 20px; margin-top: 20px;">
            <h3>📞 Quick Actions</h3>
            <p><strong>Call:</strong> <a href="tel:${formData.telefono}" style="color: #ebc651;">${formData.telefono}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}" style="color: #ebc651;">${formData.email}</a></p>
          </div>
        </div>
      `,
    };

    // Enviar ambos emails
    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    
    res.status(200).json({ 
      success: true, 
      message: 'Reservation emails sent successfully to both client and admin' 
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending reservation emails', 
      error: error.message 
    });
  }
}