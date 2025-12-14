// src/pages/Marketplace.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingBag, Search, Star, Filter, ShoppingCart, Heart, ChevronRight } from 'lucide-react';

// --- Static Data (Replacing the CSV fetch for stability) ---
const masterCSVData = `
id,name,category,price,description,keywords,image,rating,reviews,stock_status,bundle_items
901,Med Student Starter Pack (SAVE 10%),Bundles & Offers,85.00,"Includes Fob Watch, Pen, Flashcards, and Lunch Tote for ward survival.",bundle,https://placehold.co/400x300/fecaca/991b1b?text=Student+Pack,4.8,120,In Stock,Fob Watch (Silicone)|4-Colour Ballpoint Pen|Reference ID Cards Set|Insulated Lunch Tote
902,Surgical Trainee Essentials (SAVE 15%),Bundles & Offers,99.00,"Includes core items for theatre: Knot-Tying Board, Trauma Shears, Scrub Cap, and Fleece Gilet.",bundle,https://placehold.co/400x300/fecaca/991b1b?text=Surgical+Pack,4.7,85,Low Stock,Knot-Tying Deep Board|Trauma Shears (Autoclavable)|Personalized Scrub Cap|Fleece Gilet (Vest)
101,Suture Practice Kit,Simulation & Education,49.99,"Complete kit with instruments, pad, and threads.",suture,https://placehold.co/400x300/e0f2fe/0369a1?text=Suture+Kit,4.5,154,In Stock,
102,Laparoscopic Trainer,Simulation & Education,199.99,"Basic box trainer for keyhole surgery skills.",laparoscopy,https://placehold.co/400x300/e0f2fe/0369a1?text=Lap+Trainer,4.2,45,In Stock,
103,Ultrasound Phantom Block,Simulation & Education,120.00,"Gel block for needle guidance training (CVC/Cannulation).",ultrasound,https://placehold.co/400x300/e0f2fe/0369a1?text=US+Phantom,4.6,67,Low Stock,
104,Knot-Tying Deep Board,Simulation & Education,34.99,"Deep-well board for practicing advanced surgical knots.",knots,https://placehold.co/400x300/e0f2fe/0369a1?text=Knot+Board,4.5,92,In Stock,
201,Life-Size Articulated Skeleton,Anatomy & Models,249.99,"Full 170cm skeleton on roller stand.",skeleton,https://placehold.co/400x300/ffe4e6/c53030?text=Full+Skeleton,4.8,201,In Stock,
203,Regional Brain Model (Color),Anatomy & Models,79.99,"Color-coded by lobes for neuroanatomy.",brain,https://placehold.co/400x300/ffe4e6/c53030?text=Brain+Model,4.9,110,In Stock,
302,Fob Watch (Silicone),Clinical Equipment,12.99,"Pin-on, infection control compliant watch.",watch,https://placehold.co/400x300/d1fae5/065f46?text=Fob+Watch+Time,4.8,412,In Stock,
304,Trauma Shears (Autoclavable),Clinical Equipment,10.99,"Heavy-duty scissors for cutting clothing and dressings.",trauma,https://placehold.co/400x300/d1fae5/065f46?text=Trauma+Shears,4.6,189,In Stock,
401,Fleece Gilet (Vest),Apparel & Footwear,39.99,"Sleeveless fleece for Bare Below Elbows compliance.",clothing,https://placehold.co/400x300/f3f4f6/1f2937?text=Scrub+Gilet,4.5,250,In Stock,
404,Personalized Scrub Cap,Apparel & Footwear,17.50,"Cloth cap with fun prints and optional name embroidery.",cap,https://placehold.co/400x300/f3f4f6/1f2937?text=Personalised+Scrub+Cap,4.9,90,In Stock,
701,Netter's Anatomy Atlas,Books & Media,65.00,"The standard medical illustration atlas.",netter,https://placehold.co/400x300/f0f9ff/0077b6?text=Netter+Atlas+Book,4.9,600,In Stock,
`;

// --- Utility Functions ---
function parseBundleContents(itemsString) {
    const itemMap = {
        "Fob Watch (Silicone)": { name: "Fob Watch (Silicone)", benefit: "Infection Control Compliance", use: "Essential for 'bare below the elbows' policy." },
        "4-Colour Ballpoint Pen": { name: "4-Colour Ballpoint Pen", benefit: "Efficient Note-Taking", use: "Color-coding tasks and medications." },
        "Reference ID Cards Set": { name: "Reference ID Cards Set", benefit: "Quick Clinical Reference", use: "Checking drug doses and ECGs." },
        "Insulated Lunch Tote": { name: "Insulated Lunch Tote", benefit: "Shift Survival", use: "Keeps food fresh during long shifts." },
        "Knot-Tying Deep Board": { name: "Knot-Tying Deep Board", benefit: "Dexterity", use: "Practicing complex knots." },
        "Trauma Shears (Autoclavable)": { name: "Trauma Shears (Autoclavable)", benefit: "Safety", use: "Cutting clothing in emergencies." },
        "Personalized Scrub Cap": { name: "Personalized Scrub Cap", benefit: "Hygiene", use: "Containing hair in sterile fields." },
        "Fleece Gilet (Vest)": { name: "Fleece Gilet (Vest)", benefit: "Warmth", use: "Core warmth on cold wards." }
    };
    if (!itemsString) return [];
    return itemsString.split('|').map(item => {
        const trimmedItem = item.trim();
        return itemMap[trimmedItem] || { name: trimmedItem, benefit: 'General Use', use: 'Essential item.' };
    });
}

