import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Globe } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from '../firebase'; // Adjust path if your firebase.js is in src/config/

// --- SHARED CONTACT DATA ---
import { CONTACT_CHANNELS } from '../data/contactData';

export default function LandingPage() {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  
  // --- AUTH STATE ---
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup' | null
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- AUTH HANDLERS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
      setLoading(false);
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setError('');
    setEmail('');
    setPassword('');
  };

  const closeModals = () => {
    setShowAbout(false);
    setShowContact(false);
    setAuthMode(null);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>YourSurgicalCareer.com</div>
        <div style={styles.navLinks}>
          <button onClick={() => setShowAbout(true)} style={styles.navLink}>About</button>
          <button onClick={() => setShowContact(true)} style={styles.navLink}>Contact</button>
        </div>
      </nav>

      <main style={styles.hero}>
        <h1 style={styles.headline}>Redefining the Future of <br /><span style={styles.underlineHighlight}>Surgical Training</span></h1>
        <p style={styles.subtext}>Join us to revolutionize surgical training. Everything you need for your career as a surgeon, all in one place.</p>
        <div style={styles.buttonGroup}>
          <button style={styles.signUpBtn} onClick={() => openAuth('signup')}>Sign Up</button>
          <button style={styles.logInBtn} onClick={() => openAuth('login')}>Log In</button>
        </div>
      </main>

      {/* --- MODALS OVERLAY --- */}
      {(showAbout || showContact || authMode) && (
        <div style={styles.modalOverlay} onClick={closeModals}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            
            {/* 1. ABOUT MODAL */}
            {showAbout && (
              <>
                <h2 style={styles.modalTitle}>About Us</h2>
                <p style={styles.modalText}>Your Surgical Career is a centralized platform designed to streamline the complex journey of surgical training.</p>
                <button style={styles.closeBtn} onClick={closeModals}>Close</button>
              </>
            )}
            
            {/* 2. CONTACT MODAL */}
            {showContact && (
              <>
                <h2 style={styles.modalTitle}><Globe size={24} style={{verticalAlign:'middle', marginRight:'10px'}}/>Contact Hub</h2>
                <p style={{color:'#94a3b8', marginBottom:'20px'}}>Connect with our team through our primary channels.</p>
                <div style={styles.contactGrid}>
                  {CONTACT_CHANNELS.map((channel, index) => (
                    <a key={index} href={channel.link} target="_blank" rel="noreferrer" style={styles.contactCard}>
                      <channel.icon size={28} color={channel.hex} style={{marginBottom: '10px'}} />
                      <div style={styles.contactLabel}>{channel.label}</div>
                      <div style={styles.contactDetail}>{channel.detail}</div>
                      <div style={{...styles.actionLink, color: channel.hex}}>Connect &gt;</div>
                    </a>
                  ))}
                </div>
                <div style={styles.locationCard}>
                    <MapPin size={24} color="#94a3b8" style={{marginBottom: '8px'}} />
                    <div style={styles.contactLabel}>Operational Address</div>
                    <div style={styles.contactDetail}>Royal College of Surgeons (RCS), London, UK</div>
                </div>
                <button style={styles.closeBtn} onClick={closeModals}>Close</button>
              </>
            )}

            {/* 3. AUTH MODAL (LOGIN / SIGNUP) */}
            {authMode && (
              <form onSubmit={handleAuthSubmit} style={{width: '100%'}}>
                 <h2 style={styles.modalTitle}>
                   {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                 </h2>
                 
                 {error && <div style={styles.errorMessage}>{error}</div>}

                 <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                 />
                 <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                 />
                 
                 <button type="submit" style={styles.submitBtn} disabled={loading}>
                    {loading ? 'Processing...' : (authMode === 'signup' ? 'Sign Up' : 'Log In')}
                 </button>

                 <div style={{marginTop: '15px', fontSize: '0.9rem', color: '#94a3b8'}}>
                    {authMode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                    <span 
                      style={{color: '#2dd4bf', cursor: 'pointer', fontWeight: 'bold'}}
                      onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    >
                      {authMode === 'signup' ? 'Log In' : 'Sign Up'}
                    </span>
                 </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const styles = {
  container: { backgroundColor: '#0B1120', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', position: 'relative', zIndex: 50 },
  logo: { fontWeight: 'bold', fontSize: '1.2rem' },
  navLinks: { display: 'flex', gap: '20px' },
  navLink: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1rem', zIndex: 60 },
  hero: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginTop: '-50px', zIndex: 1 },
  headline: { fontFamily: 'serif', fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '20px', fontWeight: '700', color: '#fff' },
  underlineHighlight: { borderBottom: '4px solid #2dd4bf', display: 'inline-block', lineHeight: '0.8', paddingBottom: '5px' },
  subtext: { color: '#94a3b8', maxWidth: '600px', fontSize: '1.1rem', marginBottom: '40px' },
  buttonGroup: { display: 'flex', gap: '20px', marginBottom: '30px' },
  signUpBtn: { backgroundColor: '#2dd4bf', color: '#0f172a', border: 'none', padding: '12px 32px', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  logInBtn: { backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #334155', padding: '12px 32px', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  
  // MODAL & FORM STYLES
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' },
  modalContent: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', maxWidth: '500px', width: '90%', textAlign: 'center', border: '1px solid #334155', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  modalTitle: { color: '#2dd4bf', marginBottom: '20px', fontSize: '1.8rem', fontWeight: 'bold' },
  modalText: { color: '#e2e8f0', marginBottom: '10px', lineHeight: '1.6' },
  
  // FORM INPUTS
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: 'white',
    fontSize: '1rem'
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2dd4bf',
    color: '#0f172a',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  errorMessage: {
    color: '#ef4444',
    marginBottom: '15px',
    fontSize: '0.9rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '10px',
    borderRadius: '4px',
    width: '100%'
  },
  
  contactGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px', marginTop: '20px', width: '100%' },
  contactCard: { backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', transition: 'transform 0.2s', border: '1px solid #334155', cursor: 'pointer' },
  contactLabel: { color: '#fff', fontWeight: 'bold', fontSize: '1rem', marginBottom: '5px' },
  contactDetail: { color: '#94a3b8', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '10px' },
  actionLink: { fontSize: '0.8rem', fontWeight: 'bold', marginTop: 'auto' },
  locationCard: { backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #334155', marginTop: '10px', width: '100%' },
  closeBtn: { marginTop: '25px', background: '#334155', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};