// src/App.js
import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, FolderOpen, Calendar, Map, BookOpen, 
    CheckSquare, Users, ShoppingBag, Briefcase, Gamepad2, 
    Mail, Menu, X, LogOut 
} from 'lucide-react';

// --- Firebase Imports ---
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from './firebase'; 
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Import Pages ---
import LandingPage from './pages/LandingPage'; // The new clean file
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio'; 
import Events from './pages/Events';
import Pathway from './pages/Pathway';
import Jobs from './pages/Jobs';
import PersonalDev from './pages/PersonalDev';
import TaskBoard from './pages/TaskBoard'; 
import Network from './pages/Network';
import Marketplace from './pages/Marketplace'; 
import Contact from './pages/Contact'; 
import Medle from './pages/Medle';

// --- APP CONTENT COMPONENT ---
function AppContent() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const [userProfile, setUserProfile] = useState(null); 

    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnapshot) => {
                if (docSnapshot.exists()) setUserProfile(docSnapshot.data());
                else setUserProfile({ name: currentUser.displayName || '', email: currentUser.email });
            });
            return () => unsub();
        }
    }, [currentUser]);

    const handleLogout = async () => { try { await logout(); } catch (error) { console.error("Failed to log out", error); } };

    // *** IF NOT LOGGED IN, SHOW LANDING PAGE ***
    if (!currentUser) return <LandingPage />;

    // *** IF LOGGED IN, SHOW DASHBOARD ***
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
        { id: 'events', label: 'Events', icon: Calendar },           
        { id: 'pathway', label: 'Pathway', icon: Map },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'development', label: 'Personal Dev', icon: BookOpen },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'network', label: 'Network', icon: Users },
        { id: 'medle', label: 'Medle', icon: Gamepad2 },
        { id: 'marketplace', label: 'Shop', icon: ShoppingBag },
        { id: 'contact', label: 'Contact', icon: Mail },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard setActiveView={setActiveView} />;
            case 'portfolio': return <Portfolio activities={[]} />;
            case 'events': return <Events />;
            case 'pathway': return <Pathway />;
            case 'jobs': return <Jobs />;
            case 'development': return <PersonalDev />;
            case 'tasks': return <TaskBoard />;
            case 'network': return <Network />;
            case 'medle': return <Medle />;
            case 'marketplace': return <Marketplace />;
            case 'contact': return <Contact />; 
            default: return <Dashboard setActiveView={setActiveView} />;
        }
    };

    const getDisplayName = () => userProfile?.name || userProfile?.displayName || currentUser.email?.split('@')[0] || 'User';
    
    // Updated Initials Logic (Shared)
    const getInitials = () => {
        let name = getDisplayName().trim();
        const prefixes = ['Dr', 'Mr', 'Mrs', 'Ms', 'Miss', 'Prof'];
        const parts = name.split(' ');
        
        if (parts.length > 1 && prefixes.includes(parts[0].replace('.', ''))) {
            parts.shift();
        }

        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0] ? parts[0][0].toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 shadow-xl">
                <div className="p-6 border-b border-slate-800"><h1 className="text-lg font-bold text-white">Your Surgical Career</h1></div>
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800'}`}>
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">{getInitials()}</div>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{getDisplayName()}</p></div>
                        <button onClick={handleLogout}><LogOut size={16} className="text-slate-500 hover:text-red-400" /></button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-20">
                    <h1 className="font-bold">Your Surgical Career</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 text-slate-300 z-10 border-b border-slate-800 shadow-xl">
                        <nav className="p-4 space-y-2">
                             {navItems.map((item) => <button key={item.id} onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}><item.icon size={18} />{item.label}</button>)}
                             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-slate-800 text-red-400"><LogOut size={18} /> Sign Out</button>
                        </nav>
                    </div>
                )}
                <div className="flex-1 overflow-auto bg-slate-50"><div className="max-w-7xl mx-auto w-full">{renderContent()}</div></div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}