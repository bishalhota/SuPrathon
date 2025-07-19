import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { getProducts, getCategories } from '../lib/database';
import { Filter, Leaf, Star } from 'lucide-react';

export const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock products for fallback
  const mockProducts = [
    {
      id: '1',
      name: 'Organic Cotton T-Shirt',
      description: 'Soft, comfortable organic cotton t-shirt made from sustainable materials',
      price: 29.99,
      image_url: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Clothing',
      carbon_rating: 4.5,
      stock_quantity: 25,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Bamboo Water Bottle',
      description: 'Eco-friendly bamboo water bottle with leak-proof design',
      price: 19.99,
      image_url: 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Home & Garden',
      carbon_rating: 5.0,
      stock_quantity: 50,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Solar Power Bank',
      description: 'Portable solar power bank for sustainable energy on the go',
      price: 49.99,
      image_url: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Electronics',
      carbon_rating: 4.2,
      stock_quantity: 15,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Recycled Notebook',
      description: 'High-quality notebook made from 100% recycled paper',
      price: 12.99,
      image_url: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Office',
      carbon_rating: 4.8,
      stock_quantity: 75,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Organic Skincare Set',
      description: 'Natural skincare products with organic ingredients',
      price: 89.99,
      image_url: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Beauty',
      carbon_rating: 4.7,
      stock_quantity: 30,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      name: 'LED Smart Bulb',
      description: 'Energy-efficient LED smart bulb with app control',
      price: 24.99,
      image_url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Electronics',
      carbon_rating: 3.9,
      stock_quantity: 40,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      name: 'Reusable Food Containers',
      description: 'Set of glass food containers with airtight lids',
      price: 34.99,
      image_url: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Kitchen',
      carbon_rating: 4.3,
      stock_quantity: 60,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '8',
      name: 'Electric Bike',
      description: 'Eco-friendly electric bike for sustainable transportation',
      price: 1299.99,
      image_url: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Transportation',
      carbon_rating: 4.6,
      stock_quantity: 8,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.log('Using default categories - Supabase not connected');
        setCategories([
          { name: 'Clothing' },
          { name: 'Electronics' },
          { name: 'Home & Garden' },
          { name: 'Beauty' },
          { name: 'Kitchen' },
          { name: 'Office' },
          { name: 'Transportation' },
          { name: 'Sports & Outdoors' }
        ]);
      }

      // Fetch products
      try {
        const productsData = await getProducts({
          category: selectedCategory,
          sortBy: sortBy
        });
        setProducts(productsData);
      } catch (error) {
        console.log('Using mock data - Supabase not connected');
        let filteredProducts = [...mockProducts];
        
        // Apply category filter
        if (selectedCategory !== 'all') {
          filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }
        
        // Apply sorting
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'carbon-rating':
              return b.carbon_rating - a.carbon_rating;
            default:
              return a.name.localeCompare(b.name);
          }
        });
        
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = ['all', ...categories.map(c => c.name)];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categoryOptions.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Rating Legend */}
          <div className="hidden lg:flex items-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Leaf className="w-3 h-3 text-green-500" />
              <span>Carbon Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>Customer Rating</span>
            </div>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="carbon-rating">Best Carbon Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};