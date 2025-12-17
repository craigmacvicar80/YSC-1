import React, { useEffect, useState } from 'react';
import { 
    Award, Calendar, Info, 
    CalendarCheck, Mail, Phone, Briefcase, X, CheckCircle, ChevronRight, AlertCircle, 
    UserPlus, Users
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
import { collection, query, limit, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext'; 

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- HELPER: Categorize Activities ---
const getSmartCategory = (act) => {
    const text = `${act.category || ''} ${act.type || ''} ${act.description || ''}`.toLowerCase();
    if (text.includes('exam')) return 'Exams';
    if (text.includes('public')) return 'Publications';
    if (text.includes('teach')) return 'Teaching';
    if (text.includes('audit')) return 'Audit/QIP';
    if (text.includes('course')) return 'Courses';
    return 'Other'; 
};

// --- HELPER: Date Parser ---
const parseDate = (input) => {
    if (!input) return null;
    if (input.toDate) return input.toDate(); 
    return new Date(input); 
};

const TARGET_POINTS = 40; 

// --- SUB-COMPONENTS ---
const DeadlineBar = ({ task, pendingCount, onClick }) => {
    if (!task) return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm text-green-500"><CheckCircle size={20} /></div>
                <div><h4 className="font-bold text-slate-800">No Upcoming Deadlines</h4><p className="text-sm text-slate-600">You are all caught up!</p></div>
            </div>
            <button onClick={onClick} className="flex items-center gap-2 text-green-600 font-medium text-sm hover:underline">View Tasks <ChevronRight size={16} /></button>
        </div>
    );
    const dateObj = parseDate(task.displayDate);
    const dateStr = dateObj ? dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No Date';
    return (
        <div onClick={onClick} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm flex items-center justify-between mb-6 cursor-pointer hover:bg-orange-100 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm text-orange-500"><AlertCircle size={20} /></div>
                <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-orange-700 transition-colors">Upcoming: {task.title}</h4>
                    <p className="text-sm text-slate-600">Due: <span className="font-bold">{dateStr}</span> • {pendingCount} tasks pending</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">Go to Tasks <ChevronRight size={16} /></div>
        </div>
    );
};

const MetricCard = ({ title, value, subtext, icon, onClick, className }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-xl transition-shadow ${className}`} onClick={onClick}>
        <div>
            <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
            <h3 className="text-4xl font-bold text-slate-800">{value}</h3>
            {subtext && <p className="text-blue-600 text-sm mt-2 font-medium">{subtext}</p>}
        </div>
        <div className="p-4 bg-blue-50 text-blue-600 rounded-full">{icon}</div>
    </div>
);

const ProgressGauge = ({ totalPoints, goalPoints, infoContent }) => {
    const percentage = Math.min(100, Math.round((totalPoints / goalPoints) * 100));
    return (
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-800">Progress to Goal</h3>
                {infoContent && <div className="group relative"><Info size={20} className="text-blue-500 cursor-pointer" /><div className="absolute right-0 top-full mt-2 hidden w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl group-hover:block z-50">{infoContent}</div></div>}
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-6">
                <div className="relative w-56 h-56">
                    <div className="w-full h-full rounded-full flex items-center justify-center" style={{background: `conic-gradient(#2563EB ${percentage * 3.6}deg, #F3F4F6 0deg)`}}>
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

const RadarChartComponent = ({ infoContent, categoryScores }) => {
    const scores = categoryScores || { exams: 0, publications: 0, teaching: 0, audit: 0, courses: 0 };
    const chartData = [Math.min(100, scores.exams * 10), Math.min(100, scores.publications * 10), Math.min(100, scores.teaching * 10), Math.min(100, scores.audit * 10), Math.min(100, scores.courses * 10)];
    
    const data = {
        labels: ['Exams', 'Publications', 'Teaching', 'Audit/QIP', 'Courses'],
        datasets: [{ label: 'Readiness %', data: chartData, backgroundColor: 'rgba(37, 99, 235, 0.2)', borderColor: '#2563EB', borderWidth: 2, pointBackgroundColor: '#2563EB', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: '#2563EB' }],
    };
    const options = { layout: { padding: 20 }, scales: { r: { angleLines: { color: '#E5E7EB' }, grid: { color: '#E5E7EB' }, pointLabels: { font: { size: 12, family: "'Inter', sans-serif" }, color: '#4B5563' }, ticks: { display: false, backdropColor: 'transparent' }, suggestedMin: 0, suggestedMax: 100 } }, plugins: { legend: { display: false } }, maintainAspectRatio: false };

    return (
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800">Portfolio Readiness</h3>
                {infoContent && <div className="group relative"><Info size={20} className="text-blue-500 cursor-pointer" /><div className="absolute right-0 top-full mt-2 hidden w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl group-hover:block z-50">{infoContent}</div></div>}
            </div>
            <div className="flex-1 min-h-[250px] relative"><Radar data={data} options={options} /></div>
        </div>
    );
};

const ContactDetailModal = ({ contact, onClose }) => {
    if (!contact) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">{contact.name.charAt(0)}</div>
                        <div><h2 className="text-xl font-bold text-slate-800">{contact.name}</h2><p className="text-blue-600 font-medium">{contact.role}</p></div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-4">
                    {contact.hospital && <div className="flex items-center gap-3 text-gray-700"><Briefcase size={20} className="text-gray-400 shrink-0" /><span>{contact.hospital}</span></div>}
                    {contact.email && <div className="flex items-center gap-3 text-gray-700"><Mail size={20} className="text-gray-400 shrink-0" /><a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">{contact.email}</a></div>}
                    {contact.phone && <div className="flex items-center gap-3 text-gray-700"><Phone size={20} className="text-gray-400 shrink-0" /><span>{contact.phone}</span></div>}
                    {contact.notes && <div className="mt-4 pt-4 border-t border-gray-100"><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</h4><p className="text-sm text-gray-600 italic">"{contact.notes}"</p></div>}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center"><button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Close</button></div>
            </div>
        </div>
    );
};

export default function Dashboard({ setActiveView }) {
    const { currentUser } = useAuth();
    
    const [networkContacts, setNetworkContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [upcomingDeadline, setUpcomingDeadline] = useState(null);
    const [totalTasks, setTotalTasks] = useState(0);
    const [userProfile, setUserProfile] = useState(null);
    const [dashboardMetrics, setDashboardMetrics] = useState({ totalPoints: 0, activitiesLogged: 0, categoryScores: { exams: 0, publications: 0, teaching: 0, audit: 0, courses: 0 } });

    // 1. MAIN DATA (Profile, Activities, Array-based Contacts & Tasks)
    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setUserProfile(data);

                    // Metrics
                    const activities = data.activities || [];
                    const calculatedPoints = activities.reduce((sum, act) => sum + (Number(act.points) || 0), 0);
                    const breakdown = { exams: 0, publications: 0, teaching: 0, audit: 0, courses: 0 };
                    activities.forEach(act => {
                        const pts = Number(act.points) || 0;
                        const cat = getSmartCategory(act);
                        if (cat === 'Exams') breakdown.exams += pts;
                        else if (cat === 'Publications') breakdown.publications += pts;
                        else if (cat === 'Teaching') breakdown.teaching += pts;
                        else if (cat === 'Audit/QIP') breakdown.audit += pts;
                        else if (cat === 'Courses') breakdown.courses += pts;
                    });
                    setDashboardMetrics({ totalPoints: calculatedPoints, activitiesLogged: activities.length, categoryScores: breakdown });
                }
            });
            return () => unsub();
        }
    }, [currentUser]);

    // 2. CONTACTS & TASKS
    useEffect(() => {
        if (!currentUser) return;

        // A. CONTACTS FETCH (Strictly User Specific)
        const fetchContacts = async () => {
            try {
                // Fetch ONLY from users/{uid}/contacts
                const qSub = query(collection(db, "users", currentUser.uid, "contacts"), limit(5));
                const snapSub = await getDocs(qSub);
                const foundContacts = snapSub.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                setNetworkContacts(foundContacts);
            } catch (error) { 
                console.error("Contacts fetch error:", error);
                setNetworkContacts([]); // Ensure empty array on error
            }
        };
        fetchContacts();

        // B. TASKS SYNC
        let subColTasks = [];
        let docArrTasks = [];

        const processTasks = () => {
            const allTasks = [...subColTasks, ...docArrTasks].map(d => ({
                id: d.id || Math.random().toString(),
                title: d.title || d.task || d.text || d.description || 'Untitled',
                rawDate: d.dueDate || d.date || d.deadline || null,
                displayDate: d.dueDate || d.date || d.deadline || null, 
                statusLower: (d.status || '').toLowerCase(),
                isBooleanDone: d.completed === true
            }));

            const active = allTasks.filter(t => t.rawDate && !t.isBooleanDone && t.statusLower !== 'completed' && t.statusLower !== 'done');
            active.sort((a, b) => {
                const da = parseDate(a.rawDate);
                const db = parseDate(b.rawDate);
                if (!da) return 1; if (!db) return -1;
                return da - db;
            });

            setTotalTasks(active.length);
            setUpcomingDeadline(active.length > 0 ? active[0] : null);
        };

        const qSub = query(collection(db, "users", currentUser.uid, "tasks"));
        const unsubSub = onSnapshot(qSub, (s) => {
            subColTasks = s.docs.map(d => ({ id: d.id, ...d.data() }));
            processTasks();
        });

        const unsubDoc = onSnapshot(doc(db, "users", currentUser.uid), (s) => {
            if (s.exists()) {
                const d = s.data();
                if (d.tasks && Array.isArray(d.tasks)) {
                    docArrTasks = d.tasks;
                    processTasks();
                }
            }
        });

        return () => { unsubSub(); unsubDoc(); };

    }, [currentUser]);

    const displayName = userProfile?.name || (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : null) || (currentUser?.email ? currentUser.email.split('@')[0] : 'Registrar');

    const goalInfo = (<><h4 className="font-bold text-base mb-1">Competitive Goal Explained</h4>This tracks your points against the minimum required score ({TARGET_POINTS}) for a competitive ST3 application.</>);
    const readinessInfo = (<><h4 className="font-bold text-base mb-1">Portfolio Readiness Explained</h4>This plot visualizes your real point distribution across key national curriculum domains.</>);

    return (
        <div className="p-8 md:p-10 bg-gray-50 min-h-full">
            <h1 className="text-4xl font-bold text-slate-800 mb-8">Welcome Back, {displayName}</h1>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <DeadlineBar task={upcomingDeadline} pendingCount={totalTasks} onClick={() => setActiveView('tasks')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MetricCard title="Total Points" value={dashboardMetrics.totalPoints} subtext="Combined score from all activities." icon={<Award size={28} />} className="border-l-4 border-l-blue-600" onClick={() => setActiveView('portfolio')} />
                        <MetricCard title="Activities Logged" value={dashboardMetrics.activitiesLogged} subtext="Total items in your activity log." icon={<Calendar size={28} />} className="border-l-4 border-l-blue-400" onClick={() => setActiveView('portfolio')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProgressGauge totalPoints={dashboardMetrics.totalPoints} goalPoints={TARGET_POINTS} infoContent={goalInfo} />
                        <RadarChartComponent infoContent={readinessInfo} categoryScores={dashboardMetrics.categoryScores} />
                    </div>
                </div> 
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800">My Network</h3>
                        <div className="space-y-4">
                            {/* EMPTY STATE HANDLING */}
                            {networkContacts.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No contacts added yet.</p>
                                    <button onClick={() => setActiveView('network')} className="mt-2 text-blue-600 text-xs font-bold hover:underline flex items-center justify-center gap-1">
                                        <UserPlus size={12} /> Add Contact
                                    </button>
                                </div>
                            ) : (
                                networkContacts.map(contact => (
                                    <div key={contact.id} onClick={() => setSelectedContact(contact)} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer group border border-transparent hover:border-gray-200">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">{contact.name.charAt(0)}</div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-800 truncate">{contact.name}</p>
                                            <p className="text-sm text-blue-600 truncate">{contact.role}</p>
                                            {(contact.hospital || contact.email || contact.phone) && (
                                                <div className="flex gap-3 mt-1 text-gray-400 text-xs items-center">
                                                    {contact.hospital && <span className="truncate flex items-center gap-1"><Briefcase size={10} /> {contact.hospital}</span>}
                                                    {contact.email && <Mail size={10} />}
                                                    {contact.phone && <Phone size={10} />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800">Upcoming Events</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer" onClick={() => setActiveView('events')}>
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0"><CalendarCheck size={24} /></div>
                                <div><p className="font-bold text-slate-800">MRCS Part A Exam</p><p className="text-sm text-gray-500">14 Jan 2026</p></div>
                            </div>
                            <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer" onClick={() => setActiveView('events')}>
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0"><CalendarCheck size={24} /></div>
                                <div><p className="font-bold text-slate-800">ATLS Recertification</p><p className="text-sm text-gray-500">22 Mar 2026</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ContactDetailModal contact={selectedContact} onClose={() => setSelectedContact(null)} />
        </div>
    );
}