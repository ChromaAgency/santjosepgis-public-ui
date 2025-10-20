import PlacesMapWithFilters from "@/components/PlacesMapWithFilters";
import PlacesStats from "@/components/PlacesStats";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sant Josep de sa Talaia GIS
          </h1>
          <p className="text-gray-600">
            Sistema de información geográfica para la gestión municipal
          </p>
        </header>

        <main className="max-w-6xl mx-auto space-y-8">
          {/* Estadísticas */}
          <PlacesStats 
            apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
          />
          
          {/* Mapa con filtros */}
          <PlacesMapWithFilters
            apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
            initialCenter={[38.9368719,1.2610344]} // Coordenadas de Sant Josep
            initialZoom={12}
          />
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 Sant Josep de sa Talaia - Sistema GIS Municipal</p>
        </footer>
      </div>
    </div>
  );
}
