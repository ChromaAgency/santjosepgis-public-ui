import PlacesMapWithFilters from "@/components/PlacesMapWithFilters";
import PlacesStats from "@/components/PlacesStats";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-shrink-0">
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Sant Josep de sa Talaia GIS
          </h1>
          <p className="text-sm text-gray-600">
            Sistema de información geográfica para la gestión municipal
          </p>
        </header>

        {/* Estadísticas - versión compacta */}
        <PlacesStats />
      </div>

      <main className="container mx-auto flex-1 px-4 pb-4 min-h-0">
        {/* Mapa con filtros - ocupa toda la altura disponible */}
        <PlacesMapWithFilters
          initialCenter={[38.9368719,1.2610344]} // Coordenadas de Sant Josep
          initialZoom={12}
          className="h-full"
        />
      </main>

      <footer className="flex-shrink-0 py-2 text-center text-gray-500 text-xs">
        <p>© 2024 Sant Josep de sa Talaia - Sistema GIS Municipal</p>
      </footer>
    </div>
  );
}
