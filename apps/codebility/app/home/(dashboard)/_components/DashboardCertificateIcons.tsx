import { cn } from "@codevs/ui";

export function CertificateIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn('icon icon-tabler icons-tabler-outline icon-tabler-certificate', className)}
			style={{ pointerEvents: 'none' }}
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
			<path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" />
			<path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73" />
			<path d="M6 9l12 0" />
			<path d="M6 12l3 0" />
			<path d="M6 15l2 0" />
		</svg>
	);
}

export function CertificateOffIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn('icon icon-tabler icons-tabler-outline icon-tabler-certificate-off', className)}
			style={{ pointerEvents: 'none' }}
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M12.876 12.881a3 3 0 0 0 4.243 4.243m.588 -3.42a3.012 3.012 0 0 0 -1.437 -1.423" />
			<path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" />
			<path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2m4 0h10a2 2 0 0 1 2 2v10" />
			<path d="M6 9h3m4 0h5" />
			<path d="M6 12h3" />
			<path d="M6 15h2" />
			<path d="M3 3l18 18" />
		</svg>
	);
}