function parseCSV(csvString) {
    const lines = csvString.trim().replace(/\r/g, '').split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];
    const columnRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(columnRegex).map(v => v.trim().replace(/^"|"$/g, ''));
        if (values.length !== headers.length) continue;
        const product = {};
        headers.forEach((header, index) => {
            let value = values[index];
            if (['id', 'reviews'].includes(header)) product[header] = parseInt(value) || 0;
            else if (['price', 'rating'].includes(header)) product[header] = parseFloat(value) || 0.0;
            else if (header === 'bundle_items') {
                product.bundle_items = values[index];
                product.contents = parseBundleContents(values[index]);
            } else product[header] = value;
        });
        product.link = product.link || `#`;
        products.push(product);
    }
    return products;
}

function RenderStars({ rating }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
        <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < fullStars ? "currentColor" : "none"} className={i >= fullStars && !halfStar ? "text-gray-300" : ""} />
            ))}
        </div>
    );
}

// --- Main Component ---
export default function Marketplace() {
    // State (No Auth dependency)
    const [allProducts, setAllProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]); 
    const [favorites, setFavorites] = useState([]); 
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState('default');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBundle, setSelectedBundle] = useState(null);

    // Initial Load
    useEffect(() => {
        const data = parseCSV(masterCSVData);
        setAllProducts(data);
    }, []);

    // Local Logic (Simulating Cart/Favorites)
    const toggleFavorite = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
    };

    const addToCart = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        setCartItems(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing) {
                return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // Filter & Sort
    const filteredProducts = useMemo(() => {
        let products = allProducts;
        if (activeCategory === 'Favorites') products = products.filter(p => favorites.includes(p.id));
        else if (activeCategory !== 'All') products = products.filter(p => p.category === activeCategory);

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower));
        }

        return [...products].sort((a, b) => {
            if (sortValue === 'price-asc') return a.price - b.price;
            if (sortValue === 'price-desc') return b.price - a.price;
            if (sortValue === 'rating-desc') return b.rating - a.rating;
            return 0;
        });
    }, [allProducts, activeCategory, favorites, searchTerm, sortValue]);

    const allCategories = ['All', ...new Set(allProducts.map(p => p.category))].sort();
    const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="text-blue-600" /> Shop
                    </h1>
                    
                    <div className="flex-1 max-w-2xl hidden md:flex relative">
                        <input 
                            type="text" 
                            placeholder="Search essentials..." 
                            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveCategory('Favorites')} className="relative p-2 text-gray-600 hover:text-red-500">
                            <Heart />
                            {favorites.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{favorites.length}</span>}
                        </button>
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-blue-600">
                            <ShoppingCart />
                            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems.reduce((a, b) => a + b.quantity, 0)}</span>}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8 w-full">
                
                {/* Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-slate-800 mb-3">Categories</h3>
                        <div className="space-y-1">
                            {allCategories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeCategory === cat ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-slate-800 mb-3">Sort By</h3>
                        <select 
                            className="w-full p-2 border rounded-lg text-sm bg-gray-50"
                            value={sortValue}
                            onChange={(e) => setSortValue(e.target.value)}
                        >
                            <option value="default">Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating-desc">Top Rated</option>
                        </select>
                    </div>
                </aside>

                {/* Grid */}
                <section className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group flex flex-col overflow-hidden relative">
                                {product.stock_status === 'Low Stock' && (
                                    <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Low Stock</span>
                                )}
                                <div 
                                    className="h-48 bg-gray-50 flex items-center justify-center text-7xl cursor-pointer"
                                    onClick={() => {
                                        if(product.category === 'Bundles & Offers') {
                                            setSelectedBundle(product);
                                            setModalOpen(true);
                                        }
                                    }}
                                >
                                    {product.image.startsWith('http') ? <img src={product.image} alt={product.name} className="h-full w-full object-cover"/> : product.image}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{product.category}</span>
                                        <button onClick={(e) => toggleFavorite(e, product.id)}>
                                            <Heart size={18} className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"} />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                                        <RenderStars rating={product.rating} /> <span>({product.reviews})</span>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center pt-3 border-t">
                                        <span className="text-xl font-bold text-slate-900">£{product.price.toFixed(2)}</span>
                                        <button 
                                            onClick={() => addToCart(product.id)}
                                            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-slate-800">Your Cart ({totalCartItems})</h2>
                            <button onClick={() => setIsCartOpen(false)}><ChevronRight /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {cartItems.length === 0 ? <p className="text-center text-gray-500 mt-10">Cart is empty.</p> : 
                                cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 border-b pb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">{item.image}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                                            <p className="text-sm text-gray-500">£{item.price.toFixed(2)}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">-</button>
                                                <span className="text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">+</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="p-5 border-t bg-gray-50">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total</span>
                                <span>£{cartSubtotal.toFixed(2)}</span>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Checkout</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bundle Modal */}
            {modalOpen && selectedBundle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">{selectedBundle.name}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="rotate-90"/></button>
                        </div>
                        <div className="space-y-4 mb-6">
                            {selectedBundle.contents.map((item, i) => (
                                <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <h4 className="font-bold text-blue-800 text-sm">{item.name}</h4>
                                    <p className="text-xs text-blue-600 mt-1">{item.use}</p>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => { addToCart(selectedBundle.id); setModalOpen(false); }}
                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                        >
                            Add Bundle to Cart (£{selectedBundle.price.toFixed(2)})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}