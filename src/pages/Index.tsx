
import PGListingForm from "@/components/PGListingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <h1 className="text-xl font-bold text-purple-700">PG Palace</h1>
        </div>
      </header>
      
      <div className="container mx-auto">
        <PGListingForm />
      </div>
    </div>
  );
};

export default Index;
