import { NextResponse } from 'next/server';

// Basic shape of the reservation payload sent by the widget
interface Vehiculo {
  id: number;
  nombre: string;
  capacidad: string;
  descripcion: string;
  precio: string;
  imagen: string;
}

interface ReservaBody {
  nombre: string;
  telefono: string;
  email: string;
  tipoServicio: string[];
  fecha: string;
  hora: string;
  puntoRecogida: string;
  stops: string[];
  puntoDestino: string;
  vehiculoSeleccionado: Vehiculo | null;
}

function isValidReserva(body: unknown): body is ReservaBody {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Partial<ReservaBody>;
  if (
    typeof b.nombre !== 'string' ||
    typeof b.telefono !== 'string' ||
    typeof b.email !== 'string' ||
    !Array.isArray(b.tipoServicio) ||
    typeof b.fecha !== 'string' ||
    typeof b.hora !== 'string' ||
    typeof b.puntoRecogida !== 'string' ||
    typeof b.puntoDestino !== 'string' ||
    !Array.isArray(b.stops)
  ) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidReserva(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Airtable and/or email notifications here
    // For now, just acknowledge success to unblock the UI and build.
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}

export async function GET() {
  // Simple health-check endpoint
  return NextResponse.json({ ok: true });
}
