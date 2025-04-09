import { Star, Clock, MapPin, Percent } from 'lucide-react';

export default function RestaurantPage() {
  const restaurant = {
    name: "Pizza Palace",
    slug: "pizza-palace",
    description: "Delicious pizzas, pastas, and sides made with love!",
    image: "/images/pizza-logo.png",
    coverImage: "/images/pizza-cover.jpg",
    cuisines: ["Italian", "Fast Food"],
    address: {
      street: "123 Food Street",
      city: "Foodville",
      postalCode: "98765",
    },
    contact: {
      phone: "+1 123 456 7890",
      email: "contact@pizzapalace.com"
    },
    rating: {
      average: 4.5,
      totalRatings: 1240
    },
    deliveryTimeEstimate: { min: 25, max: 35 },
    deliveryFee: 2.99,
    freeDeliveryAbove: 20,
    offers: [
      {
        title: "20% OFF",
        description: "Get 20% off on orders above $25",
        type: "percentage",
        value: 20,
        minimumOrder: 25,
        validUntil: new Date("2025-05-01")
      }
    ],
    menu: [
      {
        title: "Pizzas",
        foodItems: [
          {
            name: "Margherita",
            description: "Classic cheese pizza with fresh basil.",
            image: "/images/margherita.jpg",
            price: 9.99,
            discountedPrice: 7.99,
            isVeg: true,
            isHalal: true,
            tags: ["best seller", "veg"],
            spiceLevel: "Mild",
            customizations: [
              {
                name: "Size",
                options: [
                  { label: "Small", additionalCost: 0 },
                  { label: "Medium", additionalCost: 2 },
                  { label: "Large", additionalCost: 4 }
                ]
              }
            ]
          },
          {
            name: "Pepperoni Blast",
            description: "Loaded with spicy pepperoni and extra cheese.",
            image: "/images/pepperoni.jpg",
            price: 12.49,
            discountedPrice: 0,
            isVeg: false,
            isHalal: true,
            tags: ["spicy"],
            spiceLevel: "Spicy",
            customizations: []
          }
        ]
      },
      {
        title: "Sides",
        foodItems: [
          {
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter.",
            image: "/images/garlic-bread.jpg",
            price: 3.99,
            discountedPrice: 0,
            isVeg: true,
            isHalal: true,
            tags: [],
            spiceLevel: "Mild",
            customizations: []
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <img src={restaurant.coverImage} alt="cover" className="w-full h-64 object-cover" />
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.cuisines.join(', ')}</p>
            </div>
            <div className="flex items-center gap-2 text-yellow-500 font-semibold">
              <Star className="w-5 h-5" /> {restaurant.rating.average} ({restaurant.rating.totalRatings})
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <MapPin className="w-4 h-4" /> {restaurant.address.street}, {restaurant.address.city}
            <Clock className="w-4 h-4" /> {restaurant.deliveryTimeEstimate.min}-{restaurant.deliveryTimeEstimate.max} mins
            <span>Delivery: ${restaurant.deliveryFee} ({restaurant.freeDeliveryAbove ? `Free over $${restaurant.freeDeliveryAbove}` : "No free delivery"})</span>
          </div>
        </div>
      </div>

      {/* Offers */}
      {restaurant.offers.length > 0 && (
        <div className="mt-4 bg-orange-100 border-l-4 border-orange-400 p-4 rounded-lg">
          {restaurant.offers.map((offer, i) => (
            <div key={i} className="flex items-center gap-2 text-orange-800 font-medium">
              <Percent className="w-5 h-5" />
              {offer.title} – {offer.description}
            </div>
          ))}
        </div>
      )}

      {/* Menu */}
      <div className="mt-8">
        {restaurant.menu.map((category, i) => (
          <div key={i} className="mb-10">
            <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.foodItems.map((item, j) => (
                <div key={j} className="flex gap-4 p-4 border rounded-2xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{item.description}</p>
                    <div className="text-sm flex items-center gap-2">
                      {item.discountedPrice > 0 ? (
                        <>
                          <span className="text-red-600 font-bold">${item.discountedPrice.toFixed(2)}</span>
                          <span className="line-through text-gray-400">${item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-gray-800 font-bold">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2 text-xs">
                      {item.isVeg && <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded">Veg</span>}
                      {!item.isVeg && <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded">Non-Veg</span>}
                      {item.spiceLevel && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{item.spiceLevel}</span>}
                      {item.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
