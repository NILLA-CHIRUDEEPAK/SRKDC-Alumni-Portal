import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    full_name: '', batch: '', company: '', pin: '', email: '', 
    linkedin_url: '', is_hiring: false, hiring_role: '', 
    skills: '', advice: '', can_help_with: 'Career Guidance' 
  });

  const ADMIN_MASTER_PIN = "SRKDC2026";
  const API_URL = 'http://127.0.0.1:8000/api/alumni/';

  useEffect(() => { fetchAlumni(); }, []);

  const fetchAlumni = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlumniList(Array.isArray(response.data) ? response.data : []);
    } catch (error) { console.error("Database Error"); }
  };

  const getFieldTheme = (company) => {
    const text = (company || "").toLowerCase();
    if (text.includes('army')) return { color: "#365314", img: "/army.jpg.png", label: "ARMY" };
    if (text.includes('navy')) return { color: "#1e3a8a", img: "/navy.jpg.png", label: "NAVY" };
    if (text.includes('police')) return { color: "#1e1b4b", img: "/police.jpg.png", label: "POLICE" };
    if (text.includes('bank')) return { color: "#0d9488", img: "/banking.jpg.png", label: "BANKER" };
    if (text.includes('railway')) return { color: "#0369a1", img: "/railway.jpg.png", label: "RAILWAY" };
    if (text.includes('software') || text.includes('tech')) return { color: "#d4af37", img: "/software.jpg.png", label: "TECH" };
    if (text.includes('farmer') || text.includes('agri')) return { color: "#16a34a", img: "/farmer.jpg.png", label: "AGRI" };
    if (text.includes('doctor')) return { color: "#be123c", img: "/doctor.jpg.png", label: "MEDICAL" };
    if (text.includes('lawyer')) return { color: "#451a03", img: "/lawyer.jpg.png", label: "LEGAL" };
    if (text.includes('business')) return { color: "#7c3aed", img: "/business.jpg.png", label: "BUSINESS" };
    return { color: "#1e3a8a", img: "/student.jpg.png", label: "ALUMNI" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${API_URL}${editingId}/`, formData);
      else await axios.post(API_URL, formData);
      closeForm(); fetchAlumni();
    } catch (error) { alert("Save failed!"); }
  };

  const closeForm = () => {
    setShowForm(false); setEditingId(null);
    setFormData({ full_name: '', batch: '', company: '', pin: '', email: '', linkedin_url: '', is_hiring: false, hiring_role: '', skills: '', advice: '', can_help_with: 'Career Guidance' });
  };

  const filteredAlumni = alumniList.filter(p => {
    const matchesSearch = (p.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.company || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'hiring' ? p.is_hiring : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ 
      backgroundImage: "url('/bg.jpg.png')", 
      backgroundSize: 'cover', 
      backgroundAttachment: 'fixed', 
      backgroundPosition: 'center',
      minHeight: '100vh', 
      padding: '20px', 
      fontFamily: 'Arial' 
    }}>
      {/* Dark Overlay to make cards pop */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 1. DASHBOARD */}
        <div style={{ maxWidth: '1100px', margin: '0 auto 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <div onClick={() => setFilterType('all')} style={{ cursor: 'pointer', background: '#1e3a8a', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', border: filterType === 'all' ? '3px solid #fff' : 'none' }}>
            <h2 style={{ margin: 0 }}>{alumniList.length}</h2><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>ALUMNI</p>
          </div>
          <div onClick={() => setFilterType('hiring')} style={{ cursor: 'pointer', background: '#10b981', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', border: filterType === 'hiring' ? '3px solid #fff' : 'none' }}>
            <h2 style={{ margin: 0 }}>{alumniList.filter(a => a.is_hiring).length}</h2><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>HIRING</p>
          </div>
          <div style={{ background: '#3b82f6', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
            <h2 style={{ margin: 0 }}>{alumniList.length}</h2><p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>MENTORS</p>
          </div>
        </div>

        {/* 2. SEARCH */}
        <div style={{ maxWidth: '1100px', margin: '0 auto 30px', display: 'flex', background: 'white', padding: '10px', borderRadius: '50px', border: '3px solid #1e3a8a' }}>
          <input 
            type="text" placeholder="Search (Railway, Bank, Agri, Software)..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', padding: '10px 25px', outline: 'none', fontSize: '18px', color: '#000' }}
          />
          <button onClick={() => setShowForm(true)} style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>+ REGISTER</button>
        </div>

        {/* 3. CARDS */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '30px' }}>
          {filteredAlumni.map(person => {
            const theme = getFieldTheme(person.company);
            return (
              <div key={person.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', borderTop: `8px solid ${theme.color}` }}>
                <div style={{ height: '170px', backgroundImage: `url(${theme.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, background: theme.color, color: 'white', padding: '5px 15px', fontSize: '11px', fontWeight: 'bold', borderTopRightRadius: '10px' }}>{theme.label}</div>
                  <button onClick={() => {
                    const p = prompt("Enter PIN:");
                    if(p === person.pin || p === ADMIN_MASTER_PIN) { setEditingId(person.id); setFormData(person); setShowForm(true); }
                  }} style={{ position: 'absolute', top: 10, right: 10, borderRadius: '50%', border: 'none', width: '35px', height: '35px', cursor: 'pointer', background: 'white' }}>✏️</button>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>{(person.full_name || "").toUpperCase()}</h3>
                  <p style={{ margin: '5px 0', color: theme.color, fontWeight: 'bold' }}>{(person.company || "").toUpperCase()}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '15px 0' }}>
                    {(person.skills || "General").split(',').map((s, i) => (
                      <span key={i} style={{ fontSize: '11px', background: '#f1f5f9', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', color: '#475569' }}>#{s.trim()}</span>
                    ))}
                  </div>
                  {person.is_hiring && (
                    <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', border: '1px solid #10b981' }}>
                      🚀 HIRING: {(person.hiring_role || "").toUpperCase()}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href={`mailto:${person.email}`} style={{ flex: 1, textAlign: 'center', background: '#eff6ff', color: '#1e3a8a', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>EMAIL</a>
                    <a href={person.linkedin_url} target="_blank" style={{ flex: 1, textAlign: 'center', background: '#0077b5', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>LINKEDIN</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#1e3a8a', marginTop: 0 }}>Register</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
              <input type="text" placeholder="Full Name" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ padding: '12px', color: '#000', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Profession (Army, Banker, Farmer, Software)" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ padding: '12px', color: '#000', border: '1px solid #ddd' }} />
              <input type="text" placeholder="Skills" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} style={{ padding: '12px', color: '#000', border: '1px solid #ddd' }} />
              <textarea placeholder="Advice..." value={formData.advice} onChange={e => setFormData({...formData, advice: e.target.value})} style={{ padding: '12px', color: '#000', border: '1px solid #ddd', height: '80px' }} />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '12px', color: '#000' }} />
              <input type="url" placeholder="LinkedIn" required value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} style={{ padding: '12px', color: '#000' }} />
              <div style={{ color: '#000' }}><input type="checkbox" checked={formData.is_hiring} onChange={e => setFormData({...formData, is_hiring: e.target.checked})} /> Hiring?</div>
              {formData.is_hiring && <input type="text" placeholder="Role" value={formData.hiring_role} onChange={e => setFormData({...formData, hiring_role: e.target.value})} style={{ padding: '12px', color: '#000', border: '1px solid #10b981' }} />}
              <input type="password" placeholder="4-Digit PIN" required value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} style={{ padding: '12px', color: '#000' }} />
              <button type="submit" style={{ background: '#10b981', color: 'white', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>SAVE PROFILE</button>
              <button type="button" onClick={closeForm} style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '10px', border: 'none' }}>CANCEL</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;