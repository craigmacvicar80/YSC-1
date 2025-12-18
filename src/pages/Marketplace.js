import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Heart, Star, Check, X, Trash2 } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { useAuth } from '../context/AuthContext';
import { masterCSVData } from '../data/marketData';

// --- HELPER: CSV PARSER ---
const parseMarketData = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuote = false;
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
          price: parseFloat(entry.price) || 0,
          category: entry.category,
          rating: parseFloat(entry.rating) || 0,
          image: entry.image,
          description: entry.description,
          bestSeller: (parseFloat(entry.rating) || 0) >= 4.8
      };
  });
};

const PRODUCTS = parseMarketData(masterCSVData);
const CATEGORIES = ['All', ...new Set(PRODUCTS.map(p => p.category))];

export default function Marketplace() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);

  // --- SYNC WITH FIREBASE ---
  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCart(data.cart || []);
        setFavorites(data.favorites || []);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // --- ACTIONS ---
  const toggleCart = async (product) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const isInCart = cart.some(item => item.id === product.id);
    try {
      await updateDoc(userRef, {
        cart: isInCart ? arrayRemove(product) : arrayUnion(product)
      });
    } catch (e) {
      await setDoc(userRef, { cart: [product] }, { merge: true });
    }
  };

  const toggleHeart = async (product) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const isFav = favorites.some(item => item.id === product.id);
    try {
      await updateDoc(userRef, {
        favorites: isFav ? arrayRemove(product) : arrayUnion(product)
      });
    } catch (e) {
      await setDoc(userRef, { favorites: [product] }, { merge: true });
    }
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reusable Sidebar Component
  const SidebarModal = ({ isOpen, onClose, title, items, onToggle, icon: Icon }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Icon size={22}/> {title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-slate-400 mt-10 italic">Your {title.toLowerCase()} is empty.</p>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                    {/* DEFENSIVE CHECK: Added (item.price || 0) */}
                    <p className="text-blue-600 font-bold text-sm">£{(item.price || 0).toFixed(2)}</p>
                  </div>
                  <button onClick={() => onToggle(item)} className="text-slate-300 hover:text-red-500 transition-colors p-1"><Trash2 size={18}/></button>
                </div>
              ))
            )}
          </div>
          {title === "Cart" && items.length > 0 && (
            <div className="p-6 border-t bg-slate-50">
              <div className="flex justify-between mb-4 font-bold text-lg text-slate-800">
                <span>Total:</span>
                <span>£{items.reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}</span>
              </div>
              <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">Checkout Now</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Shop</h1>
          <p className="text-slate-500 mt-1 font-medium">Resources to accelerate your surgical training.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setShowFavModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-all shadow-sm">
             <Heart size={20} className={favorites.length > 0 ? "text-red-500 fill-current" : ""} />
             <span>Favorites ({favorites.length})</span>
           </button>
           <button onClick={() => setShowCartModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 font-bold shadow-lg transition-all">
             <ShoppingCart size={20} />
             <span>Cart ({cart.length})</span>
           </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search surgical equipment, books, courses..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const isInCart = cart.some(item => item.id === product.id);
          const isFav = favorites.some(item => item.id === product.id);
          return (
            <div key={product.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="h-52 bg-slate-100 relative shrink-0">
                 <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.src="https://placehold.co/400x300?text=Surgical+Resource"; }}
                 />
                 {product.bestSeller && <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm z-10 uppercase">Best Seller</span>}
                 <button onClick={() => toggleHeart(product)} className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white transition-all z-10 shadow-md">
                   <Heart size={18} className={isFav ? "text-red-500 fill-current" : "text-slate-400"} />
                 </button>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.category}</span>
                   <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                     <Star size={14} fill="currentColor" /> {(product.rating || 0)}
                   </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 leading-tight flex-1">{product.title}</h3>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-xl font-black text-slate-900">£{(product.price || 0).toFixed(2)}</span>
                  <button 
                    onClick={() => toggleCart(product)}
                    className={`p-2.5 rounded-2xl transition-all flex items-center gap-2 font-bold text-xs px-4 shadow-sm ${
                      isInCart ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isInCart ? <><Check size={16} /> Added</> : <><ShoppingCart size={16} /> Add</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SidebarModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} title="Cart" items={cart} onToggle={toggleCart} icon={ShoppingCart} />
      <SidebarModal isOpen={showFavModal} onClose={() => setShowFavModal(false)} title="Favorites" items={favorites} onToggle={toggleHeart} icon={Heart} />
    </div>
  );
}