export default function SpinnerLoading() {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
			<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
		</div>
	);
}
