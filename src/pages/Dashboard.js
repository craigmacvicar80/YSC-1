// src/pages/Dashboard.js - Linked "Activities Logged" to Portfolio

import React, { useEffect, useState } from 'react';
import { 
    Award, Calendar, Info, 
    CalendarCheck, Mail, Phone, Briefcase, X, TrendingUp, AlertCircle, ChevronRight, CheckCircle
} from 'lucide-react'; 

// --- Chart.js Imports ---
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// --- Firebase Imports ---
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

// --- Import User Data ---
import { MOCK_PROFILE_DATA } from '../data/portfolioData';

// --- Register Chart.js Components ---
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// --- DUMMY DATA ---
const DUMMY_DATA = {
    totalPoints: 32,
    activitiesLogged: 14,
    goalPoints: 40,
    readinessLabels: ['Research', 'Leadership', 'Clinical', 'Teaching', 'Audits/QIP'],
    readinessScores: [65, 80, 90, 70, 55], 
};

// --- General Components ---

// Deadline Bar Component
const DeadlineBar = ({ task, pendingCount, onClick }) => {
    if (!task) return null; 

    return (
        <div 
            onClick={onClick}
            className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm flex items-center justify-between mb-6 cursor-pointer hover:bg-orange-100 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-orange-700 transition-colors">
                        Upcoming Deadline: {task.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                        Due: <span className="font-semibold">{task.dueDate}</span> • {pendingCount} tasks pending
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">
                Go to Tasks <ChevronRight size={16} />
            </div>
        </div>
    );
};

// Simplified metric card
const MetricCard = ({ title, value, subtext, icon, onClick, className }) => (
    <div 
        className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-xl transition-shadow ${className}`}
        onClick={onClick}
    >
        <div>
            <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
            <h3 className="text-4xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-blue-600 text-sm mt-2 font-medium">{subtext}</p>}
        </div>
        <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            {icon}
        </div>
    </div>
);

// Progress Gauge
const ProgressGauge = ({ totalPoints, goalPoints, infoContent }) => {
    const percentage = Math.min(100, Math.round((totalPoints / goalPoints) * 100));
    
    return (
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Progress to Goal</h3>
                {infoContent && (
                    <div className="group relative"> 
                        <Info size={20} className="text-blue-500 cursor-pointer" />
                        <div className="absolute right-0 top-full mt-2 hidden w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl group-hover:block z-50">
                            {infoContent}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 gap-6">
                <div className="relative w-56 h-56">
                    <div 
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                            background: `conic-gradient(#2563EB ${percentage * 3.6}deg, #F3F4F6 0deg)`
                        }}
                    >
                        <div className="w-48 h-48 bg-white rounded-full flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-blue-600">{percentage}%</span>
                            <span className="text-lg text-gray-500 mt-1">{totalPoints}/{goalPoints} Points</span>
                        </div>
                    </div>
                </div>
                <p className="text-center text-base text-gray-600 max-w-xs">You are on track for a competitive ST3 application.</p>
            </div>
        </div>
    );
};

