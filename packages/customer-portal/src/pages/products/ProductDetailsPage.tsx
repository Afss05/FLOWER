import { useParams } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
import { useState } from 'react'

export default function ProductDetailsPage() {
  const { id } = useParams()
  usePageTitle('Product Details')
  const [quantity, setQuantity] = useState(1)

  const product = {
    id: 1,
    name: 'Premium Red Roses Bunch - 12 Stems',
    price: 499,
    discountedPrice: 349,
    image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=800&h=800&fit=crop',
    rating: 4.5,
    reviews: 123,
    isFresh: true,
    description:
      'Beautiful bunch of 12 premium red roses, perfect for any occasion. Carefully handpicked and arranged to perfection.',
    details: [
      '12 Premium Red Roses',
      'Fresh from our garden',
      'Same-day delivery available',
      '24-hour freshness guarantee',
      'Free greeting card included',
    ],
    images: [
      'https://images.unsplash.com/photo-1519915212116-7cfef71f910d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594959533394-d8e5d23d72e3?w=800&h=800&fit=crop',
    ],
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt="" className="w-full h-20 object-cover rounded cursor-pointer" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-red-700">₹{product.discountedPrice}</span>
                <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                <span className="bg-red-700 text-white px-3 py-1 rounded">
                  {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700">{product.description}</p>

            {/* Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Product Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn btn-primary flex items-center justify-center gap-2 text-lg py-3">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="btn btn-outline px-6 py-3">
                  <Heart size={20} />
                </button>
                <button className="btn btn-outline px-6 py-3">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-700 mb-2">✓ Same-day Delivery Available</h3>
              <p className="text-sm text-green-700">Order within next 2 hours for today's delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
