import BestSellers from "./components/ui/BestSellers";
import Hero from "./components/ui/Hero";
import Mission from "./components/ui/Mission";


export default function Home() {
  return (
    <div className="space-y-12 relative isolate">
      <Hero />
      <BestSellers />
      <Mission />
    </div>
  );
}