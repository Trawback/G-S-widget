import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const reservationData = await request.json();
    
    // Por ahora solo logueamos los datos
    console.log('Datos de reserva recibidos:', reservationData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reserva procesada exitosamente' 
    });
  } catch (error) {
    console.error('Error procesando reserva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}