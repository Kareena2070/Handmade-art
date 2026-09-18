import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            {product.category}
          </p>

          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {product.name}
          </h3>

          <p className="mt-2 text-base font-semibold text-gray-900">
            ₹{product.price}
          </p>
        </div>
      </Link>
    </article>
  );
}