// Radar Chart Component
const RadarChartComponent = ({ infoContent }) => {
    const data = {
        labels: DUMMY_DATA.readinessLabels,
        datasets: [
            {
                label: 'Your Score',
                data: DUMMY_DATA.readinessScores,
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: '#2563EB',
                borderWidth: 2,
                pointBackgroundColor: '#2563EB',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#2563EB',
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: { color: '#E5E7EB' },
                grid: { color: '#E5E7EB' },
                pointLabels: {
                    font: { size: 12, family: "'Inter', sans-serif" },
                    color: '#4B5563'
                },
                ticks: { display: false, backdropColor: 'transparent' },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: { display: false }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800">Portfolio Readiness</h3>
                {infoContent && (
                    <div className="group relative"> 
                        <Info size={20} className="text-blue-500 cursor-pointer" />
                        <div className="absolute right-0 top-full mt-2 hidden w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl group-hover:block z-50">
                            {infoContent}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-h-[250px] relative">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
};

// Contact Detail Modal
const ContactDetailModal = ({ contact, onClose }) => {
    if (!contact) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                            {contact.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{contact.name}</h2>
                            <p className="text-blue-600 font-medium">{contact.role}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {contact.hospital && (
                        <div className="flex items-center gap-3 text-gray-700">
                            <Briefcase size={20} className="text-gray-400 shrink-0" />
                            <span>{contact.hospital}</span>
                        </div>
                    )}
                    {contact.email && (
                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail size={20} className="text-gray-400 shrink-0" />
                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">{contact.email}</a>
                        </div>
                    )}
                    {contact.phone && (
                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone size={20} className="text-gray-400 shrink-0" />
                            <span>{contact.phone}</span>
                        </div>
                    )}
                    
                    {contact.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</h4>
                            <p className="text-sm text-gray-600 italic">"{contact.notes}"</p>
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Dashboard Main Component ---

export default function Dashboard({ totalPoints, activitiesCount, setActiveView }) {
    
    // State
    const [networkContacts, setNetworkContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [upcomingDeadline, setUpcomingDeadline] = useState(null);
    const [totalTasks, setTotalTasks] = useState(0);

    const userName = MOCK_PROFILE_DATA.firstName || MOCK_PROFILE_DATA.name || 'Registrar';

    // Progress Calculation
    const percentage = Math.round((DUMMY_DATA.totalPoints / DUMMY_DATA.goalPoints) * 100);
    const goalProgressText = `${DUMMY_DATA.totalPoints} / ${DUMMY_DATA.goalPoints} Points`;
    const goalProgressDescription = `${percentage}% of competitive target achieved.`;

    const goalInfo = (
        <>
            <h4 className="font-bold text-base mb-1">Competitive Goal Explained</h4>
            This tracks your points against the minimum required score ({DUMMY_DATA.goalPoints}) for a competitive ST3 application.
        </>
    );
    
    const readinessInfo = (
        <>
            <h4 className="font-bold text-base mb-1">Portfolio Readiness Explained</h4>
            This plot visualizes your score across five key domains required by the national curriculum.
        </>
    );

    // --- FETCH CONTACTS & TASKS ---
    useEffect(() => {
        const fetchData = async () => {
            // 1. Contacts
            try {
                const qContacts = query(collection(db, "contacts"), limit(3));
                const snapContacts = await getDocs(qContacts);
                setNetworkContacts(snapContacts.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }

            // 2. Tasks (Deadlines)
            try {
                // Try to find earliest incomplete task
                const qTasks = query(
                    collection(db, "tasks"),
                    where("status", "!=", "Completed"),
                    // Note: compound queries require index in Firebase, simpler to fetch and sort client side if small data
                    limit(20) 
                );
                const snapTasks = await getDocs(qTasks);
                
                const tasks = snapTasks.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Simple sort by date client-side
                tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                
                setTotalTasks(tasks.length);
                if (tasks.length > 0) {
                    setUpcomingDeadline(tasks[0]);
                } else {
                    // Fallback Dummy Data if no real tasks exist yet
                    setUpcomingDeadline({
                        title: "MRCS Part B Application",
                        dueDate: "2025-11-30"
                    });
                    setTotalTasks(3);
                }

            } catch (error) {
                console.error("Error fetching tasks:", error);
                // Fallback UI
                setUpcomingDeadline({
                    title: "Submit Audit Proposal",
                    dueDate: "2025-12-15"
                });
                setTotalTasks(1);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-8 md:p-10 bg-gray-50 min-h-full">
            <h1 className="text-4xl font-bold text-slate-800 mb-8">
                Welcome Back, {userName}
            </h1>

            <div className="grid grid-cols-12 gap-8">

                {/* Left Column (8/12 - Metrics and Charts) */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    
                    {/* DEADLINE BAR */}
                    <DeadlineBar 
                        task={upcomingDeadline} 
                        pendingCount={totalTasks}
                        onClick={() => setActiveView('tasks')} 
                    />

                    {/* METRIC ROW - CLICKABLE */}
                    <div>
                        <MetricCard 
                            title="Total Activities Logged"
                            value={DUMMY_DATA.activitiesLogged}
                            subtext="Consistent progress! Avg. 5 logs per week."
                            icon={<Calendar size={28} />}
                            className="border-l-4 border-l-blue-400"
                            onClick={() => setActiveView('portfolio')} // NAVIGATE TO PORTFOLIO
                        />
                    </div>

                    {/* CHARTS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProgressGauge 
                            totalPoints={DUMMY_DATA.totalPoints} 
                            goalPoints={DUMMY_DATA.goalPoints} 
                            infoContent={goalInfo}
                        />
                        <RadarChartComponent infoContent={readinessInfo} />
                    </div>
                </div> 

                {/* Right Column (4/12 - Network and Events) */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    
                    {/* My Network */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800">My Network</h3>
                        <div className="space-y-4">
                            {networkContacts.length > 0 ? (
                                networkContacts.map(contact => (
                                    <div 
                                        key={contact.id} 
                                        onClick={() => setSelectedContact(contact)}
                                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-indigo-200 transition-colors">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-800 truncate">{contact.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{contact.role}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No contacts yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800">Upcoming Events</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer" onClick={() => setActiveView('events')}>
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                                    <CalendarCheck size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">MRCS Part A Exam</p>
                                    <p className="text-sm text-gray-500">14 Jan 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer" onClick={() => setActiveView('events')}>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <CalendarCheck size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">ATLS Recertification</p>
                                    <p className="text-sm text-gray-500">22 Mar 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Render Modal if a contact is selected */}
            <ContactDetailModal 
                contact={selectedContact} 
                onClose={() => setSelectedContact(null)} 
            />
        </div>
    );
}