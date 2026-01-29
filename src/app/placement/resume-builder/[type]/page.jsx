'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter, notFound } from 'next/navigation';

export default function ResumeBuilderPage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const resumeType = params.type; // 'beginner' or 'experienced'

    // Validate Route
    if (resumeType !== 'beginner' && resumeType !== 'experienced') {
        notFound();
    }

    const [resumeData, setResumeData] = useState({
        personal: {
            fullName: user?.name || '',
            email: user?.email || '',
            phone: '',
            location: '', // Combined City, Country
            linkedin: '',
            portfolio: '', // or other links
            summary: '', // Used as 'Objective' for beginners
            // Experienced specific
            currentRole: '',
            totalExp: '',
        },
        // Experienced flow specific
        objective: '', // Separate objective paragraph for experienced
        executiveSummary: [], // Array of { title: '', description: '' }
        education: [],
        experience: [],
        projects: [],
        // Refactored Skills for Beginner flow
        technicalSkills: [],
        softSkills: [],
        // Experienced specific
        expertise: [],
        certifications: [],
        achievements: [] // For Beginner Data Science Club etc.
    });

    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="resume-builder-container">
            <PrintStyles />
            <div style={{
                display: 'flex',
                height: 'calc(100vh - 64px)',
                background: '#f8fafc',
                overflow: 'hidden',
                fontFamily: 'Inter, sans-serif' // Editor font
            }}>
                {/* Left Panel - Editor */}
                <EditorPanel
                    resumeType={resumeType}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                    onBack={() => router.push('/placement')}
                />

                {/* Right Panel - Preview */}
                <PreviewPanel
                    resumeType={resumeType}
                    resumeData={resumeData}
                />
            </div>
        </div>
    );
}



