// src/pages/PersonalDev.js - Detailed Personal Development Guide
import React from 'react';
import { 
    Stethoscope, Microscope, Users, Heart, 
    ArrowRight, BookOpen, Award, Globe, Music, Activity 
} from 'lucide-react';

const DEVELOPMENT_SECTIONS = [
    {
        id: 'clinical',
        title: "Clinical & Professional Development",
        description: "Gain hands-on experience and deepen your clinical understanding.",
        icon: <Stethoscope size={28} className="text-blue-600" />,
        items: [
            {
                title: "Volunteering & Shadowing",
                desc: "Seek opportunities in hospitals or clinics to gain practical experience and observe specialists in action.",
                link: "Find local opportunities →"
            },
            {
                title: "Clinical Seminars & Internships",
                desc: "Attend extra talks to expand your knowledge and pursue voluntary clerkships for hands-on skills beyond the curriculum.",
                link: "Browse upcoming seminars →"
            },
            {
                title: "Work Experience (CNA, EMT)",
                desc: "Obtain certifications like Certified Nursing Assistant or EMT to gain valuable front-line experience.",
                link: "Learn about certifications →"
            }
        ]
    },
    {
        id: 'research',
        title: "Research & Academic Enrichment",
        description: "Develop analytical skills and contribute to the scientific community.",
        icon: <Microscope size={28} className="text-purple-600" />,
        items: [
            {
                title: "Research Assistant & Publishing",
                desc: "Work on research studies to develop analytical skills and contribute to scientific literature to hone communication skills.",
                link: "Find research projects →"
            },
            {
                title: "Online Courses & Academic Competitions",
                desc: "Stay current on medical topics with online courses and test your knowledge in academic contests.",
                link: "Explore online courses →"
            }
        ]
    },
    {
        id: 'leadership',
        title: "Leadership & Community Engagement",
        description: "Develop your teaching, teamwork, and leadership abilities.",
        icon: <Users size={28} className="text-emerald-600" />,
        items: [
            {
                title: "Tutoring & Teaching",
                desc: "Tutor fellow students to reinforce your own knowledge and develop essential teaching skills for your surgical career.",
                link: "Become a mentor →"
            },
            {
                title: "Student Government & Clubs",
                desc: "Join student government or academic leagues to develop leadership and teamwork skills.",
                link: "See university clubs →"
            },
            {
                title: "Community Service",
                desc: "Participate in health awareness campaigns or local initiatives to serve the public and understand community health needs.",
                link: "Find local charities →"
            }
        ]
    },
    {
        id: 'personal',
        title: "Personal & Well-being",
        description: "Maintain a healthy work-life balance to ensure long-term success and prevent burnout.",
        icon: <Heart size={28} className="text-red-500" />,
        items: [
            {
                title: "Sports & Physical Health",
                desc: "Engage in team sports to demonstrate teamwork and a commitment to physical and mental health.",
                link: null
            },
            {
                title: "Arts, Culture & Hobbies",
                desc: "Participate in artistic activities like music, drama, or writing to provide a creative outlet and improve mental well-being.",
                link: null
            },
            {
                title: "Language Courses",
                desc: "Learn a new language to communicate with a broader range of patients and colleagues.",
                link: null
            }
        ]
    }
];

export default function PersonalDev() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-10 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Personal Development Guide</h1>
                <p className="text-lg text-gray-600">
                    A curated guide to extracurricular activities that strengthen your profile, enhance your skills, and support your well-being throughout your surgical training.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="space-y-12">
                {DEVELOPMENT_SECTIONS.map((section) => (
                    <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Section Header */}
                        <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                {section.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                                <p className="text-gray-600 mt-1">{section.description}</p>
                            </div>
                        </div>

                        {/* Items Grid */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group flex flex-col h-full bg-white"
                                >
                                    <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                                        {item.desc}
                                    </p>
                                    
                                    {item.link && (
                                        <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all mt-auto self-start">
                                            {item.link}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}