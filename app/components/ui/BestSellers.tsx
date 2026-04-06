import ProductCard from './ProductCard';

// Dummy product data matching the design
const products = [
  { id: 1, name: 'AGBADA 01 | ROYAL PURPLE', price: 168000, imageUrl: '/products/p1.png' },
  { id: 2, name: 'AGBADA 02 | OBI WHITE', price: 168000, imageUrl: '/products/p2.png' },
  { id: 3, name: 'AGBADA 03 | CREAM & GOLD EMBROIDERY', price: 168000, imageUrl: '/products/p3.png' },
  { id: 4, name: 'AGBADA 04 | MOKO ORANGE PATTERN', price: 168000, imageUrl: '/products/p4.png' },
  { id: 5, name: 'KAFTAN 01 | NAVY GREEN & GOLD', price: 88000, imageUrl: '/products/p5.png' },
  { id: 6, name: 'KAFTAN 02 | SHIRTING BLUE & WHITE', price: 88000, imageUrl: '/products/p6.png' },
  { id: 7, name: 'AGBADA 05 | EXOTIC CREAM', price: 168000, imageUrl: '/products/p7.png' },
  { id: 8, name: 'CANIRE 01 | SHIRT BLUE TIE DYE', price: 90000, imageUrl: '/products/p8.png' },
];

export default function BestSellers() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="text-3xl font-luxury font-medium tracking-tight text-center mb-16">
          BEST SELLERS
        </h2>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}