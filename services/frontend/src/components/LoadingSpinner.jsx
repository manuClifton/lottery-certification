function LoadingSpinner({ label = "Cargando..." }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-blue-900">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-r-transparent" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
