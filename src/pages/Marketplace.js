import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Heart, Tag, Star, Check } from 'lucide-react';
import { doc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../context/AuthContext';

// 1. IMPORT YOUR DATA
import { masterCSVData } from '../data/marketData';

// --- HELPER: CSV PARSER ---
// This converts your CSV string into a list of usable product objects
const parseMarketData = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuote = false;
      
      // Handle commas inside quotes (e.g., "Watch, Pen, and Flashcards")
      for(let i=0; i<line.length; i++) {
          const char = line[i];
          if(char === '"') { inQuote = !inQuote; continue; }
          if(char === ',' && !inQuote) {
              values.push(current.trim());
              current = '';
          } else {
              current += char;
          }
      }
      values.push(current.trim());

      const entry = {};
      headers.forEach((h, i) => entry[h] = values[i]);
      
      return {
          id: entry.id,
          title: entry.name,
          price: parseFloat(entry.price),
          category: entry.category,
          rating: parseFloat(entry.rating),
          image: entry.image,
          description: entry.description,
          bestSeller: parseFloat(entry.rating) >= 4.8 // Auto-tag high rated items
      };
  });
};

// 2. GENERATE PRODUCTS LIST FROM DATA
const PRODUCTS = parseMarketData(masterCSVData);
// Automatically generate category tabs based on your data
const CATEGORIES = ['All', ...new Set(PRODUCTS.map(p => p.category))];

export default function Marketplace() {
  const { currentUser } = useAuth();
  
  // Local UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Database State (Cart & Favorites)
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // --- 1. SYNC WITH FIREBASE ON LOAD ---
  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const unsub = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCart(data.cart || []);
          setFavorites(data.favorites || []);
        } else {
            setCart([]);
            setFavorites([]);
        }
      });
      return () => unsub();
    }
  }, [currentUser]);

  // --- 2. HANDLE ADD/REMOVE CART ---
  const toggleCart = async (product) => {
    if (!currentUser) return alert("Please log in first.");
    const userRef = doc(db, "users", currentUser.uid);
    const isInCart = cart.some(item => item.id === product.id);

    try {
      if (isInCart) {
        await setDoc(userRef, { cart: arrayRemove(product) }, { merge: true });
      } else {
        await setDoc(userRef, { cart: arrayUnion(product) }, { merge: true });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // --- 3. HANDLE ADD/REMOVE FAVORITES ---
  const toggleHeart = async (product) => {
    if (!currentUser) return alert("Please log in first.");
    const userRef = doc(db, "users", currentUser.uid);
    const isFav = favorites.some(item => item.id === product.id);

    try {
      if (isFav) {
        await setDoc(userRef, { favorites: arrayRemove(product) }, { merge: true });
      } else {
        await setDoc(userRef, { favorites: arrayUnion(product) }, { merge: true });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Marketplace</h1>
          <p className="text-slate-500 mt-1">Resources to accelerate your surgical training.</p>
        </div>
        
        {/* CART & FAV BUTTONS */}
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors">
             <Heart size={20} className={favorites.length > 0 ? "text-red-500 fill-current" : ""} />
             <span>Favorites ({favorites.length})</span>
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm transition-colors">
             <ShoppingCart size={20} />
             <span>Cart ({cart.length})</span>
           </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const isInCart = cart.some(item => item.id === product.id);
          const isFav = favorites.some(item => item.id === product.id);

          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group flex flex-col h-full">
              {/* Image Area */}
              <div className="h-48 bg-slate-200 relative shrink-0">
                 {/* Fallback image logic: Use provided URL or a generic placeholder if URL fails/is placeholder */}
                 <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                    }}
                 />
                 
                 {product.bestSeller && (
                   <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                     Best Seller
                   </span>
                 )}
                 <button 
                   onClick={() => toggleHeart(product)}
                   className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition z-10 shadow-sm"
                 >
                   <Heart size={18} className={isFav ? "text-red-500 fill-current" : "text-slate-400"} />
                 </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold text-blue-600 uppercase tracking-wide truncate pr-2">{product.category}</span>
                   <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                     <Star size={14} fill="currentColor" /> {product.rating}
                   </div>
                </div>
                
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 h-12 leading-tight">{product.title}</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-xl font-bold text-slate-900">£{product.price.toFixed(2)}</span>
                  
                  <button 
                    onClick={() => toggleCart(product)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm px-4 shadow-sm ${
                      isInCart 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isInCart ? (
                      <>Added <Check size={16} /></>
                    ) : (
                      <>Add <ShoppingCart size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}