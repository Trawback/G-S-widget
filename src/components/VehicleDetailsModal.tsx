'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export type VehicleDetails = {
	id: number;
	nombre: string;
	capacidad: string;
	descripcion: string;
	precio: string;
	imagen: string;
	categoria: 'Sedan' | 'SUV' | 'Sprinter' | 'Bus' | 'Electric';
	features: string[];
	make?: string;
	model?: string;
	year?: number;
	engine?: string;
	fuelEfficiency?: string;
	gallery?: string[];
};

type VehicleDetailsModalProps = {
	vehicle: VehicleDetails;
	onClose: () => void;
	onSelect: (vehicle: VehicleDetails) => void;
	variants?: VehicleDetails[] | null;
	variantIdx?: number;
	onChangeVariant?: (idx: number) => void;
};

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicle, onClose, onSelect, variants = null, variantIdx = 0, onChangeVariant }) => {
	const closeBtnRef = useRef<HTMLButtonElement | null>(null);
	const gallery = useMemo(() => (vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.imagen]), [vehicle]);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % gallery.length);
			if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + gallery.length) % gallery.length);
		};
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [gallery.length, onClose]);

	useEffect(() => {
		closeBtnRef.current?.focus();
	}, []);

	const canSwitchVariant = !!variants && variants.length > 1 && !!onChangeVariant;
	const nextVariant = () => {
		if (!canSwitchVariant || !variants) return;
		const next = (variantIdx + 1) % variants.length;
		onChangeVariant?.(next);
	};
	const prevVariant = () => {
		if (!canSwitchVariant || !variants) return;
		const prev = (variantIdx - 1 + variants.length) % variants.length;
		onChangeVariant?.(prev);
	};

	return (
		<div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} />
			<div className="relative z-10 mx-auto w-full md:max-w-3xl lg:max-w-4xl h-[100svh] md:h-auto md:max-h-[90vh] mt-auto md:mt-12 rounded-t-2xl md:rounded-2xl overflow-y-auto md:overflow-hidden shadow-2xl bg-black animate-[fadeIn_300ms_ease-out]">
				<div className="relative w-full h-56 sm:h-64 md:h-96 bg-black">
					<Image
						src={gallery[index]}
						alt={vehicle.nombre}
						fill
						className="object-contain bg-black"
						priority
						sizes="(max-width: 768px) 100vw, 66vw"
					/>
					{gallery.length > 1 && (
						<>
							<button
								type="button"
								onClick={() => setIndex((i) => (i - 1 + gallery.length) % gallery.length)}
								className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/75"
								aria-label="Previous image"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								type="button"
								onClick={() => setIndex((i) => (i + 1) % gallery.length)}
								className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/75"
								aria-label="Next image"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
							<div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
								{gallery.map((_, i) => (
									<button
										key={i}
										onClick={() => setIndex(i)}
										className={`w-2 h-2 rounded-full ${i === index ? 'bg-black' : 'bg-black/30'} hover:bg-black`}
										aria-label={`Go to image ${i + 1}`}
									/>
								))}
							</div>
						</>
					)}
					{canSwitchVariant && (
						<>
							<button
								type="button"
								onClick={prevVariant}
								className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#ebc651]/50 text-black hover:bg-[#e3bb47]"
								aria-label="Previous vehicle"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								type="button"
								onClick={nextVariant}
								className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#ecb651]/50 text-black hover:bg-[#e3bb47]"
								aria-label="Next vehicle"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</>
					)}
					<button
						ref={closeBtnRef}
						type="button"
						onClick={onClose}
						className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/85"
						aria-label="Close"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				<div className="p-5 md:p-6 pb-8 text-white">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h3 id="vehicle-modal-title" className="text-xl md:text-2xl font-bold text-white">{vehicle.nombre}</h3>
							<p className="text-sm text-white">{vehicle.capacidad}</p>
						</div>
						<div className="flex items-center gap-2">
							<span className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-full bg-white/10 text-white border border-white/20">{vehicle.categoria}</span>
							<span className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-full bg-[#ebc651]/30 text-black border border-[#ebc651]">{vehicle.precio}</span>
						</div>
					</div>

					{(vehicle.make || vehicle.model || vehicle.year || vehicle.engine || vehicle.fuelEfficiency) && (
						<div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-white">
							{vehicle.make && (
								<div><span className="text-white/60">Make</span><div className="font-medium text-white">{vehicle.make}</div></div>
							)}
							{vehicle.model && (
								<div><span className="text-white/60">Model</span><div className="font-medium text-white">{vehicle.model}</div></div>
							)}
							{vehicle.year && (
								<div><span className="text-white/60">Year</span><div className="font-medium text-white">{vehicle.year}</div></div>
							)}
							{vehicle.engine && (
								<div className="col-span-2 md:col-span-1"><span className="text-white/60">Engine</span><div className="font-medium text-white">{vehicle.engine}</div></div>
							)}
							{vehicle.fuelEfficiency && (
								<div><span className="text-white/60">Fuel</span><div className="font-medium text-white">{vehicle.fuelEfficiency}</div></div>
							)}
						</div>
					)}

					{vehicle.descripcion && (
						<p className="mt-4 text-sm text-white/90">{vehicle.descripcion}</p>
					)}

					{vehicle.features && vehicle.features.length > 0 && (
						<div className="mt-4">
							<h4 className="text-sm font-semibold text-white mb-2">Key features</h4>
							<div className="flex flex-wrap gap-2">
								{vehicle.features.map((f, idx) => (
									<span key={idx} className="px-2 py-1 text-xs rounded-full bg-white/10 text-white border border-white/20">{f}</span>
								))}
							</div>
						</div>
					)}

					<div className="mt-6 flex items-center justify-between">
						<span className="px-3 py-1 rounded-full text-xs bg-[#ebc651]/30 text-white border border-[#ebc651]">{vehicle.precio}</span>
						<button
							type="button"
							onClick={() => onSelect(vehicle)}
							className="shine-btn px-5 py-2 rounded-lg bg-black text-white hover:bg-[#ebc651] hover:text-black transform hover:scale-[1.02] shadow-md hover:shadow-lg"
						>
							Select this vehicle
						</button>
					</div>

					<div className="mt-4 border-t pt-4">
						<h4 className="text-sm font-semibold text-white mb-2">Conditions</h4>
						<ul className="list-disc pl-5 text-xs text-white space-y-1">
							<li>Availability may vary by city and date</li>
							<li>Rates may change based on distance, time, tolls and surcharges</li>
							<li>Extra stops or waiting time may incur additional charges</li>
							<li>All bookings require confirmation by our team</li>
						</ul>
					</div>
				</div>
			</div>
			<style jsx global>{`
				@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
				@keyframes shine {
					0% { transform: translateX(-150%); }
					100% { transform: translateX(250%); }
				}
				.shine-btn { position: relative; overflow: hidden; }
				.shine-btn::after {
					content: '';
					position: absolute;
					top: 0; left: -150%;
					height: 100%; width: 40%;
					background: linear-gradient(120deg, transparent, rgba(255,255,255,0.45), transparent);
					animation: none;
				}
				.shine-btn:hover::after { animation: shine 900ms ease-in-out; }
			`}</style>
		</div>
	);
};

export default VehicleDetailsModal; 