// --- Editor Panel ---
function EditorPanel({ resumeType, activeTab, setActiveTab, resumeData, setResumeData, onBack }) {

    // Define tabs based on role
    const tabs = resumeType === 'beginner'
        ? [
            { id: 'personal', label: 'Personal', icon: '👤' },
            { id: 'education', label: 'Education', icon: '🎓' },
            { id: 'projects', label: 'Projects', icon: '🚀' },
            { id: 'certifications', label: 'Certifications', icon: '📜' },
            { id: 'skills', label: 'Skills', icon: '⚡' },
            { id: 'achievements', label: 'Awards', icon: '🏆' }
        ]
        : [
            { id: 'personal', label: 'Personal', icon: '👤' },
            { id: 'objective', label: 'Objective', icon: '🎯' },
            { id: 'summary', label: 'Summary', icon: '📋' },

            { id: 'experience', label: 'Experience', icon: '💼' },
            { id: 'projects', label: 'Projects', icon: '🚀' },
            { id: 'education', label: 'Education', icon: '🎓' },
            { id: 'certifications', label: 'Certs', icon: '📜' },
            { id: 'skills', label: 'Skills', icon: '⚡' },
            { id: 'achievements', label: 'Awards', icon: '🏆' }
        ];

    const handlePrint = () => window.print();

    // Data Handlers
    const handlePersonal = (e) => {
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [e.target.name]: e.target.value } }));
    };

    const addItem = (section, template) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], template] }));
    };
    const updateItem = (section, index, field, value) => {
        setResumeData(prev => {
            const arr = [...prev[section]];
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [section]: arr };
        });
    };
    const removeItem = (section, index) => {
        setResumeData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    // Simple Lists Handlers
    const addSimpleItem = (section) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], { name: '' }] }));
    };
    const updateSimpleItem = (section, index, value) => {
        setResumeData(prev => {
            const arr = [...prev[section]];
            arr[index] = { name: value };
            return { ...prev, [section]: arr };
        });
    };

    return (
        <div className="editor-sidebar" style={{ width: '480px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 10, boxShadow: '4px 0 24px rgba(0,0,0,0.02)' }}>
            {/* Toolbar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={onBack} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⬅️</button>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                        {resumeType === 'beginner' ? 'Fresher Template' : 'Pro Template'}
                    </h2>
                </div>
                <button onClick={handlePrint} style={downloadBtnStyle}>
                    <span style={{ fontSize: '16px' }}>📄</span> Download
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#ffffff', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', padding: '0 8px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '16px 16px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                            color: activeTab === tab.id ? '#2563eb' : '#64748b',
                            fontWeight: activeTab === tab.id ? '600' : '500',
                            fontSize: '13px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex', gap: '8px', alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>

                {/* PERSONAL */}
                {activeTab === 'personal' && (
                    <div className="space-y-6">
                        <SectionTitle>Contact Information</SectionTitle>
                        <Input label="Full Name" name="fullName" value={resumeData.personal.fullName} onChange={handlePersonal} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <Input label="Email" name="email" value={resumeData.personal.email} onChange={handlePersonal} />
                            <Input label="Mobile Number" name="phone" value={resumeData.personal.phone} onChange={handlePersonal} placeholder="+91..." />
                        </div>
                        <Input label="Location" name="location" value={resumeData.personal.location} onChange={handlePersonal} placeholder="e.g. Lucknow, India" />

                        {resumeType === 'experienced' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '16px' }}>
                                <Input label="Current Job Title" name="currentRole" value={resumeData.personal.currentRole} onChange={handlePersonal} />
                                <Input label="Total Experience" name="totalExp" value={resumeData.personal.totalExp} onChange={handlePersonal} />
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                            <Input label="LinkedIn URL" name="linkedin" value={resumeData.personal.linkedin} onChange={handlePersonal} placeholder="linkedin.com/in/..." />
                            <Input label="Link / Portfolio" name="portfolio" value={resumeData.personal.portfolio} onChange={handlePersonal} />
                        </div>

                        <div style={{ marginTop: '24px' }}>
                            <SectionTitle>{resumeType === 'beginner' ? 'Objective' : 'Professional Summary'}</SectionTitle>
                            <textarea
                                name="summary"
                                value={resumeData.personal.summary}
                                onChange={handlePersonal}
                                rows={5}
                                placeholder={resumeType === 'beginner' ? "Finance professional with a strong academic foundation..." : "Experienced professional with..."}
                                style={textAreaStyle}
                            />

                            {/* SAMPLE OBJECTIVES (BEGINNER) */}
                            {resumeType === 'beginner' && (
                                <div style={{ marginTop: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                                        Sample Objectives (Optional) - Copy & Paste if needed
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ fontSize: '12px', color: '#475569', padding: '8px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '4px', cursor: 'text', lineHeight: '1.4' }}>
                                            "Motivated graduate with a strong academic background, seeking to leverage analytical and problem-solving skills to contribute to organizational success."
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#475569', padding: '8px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '4px', cursor: 'text', lineHeight: '1.4' }}>
                                            "Detail-oriented individual looking for an entry-level position to utilize skills in [Major/Skill] and gain practical industry experience."
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* EDUCATION */}
                {activeTab === 'education' && (
                    <div>
                        <SectionHeader title="Education" onAdd={() => addItem('education', { school: '', location: '', degree: '', year: '', score: '' })} />
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('education', idx)} />
                                <Input label="Institution Name" value={edu.school} onChange={e => updateItem('education', idx, 'school', e.target.value)} placeholder="e.g. ATKP, Lucknow University" />
                                <Input label="Location" value={edu.location} onChange={e => updateItem('education', idx, 'location', e.target.value)} placeholder="e.g. Lucknow, India" style={{ marginTop: '8px' }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                                    <Input label="Degree / Course" value={edu.degree} onChange={e => updateItem('education', idx, 'degree', e.target.value)} placeholder="e.g. BBA" />
                                    <Input label="Graduation Year" value={edu.year} onChange={e => updateItem('education', idx, 'year', e.target.value)} placeholder="e.g. Jul 21" />
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <Input label="CGPA / Percentage" value={edu.score} onChange={e => updateItem('education', idx, 'score', e.target.value)} placeholder="e.g. 7.86/10.0" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* SKILLS (Beginner - Categorized) */}
                {activeTab === 'skills' && resumeType === 'beginner' && (
                    <div className="space-y-6">
                        <div>
                            <SectionHeader title="Technical Skills" onAdd={() => addSimpleItem('technicalSkills')} />
                            {resumeData.technicalSkills.map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                                    <input
                                        value={item.name}
                                        onChange={e => updateSimpleItem('technicalSkills', idx, e.target.value)}
                                        placeholder="e.g. Python, SQL"
                                        style={inputStyle}
                                    />
                                    <button onClick={() => removeItem('technicalSkills', idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <SectionHeader title="Professional / Soft Skills" onAdd={() => addSimpleItem('softSkills')} />
                            {resumeData.softSkills.map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                                    <input
                                        value={item.name}
                                        onChange={e => updateSimpleItem('softSkills', idx, e.target.value)}
                                        placeholder="e.g. Principled Integrity"
                                        style={inputStyle}
                                    />
                                    <button onClick={() => removeItem('softSkills', idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROJECTS (Beginner Focus) */}
                {activeTab === 'projects' && (
                    <div>
                        <SectionHeader title="Projects" onAdd={() => addItem('projects', { title: '', subtitle: '', date: '', description: '' })} />
                        {resumeData.projects.map((proj, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('projects', idx)} />
                                <Input label="Project Title" value={proj.title} onChange={e => updateItem('projects', idx, 'title', e.target.value)} placeholder="e.g. Havish M Consulting" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                                    <Input label="Subtitle / Context" value={proj.subtitle} onChange={e => updateItem('projects', idx, 'subtitle', e.target.value)} placeholder="e.g. EDA of Finance & Accounting" />
                                    <Input label="Date" value={proj.date} onChange={e => updateItem('projects', idx, 'date', e.target.value)} placeholder="e.g. FEB'23" />
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <label style={labelStyle}>Description (Bullet Points)</label>
                                    <textarea
                                        value={proj.description}
                                        onChange={e => updateItem('projects', idx, 'description', e.target.value)}
                                        rows={4}
                                        placeholder="• Developed and executed..."
                                        style={textAreaStyle}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CERTIFICATIONS (Beginner) */}
                {activeTab === 'certifications' && resumeType === 'beginner' && (
                    <div>
                        <SectionHeader title="Certifications" onAdd={() => addSimpleItem('certifications')} />
                        {resumeData.certifications.map((item, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('certifications', idx)} />
                                <input
                                    value={item.name}
                                    onChange={e => updateSimpleItem('certifications', idx, e.target.value)}
                                    placeholder="e.g. AWS Certified Solutions Architect - Associate"
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* ACHIEVEMENTS (Beginner) */}
                {activeTab === 'achievements' && (
                    <div>
                        <SectionHeader title="Achievements & Awards" onAdd={() => addSimpleItem('achievements')} />
                        {resumeData.achievements.map((item, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('achievements', idx)} />
                                <textarea
                                    value={item.name}
                                    onChange={e => updateSimpleItem('achievements', idx, e.target.value)}
                                    rows={2}
                                    placeholder="• Authored a 50-page research paper..."
                                    style={textAreaStyle}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* CERTIFICATIONS (Experienced) */}
                {activeTab === 'certifications' && resumeType === 'experienced' && (
                    <div>
                        <SectionHeader title="Certifications" onAdd={() => addSimpleItem('certifications')} />
                        {resumeData.certifications.map((item, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('certifications', idx)} />
                                <input
                                    value={item.name}
                                    onChange={e => updateSimpleItem('certifications', idx, e.target.value)}
                                    placeholder="e.g. PMP Certification, Google Cloud Professional"
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* OBJECTIVE (Experienced Only) */}
                {activeTab === 'objective' && resumeType === 'experienced' && (
                    <div className="space-y-6">
                        <SectionTitle>Objective Statement</SectionTitle>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                            Write a compelling paragraph highlighting your unique value proposition. Bold important keywords.
                        </p>
                        <textarea
                            value={resumeData.objective}
                            onChange={(e) => setResumeData(prev => ({ ...prev, objective: e.target.value }))}
                            rows={6}
                            placeholder="Finance professional with a strong academic foundation offering a unique blend of analytical rigor and business acumen..."
                            style={textAreaStyle}
                        />

                        {/* SAMPLE OBJECTIVES (EXPERIENCED) */}
                        <div style={{ marginTop: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                                Sample Objectives (Optional) - Copy & Paste if needed
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#475569', padding: '8px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '4px', cursor: 'text', lineHeight: '1.4' }}>
                                    "Results-oriented professional with [Number] years of experience in [Field], improving efficiency by [Metric]%. Proven track record in driving strategic initiatives."
                                </div>
                                <div style={{ fontSize: '12px', color: '#475569', padding: '8px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '4px', cursor: 'text', lineHeight: '1.4' }}>
                                    "Accomplished [Job Title] proficient in [Skill 1] and [Skill 2]. Seeking to leverage expertise in [Area] to deliver high-quality solutions for [Target Role]."
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* EXECUTIVE SUMMARY (Experienced Only) */}
                {activeTab === 'summary' && resumeType === 'experienced' && (
                    <div>
                        <SectionHeader title="Executive Summary" onAdd={() => addItem('executiveSummary', { title: '', description: '' })} />
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                            Add 3-4 summary items highlighting your key expertise areas.
                        </p>
                        {resumeData.executiveSummary.map((item, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('executiveSummary', idx)} />
                                <Input
                                    label="Title (e.g., 'Finance & Analysis Expertise')"
                                    value={item.title}
                                    onChange={e => updateItem('executiveSummary', idx, 'title', e.target.value)}
                                    placeholder="Finance & Analysis Expertise"
                                />
                                <div style={{ marginTop: '12px' }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea
                                        value={item.description}
                                        onChange={e => updateItem('executiveSummary', idx, 'description', e.target.value)}
                                        rows={3}
                                        placeholder="Gained proficiency in financial analysis, investor profiling, and pipeline development..."
                                        style={textAreaStyle}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* WORK EXPERIENCE (Experienced Only) */}
                {activeTab === 'experience' && resumeType === 'experienced' && (
                    <div>
                        <SectionHeader title="Work Experience / Internships" onAdd={() => addItem('experience', { company: '', location: '', position: '', dateRange: '', responsibilities: '' })} />
                        {resumeData.experience.map((exp, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('experience', idx)} />
                                <Input
                                    label="Company Name"
                                    value={exp.company}
                                    onChange={e => updateItem('experience', idx, 'company', e.target.value)}
                                    placeholder="e.g. INLK Financial Technologies"
                                />
                                <Input
                                    label="Location"
                                    value={exp.location}
                                    onChange={e => updateItem('experience', idx, 'location', e.target.value)}
                                    placeholder="e.g. Banglore, Karnatka"
                                    style={{ marginTop: '12px' }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginTop: '12px' }}>
                                    <Input label="Position / Role" value={exp.position} onChange={e => updateItem('experience', idx, 'position', e.target.value)} placeholder="e.g. Manager (Strategy)" />
                                    <Input label="Date Range" value={exp.dateRange} onChange={e => updateItem('experience', idx, 'dateRange', e.target.value)} placeholder="e.g. July 2024 - Till Date" />
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <label style={labelStyle}>Responsibilities (Bullet Points with Bold Keywords)</label>
                                    <textarea
                                        value={exp.responsibilities}
                                        onChange={e => updateItem('experience', idx, 'responsibilities', e.target.value)}
                                        rows={6}
                                        placeholder="• Competitor Analysis: Conducted comprehensive benchmarking..."
                                        style={textAreaStyle}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* SKILLS (Experienced - Categorized) */}
                {activeTab === 'skills' && resumeType === 'experienced' && (
                    <div className="space-y-6">
                        <div>
                            <SectionHeader title="Technical Skills" onAdd={() => addSimpleItem('technicalSkills')} />
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                                Add technical skills, tools, and software proficiency.
                            </p>
                            {resumeData.technicalSkills.map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                                    <input
                                        value={item.name}
                                        onChange={e => updateSimpleItem('technicalSkills', idx, e.target.value)}
                                        placeholder="e.g. Python, SQL, AutoCAD"
                                        style={inputStyle}
                                    />
                                    <button onClick={() => removeItem('technicalSkills', idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <SectionHeader title="Professional Skills" onAdd={() => addSimpleItem('softSkills')} />
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                                Add soft skills and professional qualities.
                            </p>
                            {resumeData.softSkills.map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                                    <input
                                        value={item.name}
                                        onChange={e => updateSimpleItem('softSkills', idx, e.target.value)}
                                        placeholder="e.g. Punctual Dexterity, Principled Integrity"
                                        style={inputStyle}
                                    />
                                    <button onClick={() => removeItem('softSkills', idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ACHIEVEMENTS (Experienced) */}
                {activeTab === 'achievements' && resumeType === 'experienced' && (
                    <div>
                        <SectionHeader title="Achievements & Awards" onAdd={() => addSimpleItem('achievements')} />
                        {resumeData.achievements.map((item, idx) => (
                            <div key={idx} style={cardStyle}>
                                <RemoveBtn onClick={() => removeItem('achievements', idx)} />
                                <textarea
                                    value={item.name}
                                    onChange={e => updateSimpleItem('achievements', idx, e.target.value)}
                                    rows={2}
                                    placeholder="• Authored a 50-page research paper on renewable energy sources..."
                                    style={textAreaStyle}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* EXPERIENCED TABS (Simplified for brevity, similar flow) */}
                {(activeTab === 'expertise') && resumeType === 'experienced' && (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                        <p>Detailed editing for {activeTab} coming in full implementation...</p>
                        <button style={{ marginTop: '10px', color: '#2563eb' }} onClick={() => addItem(activeTab, { name: 'Sample Item' })}>+ Add Sample Data</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Preview Panel (The Template) ---
function PreviewPanel({ resumeType, resumeData }) {
    // Render beginner template
    if (resumeType === 'beginner') {
        return (
            <div className="preview-panel-wrapper" style={{ flex: 1, background: '#e2e8f0', padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="resume-preview resume-page" style={{
                    width: '210mm', background: 'white', padding: '40px 50px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#000',
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: '11pt',
                    lineHeight: '1.4',
                    height: 'auto',
                    marginBottom: '40px'
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontSize: '24pt', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
                            {resumeData.personal.fullName || 'Your Name'}
                        </h1>
                        <div style={{ fontSize: '11pt', color: '#000' }}>
                            {resumeData.personal.email && <span style={{ textDecoration: 'underline', color: '#0000EE' }}>{resumeData.personal.email}</span>}
                            {resumeData.personal.phone && <span> | {resumeData.personal.phone}</span>}
                            {resumeData.personal.location && <span> | {resumeData.personal.location}</span>}
                        </div>
                        <div style={{ fontSize: '11pt', marginTop: '4px' }}>
                            {resumeData.personal.linkedin && <span style={{ textDecoration: 'underline', color: '#0000EE', marginRight: '8px' }}>LinkedIn</span>}
                            {resumeData.personal.portfolio && <span style={{ textDecoration: 'underline', color: '#0000EE' }}>Portfolio</span>}
                        </div>
                    </div>

                    {/* Objective */}
                    {resumeData.personal.summary && (
                        <div style={{ marginBottom: '20px' }}>
                            <SectionHeaderPreview title="OBJECTIVE" />
                            <p style={{ textAlign: 'justify' }}>{resumeData.personal.summary}</p>
                        </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <SectionHeaderPreview title="EDUCATION" />
                            {resumeData.education.map((edu, idx) => (
                                <div key={idx} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {edu.school}{edu.location ? `, ${edu.location}` : ''}
                                        </span>
                                        <span>{edu.year}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{edu.degree}</span>
                                        <span>{edu.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <SectionHeaderPreview title="PROJECTS" />
                            {resumeData.projects.map((proj, idx) => (
                                <div key={idx} style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 'bold' }}>{proj.title}</span>
                                        <span style={{ fontWeight: 'bold' }}>{proj.date}</span>
                                    </div>
                                    {proj.subtitle && <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{proj.subtitle}</div>}
                                    <div style={{ whiteSpace: 'pre-line', paddingLeft: '16px' }}>
                                        {(proj.description || '').split('\n').map((line, i) => (
                                            line.trim().startsWith('•')
                                                ? <div key={i}>{line}</div>
                                                : <div key={i}>• {line}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <SectionHeaderPreview title="CERTIFICATIONS" />
                            <ul style={{ margin: 0, paddingLeft: '24px' }}>
                                {resumeData.certifications.map((item, idx) => {
                                    const text = item.name || '';
                                    const displayText = text.trim().startsWith('•') ? text : `• ${text}`;
                                    return (
                                        <li key={idx} style={{ marginBottom: '4px' }}>
                                            {displayText}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Skills & Tools Knowledge */}
                    {(resumeData.technicalSkills.length > 0 || resumeData.softSkills.length > 0) && (
                        <div style={{ marginBottom: '20px' }}>
                            <SectionHeaderPreview title="SKILLS & TOOLS KNOWLEDGE" />
                            <ul style={{ margin: 0, paddingLeft: '24px', listStyle: 'disc' }}>
                                {resumeData.technicalSkills.length > 0 && (
                                    <li style={{ marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 'bold' }}>Technical - </span>
                                        {resumeData.technicalSkills.map(s => s.name).join(', ')}
                                    </li>
                                )}
                                {resumeData.softSkills.length > 0 && (
                                    <li style={{ marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 'bold' }}>Professional - </span>
                                        {resumeData.softSkills.map(s => s.name).join(', ')}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Achievements */}
                    {resumeData.achievements.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <SectionHeaderPreview title="ACHIEVEMENTS AND AWARDS" />
                            <ul style={{ margin: 0, paddingLeft: '24px' }}>
                                {resumeData.achievements.map((item, idx) => {
                                    const text = item.name || '';
                                    const displayText = text.trim().startsWith('•') ? text : `• ${text}`;
                                    return (
                                        <li key={idx} style={{ marginBottom: '8px', textAlign: 'justify' }}>
                                            {displayText}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Render experienced template
    return (
        <div className="preview-panel-wrapper" style={{ flex: 1, background: '#e2e8f0', padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="resume-preview resume-page" style={{
                width: '210mm', background: 'white', padding: '40px 50px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#000',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '11pt',
                lineHeight: '1.4',
                height: 'auto',
                marginBottom: '40px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '20pt', fontWeight: 'bold', marginBottom: '6px', color: '#000' }}>
                        {resumeData.personal.fullName || 'Your Name'}
                    </h1>
                    <div style={{ fontSize: '10.5pt', color: '#000' }}>
                        {resumeData.personal.email && <a href={`mailto:${resumeData.personal.email}`} style={{ textDecoration: 'underline', color: '#0000EE' }}>{resumeData.personal.email}</a>}
                        {resumeData.personal.phone && <span> | +91 {resumeData.personal.phone}</span>}
                        {resumeData.personal.location && <span> | {resumeData.personal.location}</span>}
                    </div>
                    <div style={{ fontSize: '10.5pt', marginTop: '2px' }}>
                        {resumeData.personal.linkedin && (
                            <>
                                <a href={resumeData.personal.linkedin} style={{ textDecoration: 'underline', color: '#0000EE' }}>LinkedIn</a>
                                {resumeData.personal.portfolio && <span> | </span>}
                            </>
                        )}
                        {resumeData.personal.portfolio && <a href={resumeData.personal.portfolio} style={{ textDecoration: 'underline', color: '#0000EE' }}>Portfolio</a>}
                    </div>
                </div>

                {/* Objective */}
                {resumeData.objective && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="OBJECTIVE" />
                        <p style={{ textAlign: 'justify', margin: 0 }}>{resumeData.objective}</p>
                    </div>
                )}

                {/* Executive Summary */}
                {resumeData.executiveSummary.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="EXECUTIVE SUMMARY" />
                        {resumeData.executiveSummary.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: '6px' }}>
                                <span style={{ fontWeight: 'bold' }}>{item.title}:</span> {item.description}
                            </div>
                        ))}
                    </div>
                )}

                {/* Work Experience / Internships */}
                {resumeData.experience.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="WORK EXPERIENCE / INTERNSHIPS" />
                        {resumeData.experience.map((exp, idx) => (
                            <div key={idx} style={{ marginBottom: '14px' }}>
                                {/* Company and Date */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {exp.company}{exp.location ? `, ${exp.location}` : ''}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>{exp.dateRange}</span>
                                </div>
                                {/* Position */}
                                {exp.position && (
                                    <div style={{ fontStyle: 'normal', marginBottom: '4px' }}>{exp.position}</div>
                                )}
                                {/* Responsibilities as bullets */}
                                {exp.responsibilities && (
                                    <ul style={{ margin: 0, paddingLeft: '24px', listStyle: 'disc' }}>
                                        {exp.responsibilities.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <li key={i} style={{ marginBottom: '4px', textAlign: 'justify' }}>
                                                {line.trim().startsWith('•') ? line.substring(1).trim() : line}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {resumeData.projects.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="PROJECTS" />
                        {resumeData.projects.map((proj, idx) => (
                            <div key={idx} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <span style={{ fontWeight: 'bold' }}>{proj.title}</span>
                                    <span style={{ fontWeight: 'bold' }}>{proj.date}</span>
                                </div>
                                {proj.subtitle && <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{proj.subtitle}</div>}
                                {proj.description && (
                                    <ul style={{ margin: 0, paddingLeft: '24px', listStyle: 'disc' }}>
                                        {proj.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                            <li key={i} style={{ marginBottom: '4px', textAlign: 'justify' }}>
                                                {line.trim().startsWith('•') ? line.substring(1).trim() : line}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="EDUCATION" />
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {edu.school}{edu.location ? `, ${edu.location}` : ''}
                                    </span>
                                    <span>{edu.year}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{edu.degree}</span>
                                    <span>{edu.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="CERTIFICATIONS" />
                        <ul style={{ margin: 0, paddingLeft: '24px', listStyle: 'disc' }}>
                            {resumeData.certifications.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: '2px' }}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Skills & Tools Knowledge */}
                {(resumeData.technicalSkills.length > 0 || resumeData.softSkills.length > 0) && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="SKILLS & TOOLS KNOWLEDGE" />
                        <ul style={{ margin: 0, paddingLeft: '24px', listStyle: 'disc' }}>
                            {resumeData.technicalSkills.length > 0 && (
                                <li style={{ marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'bold' }}>Technical</span> – {resumeData.technicalSkills.map(s => s.name).join(', ')}
                                </li>
                            )}
                            {resumeData.softSkills.length > 0 && (
                                <li style={{ marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'bold' }}>Professional</span> – {resumeData.softSkills.map(s => s.name).join(', ')}
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Achievements and Awards */}
                {resumeData.achievements.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeaderPreview title="ACHIEVEMENTS AND AWARDS" />
                        <ul style={{ margin: 0, paddingLeft: '24px', listStyle: 'disc' }}>
                            {resumeData.achievements.map((item, idx) => (
                                <li key={idx} style={{ marginBottom: '6px', textAlign: 'justify' }}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Styles & Helpers ---
const SectionHeaderPreview = ({ title }) => (
    <h3 style={{
        fontSize: '12pt',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottom: '1px solid black',
        paddingBottom: '2px',
        marginBottom: '10px',
        color: '#000'
    }}>
        {title}
    </h3>
);

const SectionTitle = ({ children }) => (
    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{children}</h3>
);

function Input({ label, name, value, onChange, placeholder, style }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>{label}</label>
            <input type="text" name={name} value={value || ''} onChange={onChange} placeholder={placeholder} style={inputStyle} />
        </div>
    );
}

function SectionHeader({ title, onAdd }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{title}</h3>
            <button onClick={onAdd} style={{ color: '#2563eb', background: '#eff6ff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>+ Add</button>
        </div>
    );
}

function RemoveBtn({ onClick }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-24px', position: 'relative', zIndex: 10 }}>
            <button onClick={onClick} style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '14px', color: '#ef4444' }}>🗑️</button>
        </div>
    );
}

function PrintStyles() {
    return (
        <style jsx global>{`
            @media print {
                @page { 
                    margin: 0.5in;
                    size: A4;
                }
                
                * {
                    box-sizing: border-box;
                    overflow: visible !important;
                }
                
                html, body { 
                    background: white !important; 
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                }
                
                nav, header, footer, .editor-sidebar, .no-print { 
                    display: none !important; 
                }
                
                .preview-panel-wrapper {
                    background: white !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    overflow: visible !important;
                    height: auto !important;
                    max-height: none !important;
                    min-height: 0 !important;
                    display: block !important;
                    position: static !important;
                }
                
                .resume-preview { 
                    width: 100% !important; 
                    box-shadow: none !important; 
                    margin: 0 auto !important; 
                    border: none !important; 
                    padding: 0 !important;
                    background: white !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    height: auto !important;
                    overflow: visible !important;
                    display: block !important;
                    position: static !important;
                }
                
                .resume-page {
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0.5in !important;
                    margin: 0 !important;
                    background: white !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    height: auto !important;
                    width: 100% !important;
                    overflow: visible !important;
                    page-break-after: auto !important;
                    page-break-inside: auto !important;
                    display: block !important;
                    position: static !important;
                }
                
                .resume-builder-container { 
                    padding: 0 !important; 
                    background: white !important; 
                    display: block !important;
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                    position: static !important;
                }
                
                main { 
                    width: 100% !important; 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    max-width: none !important;
                    background: white !important;
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                    display: block !important;
                    position: static !important;
                }
                
                /* Prevent orphaned section headers */
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid !important;
                }
                
                /* Keep list items together when possible */
                li {
                    page-break-inside: avoid !important;
                }
                
                /* Allow content to flow naturally */
                div, p, ul, ol, section {
                    page-break-inside: auto !important;
                    overflow: visible !important;
                }
                
                /* Force all containers to auto height */
                div[style*="height"],
                div[style*="maxHeight"],
                div[style*="max-height"],
                div[style*="minHeight"],
                div[style*="min-height"] {
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                }
            }
        `}</style>
    );
}

const cardSelectionStyle = {
    background: 'white', borderRadius: '24px', padding: '40px 32px', cursor: 'pointer',
    border: '1px solid #e2e8f0', textAlign: 'center', transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
};
const iconCircleStyle = {
    width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
    margin: '0 auto 24px', color: '#166534'
};
const ctaButtonStyle = {
    padding: '14px 28px', background: '#0f172a', color: 'white',
    border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    width: '100%', transition: 'background 0.2s'
};
const downloadBtnStyle = {
    padding: '10px 20px', background: '#0f172a', color: 'white', border: 'none',
    borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '8px'
};
const inputStyle = {
    padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%',
    transition: 'border-color 0.2s', background: '#fff', color: '#0f172a'
};
const textAreaStyle = {
    width: '100%', padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical',
    transition: 'border-color 0.2s', background: '#fff', color: '#0f172a', lineHeight: '1.6'
};

const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px', display: 'block' };
const cardStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '16px' };
