import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const FACILITY_TYPES = ['Hospital/Dispensary/Clinic', 'Pharmacy/Chemist', 'Laboratory']

const LICENCE_MAP = {
  'Hospital/Dispensary/Clinic': { name: 'KMPDC Licence', body: 'Kenya Medical Practitioners and Dentists Council' },
  'Pharmacy/Chemist':          { name: 'PPB Licence',   body: 'Pharmacy and Poisons Board' },
  'Laboratory':                { name: 'Lab Licence',   body: 'Kenya Medical Laboratory Technicians and Technologists Board' },
}

const SERVICES_BY_LEVEL = {
  'Level 2': {
    Outpatient: [
      'General Outpatient Consultation', 'Triage', 'Basic Pharmacy',
      'Minor Wound Care', 'Immunisation / Vaccination',
    ],
  },
  'Level 3': {
    Outpatient: [
      'General Outpatient Consultation', 'Triage', 'Basic Pharmacy',
      'Minor Wound Care', 'Immunisation / Vaccination',
      'Chronic Disease Management', 'Maternal & Child Health',
    ],
  },
  'Level 4': {
    Outpatient: [
      'General Outpatient Consultation', 'Immunisation / Vaccination',
      'Travel Medicine', 'Occupational Health', 'Telemedicine',
      'Triage', 'Chronic Disease Management', 'Minor Wound Care',
    ],
    Inpatient: [
      'General Inpatient Admission', 'HDU', 'ICU', 'Paediatric Ward',
      'Maternity', 'Theatres', 'Specialist Consultation',
    ],
  },
  Pharmacy: {
    'Pharmaceutical Services': [
      'Dispensing', 'Drug Counselling', 'Pharmaceutical Care',
      'Over-the-Counter Sales',
    ],
  },
  Laboratory: {
    'Lab Services': [
      'Clinical Chemistry', 'Haematology', 'Microbiology',
      'Parasitology', 'Histopathology',
    ],
  },
}

const SPECIALISED_SERVICES = [
  'Physiotherapy & Rehabilitation',
  'Dental Services',
  'Optometry / Eye Care',
  'Dermatology',
  'Cardiology',
  'Orthopaedics',
  'Oncology',
  'Radiology & Imaging',
  'Dialysis / Renal Services',
  'Mental Health & Counselling',
  'Nutrition & Dietetics',
  'ENT (Ear, Nose & Throat)',
  'Palliative Care',
]

function deduceLevel(name, type) {
  if (type === 'Pharmacy/Chemist') return { key: 'Pharmacy', label: 'Licensed Pharmacy' }
  if (type === 'Laboratory') return { key: 'Laboratory', label: 'Licensed Laboratory' }
  const n = name.toLowerCase()
  if (n.includes('dispensary') || n.includes('annex') || n.includes('kiosk'))
    return { key: 'Level 2', label: 'Level 2 — Dispensary' }
  if (n.includes('health centre') || n.includes('health center'))
    return { key: 'Level 3', label: 'Level 3 — Health Centre' }
  return { key: 'Level 4', label: 'Level 4 — Sub-County Hospital' }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function loadFacilities() {
  try { return JSON.parse(localStorage.getItem('jireh_facilities') || '[]') } catch { return [] }
}
function loadUser() {
  try { return JSON.parse(localStorage.getItem('jireh_user') || '{}') } catch { return {} }
}
function loadActiveId(facilities) {
  const id = localStorage.getItem('jireh_active_facility')
  return facilities.find(f => f.id === id) ? id : (facilities[0]?.id ?? null)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ICON
// ═══════════════════════════════════════════════════════════════════════════════

function I({ d, size = 16, className = '', sw = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

const P = {
  home:     'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  invoice:  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  wallet:   'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  facility: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
  person:   'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  logout:   'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  external: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  chevDown: 'M19 9l-7 7-7-7',
  chevRight:'M9 5l7 7-7 7',
  plus:     'M12 5v14M5 12h14',
  check:    'M4.5 12.75l6 6 9-13.5',
  x:        'M6 18L18 6M6 6l12 12',
  search:   'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  upload:   'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  shield:   'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  eye:      'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
        active ? 'bg-jireh-purple-pale text-jireh-purple font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      }`}>
      <I d={P[icon]} size={15} className={active ? 'text-jireh-purple' : 'text-gray-400'} />
      {label}
    </button>
  )
}

function FacilitySwitcher({ facilities, activeId, onSwitch, autoOpen, onAdd }) {
  const [open, setOpen] = useState(autoOpen)
  const ref = useRef(null)
  const user = loadUser()
  const active = facilities.find(f => f.id === activeId) || facilities[0]

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
          open ? 'bg-jireh-purple-pale ring-2 ring-jireh-purple-border' : 'hover:bg-gray-50'
        }`}>
        <div className="w-8 h-8 rounded-lg bg-jireh-purple flex items-center justify-center flex-shrink-0">
          <I d={P.building} size={13} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate leading-snug">{active?.name || 'No facility'}</p>
          <p className="text-xs text-gray-400 truncate leading-snug">{user.email || ''}</p>
        </div>
        <I d={P.chevDown} size={13} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Facilities ({facilities.length})</p>
          {facilities.map(f => (
            <button key={f.id} onClick={() => { onSwitch(f.id); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left ${f.id === activeId ? 'bg-jireh-purple-pale' : ''}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.id === activeId ? 'bg-jireh-purple' : 'bg-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{f.level || f.type}</p>
              </div>
              {f.id === activeId && <I d={P.check} size={13} className="text-jireh-purple flex-shrink-0" sw={2.5} />}
            </button>
          ))}
          <div className="border-t border-gray-100">
            <button onClick={() => { onAdd(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-jireh-purple-pale text-jireh-purple transition-colors">
              <I d={P.plus} size={13} className="text-jireh-purple" />
              <span className="text-sm font-medium">Add a facility</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD FACILITY MODAL
// ═══════════════════════════════════════════════════════════════════════════════

const MODAL_STEPS = ['Details', 'Licence', 'Services']

function ModalStepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-5">
      {MODAL_STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'idle'
        return (
          <div key={i} className="flex items-center">
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                state === 'done'   ? 'bg-jireh-purple text-white' :
                state === 'active' ? 'bg-jireh-purple text-white ring-4 ring-purple-100' :
                                     'bg-gray-100 text-gray-400'
              }`}>
                {state === 'done' ? <I d={P.check} size={11} className="text-white" sw={2.5} /> : i + 1}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${state === 'active' ? 'text-gray-900' : state === 'done' ? 'text-jireh-purple' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < MODAL_STEPS.length - 1 && (
              <div className={`w-8 h-px mx-2.5 ${i < current ? 'bg-jireh-purple' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function AddFacilityModal({ onClose, onSave }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ name: '', type: '', file: null, verified: false, level: null, services: [] })
  const [verifying, setVerifying] = useState(false)
  const [saving, setSaving] = useState(false)

  const licence = LICENCE_MAP[data.type] || {}

  function handleUpload() {
    const mockName = `${data.name.replace(/\s+/g, '_')}_licence.pdf`
    setData(d => ({ ...d, file: mockName, verified: false, level: null }))
    setVerifying(true)
    setTimeout(() => {
      const level = deduceLevel(data.name, data.type)
      setData(d => ({ ...d, verified: true, level }))
      setVerifying(false)
    }, 1800)
  }

  function getAvailableServices() {
    if (!data.level) return {}
    return SERVICES_BY_LEVEL[data.level.key] || {}
  }

  function toggleService(svc) {
    setData(d => ({
      ...d,
      services: d.services.includes(svc) ? d.services.filter(s => s !== svc) : [...d.services, svc],
    }))
  }

  const canAdvance = [
    data.name.trim() && data.type,
    data.file && data.verified,
    data.services.length > 0,
  ]

  function handleNext() {
    if (step < 2) { setStep(s => s + 1); return }
    setSaving(true)
    const facility = {
      id: `facility_${Date.now()}`,
      name: data.name.trim(),
      type: data.type,
      level: data.level?.label || '',
      status: 'active',
      services: data.services,
      receivedAmount: '0.00',
      assignedStaff: 0,
    }
    const existing = loadFacilities()
    localStorage.setItem('jireh_facilities', JSON.stringify([...existing, facility]))
    localStorage.setItem('jireh_active_facility', facility.id)
    setTimeout(() => { setSaving(false); onSave(facility) }, 800)
  }

  const titles = [
    { title: 'Add facility details', desc: 'Provide the name and type for this facility.' },
    { title: `Upload ${licence.name || 'facility licence'}`, desc: `We'll verify the facility name and determine the facility level from this document.` },
    { title: 'Configure facility services', desc: 'Select the services this facility offers. Available options are based on the facility level.' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <ModalStepBar current={step} />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1">
              <I d={P.x} size={16} />
            </button>
          </div>
          <h2 className="text-lg font-bold text-gray-900">{titles[step].title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{titles[step].desc}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Facility name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <I d={P.search} size={14} />
                  </span>
                  <input className="input-field pl-8" placeholder="e.g. City General - Annex"
                    value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
                </div>
                <p className="text-xs text-gray-400 mt-1">This should match the facility's licence</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Facility type <span className="text-red-400">*</span></label>
                <select className="input-field bg-white" value={data.type}
                  onChange={e => setData(d => ({ ...d, type: e.target.value, file: null, verified: false, level: null, services: [] }))}>
                  <option value="" disabled>Select facility type</option>
                  {FACILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
                Upload the <strong>{licence.name}</strong> issued by <strong>{licence.body}</strong>. We will verify the facility name and determine the operational level using AI.
              </div>

              {!data.file ? (
                <button type="button" onClick={handleUpload}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl px-6 py-8 flex flex-col items-center gap-2 hover:border-jireh-purple hover:bg-jireh-purple-pale/30 transition-all group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-jireh-purple-pale flex items-center justify-center transition-colors">
                    <I d={P.upload} size={18} className="text-gray-400 group-hover:text-jireh-purple" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-jireh-purple">Click to upload licence</p>
                  <p className="text-xs text-gray-400">Accepts PDF, JPG, PNG</p>
                </button>
              ) : (
                <div className="space-y-3">
                  {/* File indicator */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-500">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{data.file}</p>
                      <p className="text-xs text-gray-400">128 KB</p>
                    </div>
                    <button onClick={() => setData(d => ({ ...d, file: null, verified: false, level: null, services: [] }))}
                      className="text-gray-400 hover:text-gray-600">
                      <I d={P.x} size={14} />
                    </button>
                  </div>

                  {/* Verification state */}
                  {verifying && (
                    <div className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-3 border border-purple-100">
                      <svg className="animate-spin w-5 h-5 text-jireh-purple flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-jireh-purple">Verifying licence...</p>
                        <p className="text-xs text-purple-400">Checking facility name and determining level</p>
                      </div>
                    </div>
                  )}

                  {data.verified && data.level && (
                    <div className="bg-green-50 rounded-xl px-4 py-3.5 border border-green-100 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <I d={P.check} size={14} className="text-green-600" sw={2.5} />
                        <span className="text-sm font-medium text-green-800">Facility name verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <I d={P.shield} size={14} className="text-green-600" sw={2} />
                        <span className="text-sm text-green-800">
                          Deduced level: <strong>{data.level.label}</strong>
                        </span>
                      </div>
                      <p className="text-xs text-green-600">This level determines which services are available for configuration.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              {data.level && (
                <div className="mb-4 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100 flex items-center gap-2">
                  <I d={P.shield} size={14} className="text-jireh-purple" sw={2} />
                  <span className="text-xs font-medium text-gray-600">
                    Showing services for <strong className="text-gray-900">{data.level.label}</strong>
                  </span>
                </div>
              )}
              {/* Level-based standard services */}
              {Object.entries(getAvailableServices()).map(([category, services]) => (
                <div key={category} className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{category}</p>
                  <div className="space-y-1.5">
                    {services.map(svc => {
                      const checked = data.services.includes(svc)
                      return (
                        <button key={svc} type="button" onClick={() => toggleService(svc)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                            checked ? 'border-jireh-purple bg-jireh-purple-pale' : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}>
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                            checked ? 'bg-jireh-purple border-jireh-purple' : 'border-gray-300'
                          }`}>
                            {checked && <I d={P.check} size={10} className="text-white" sw={3} />}
                          </div>
                          <span className={`text-sm ${checked ? 'font-medium text-jireh-purple' : 'text-gray-700'}`}>{svc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Specialised services — available to all facility types */}
              <div className="mt-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Specialised Services</p>
                  <span className="text-xs text-gray-400 font-normal normal-case">(optional)</span>
                </div>
                <p className="text-xs text-gray-400 mb-2.5">Additional services that may require separate accreditation or permits. Available to all facility types.</p>
                <div className="space-y-1.5">
                  {SPECIALISED_SERVICES.map(svc => {
                    const checked = data.services.includes(svc)
                    return (
                      <button key={svc} type="button" onClick={() => toggleService(svc)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                          checked ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          checked ? 'bg-amber-500 border-amber-500' : 'border-gray-300'
                        }`}>
                          {checked && <I d={P.check} size={10} className="text-white" sw={3} />}
                        </div>
                        <span className={`text-sm ${checked ? 'font-medium text-amber-700' : 'text-gray-700'}`}>{svc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button onClick={step > 0 ? () => setStep(s => s - 1) : onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            {step > 0 ? 'Back' : 'Cancel'}
          </button>
          <button onClick={handleNext} disabled={!canAdvance[step] || saving}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              canAdvance[step] && !saving
                ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {saving ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : step === 2 ? 'Add facility' : 'Save and continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FACILITIES TAB
// ═══════════════════════════════════════════════════════════════════════════════

function FacilitiesTab({ facilities, journey, onAdd }) {
  const btnRef = useRef(null)
  const [showBanner, setShowBanner] = useState(journey === 'add-facility')

  useEffect(() => {
    if (journey === 'add-facility')
      setTimeout(() => btnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200)
  }, [journey])

  return (
    <div className="max-w-5xl">
      {showBanner && (
        <div className="mb-5 bg-purple-50 border border-jireh-purple-border rounded-xl px-4 py-3.5 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-jireh-purple flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">4</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Journey 4 — Adding a new facility</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Kamau already has one active facility. Click <strong className="text-gray-700">"Add a facility"</strong> to walk through the end-to-end process: enter details, upload a licence for AI verification, then configure services based on the deduced facility level.
            </p>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><I d={P.x} size={14} /></button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Facilities</h2>
          <p className="text-xs text-gray-400 mt-0.5">{facilities.length} {facilities.length === 1 ? 'facility' : 'facilities'} registered</p>
        </div>
        <button ref={btnRef} onClick={onAdd}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-jireh-purple hover:bg-jireh-purple-light transition-all ${
            journey === 'add-facility' ? 'ring-4 ring-purple-200 shadow-lg shadow-purple-100' : ''
          }`}>
          <I d={P.plus} size={13} className="text-white" sw={2.5} />
          Add a facility
        </button>
      </div>

      {facilities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
          <I d={P.building} size={32} className="text-gray-200" sw={1.25} />
          <p className="text-sm">No facilities registered yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Facility name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Account status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Received amount</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Assigned staff</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {facilities.map(f => (
                <tr key={f.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-jireh-purple-pale flex items-center justify-center flex-shrink-0">
                        <I d={P.building} size={12} className="text-jireh-purple" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{f.name}</span>
                        {f.level && <p className="text-xs text-gray-400">{f.level}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 bg-green-50 text-green-700 ring-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600 tabular-nums">KES {f.receivedAmount || '0.00'}</td>
                  <td className="px-4 py-3 text-right text-gray-600 tabular-nums">{f.assignedStaff ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-jireh-purple hover:underline flex items-center gap-1 ml-auto">
                      <I d={P.eye} size={12} className="text-jireh-purple" />View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'compliance', label: 'Identity & Compliance' },
  { key: 'payment-points', label: 'Payment Points' },
  { key: 'staff', label: 'Staff' },
]

export default function PortalDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const journey = searchParams.get('journey')

  const [facilities, setFacilities] = useState(loadFacilities)
  const [activeId, setActiveId] = useState(() => loadActiveId(loadFacilities()))
  const [activeTab, setActiveTab] = useState('facilities')
  const [toast, setToast] = useState(null)
  const [showModal, setShowModal] = useState(false)

  function handleSwitch(id) {
    localStorage.setItem('jireh_active_facility', id)
    setActiveId(id)
    const f = facilities.find(x => x.id === id)
    setToast(`Switched to ${f?.name}`)
    setTimeout(() => setToast(null), 2800)
  }

  function handleFacilitySaved(facility) {
    setFacilities(loadFacilities())
    setActiveId(facility.id)
    setShowModal(false)
    setToast(`${facility.name} added successfully`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100"><JirehLogo size="sm" /></div>

        <div className="p-3 border-b border-gray-100">
          {journey === 'switch-facility' && (
            <p className="text-xs text-jireh-purple font-medium mb-2 px-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-jireh-purple text-white text-xs flex items-center justify-center font-bold flex-shrink-0">5</span>
              Click to switch facility
            </p>
          )}
          <FacilitySwitcher facilities={facilities} activeId={activeId} onSwitch={handleSwitch}
            autoOpen={journey === 'switch-facility'} onAdd={() => setShowModal(true)} />
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <NavItem icon="home"     label="Overview"  onClick={() => {}} />
          <NavItem icon="invoice"  label="Invoices"  onClick={() => {}} />
          <NavItem icon="wallet"   label="Wallet"    onClick={() => {}} />
          <div className="pt-3 pb-1 px-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</span>
          </div>
          <NavItem icon="building" label="My Organisation" active onClick={() => {}} />
          <NavItem icon="facility" label="My Facility"     onClick={() => {}} />
          <NavItem icon="person"   label="My Profile"      onClick={() => {}} />
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">About Jireh</p>
          <NavItem icon="external" label="Jireh Website"    onClick={() => {}} />
          <NavItem icon="external" label="Terms of Service" onClick={() => {}} />
          <NavItem icon="external" label="Privacy Policy"   onClick={() => {}} />
          <NavItem icon="logout"   label="Log out"          onClick={() => navigate('/')} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="bg-white border-b border-gray-100 px-6 pt-5 pb-0">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>My Organisation</span>
            <I d={P.chevRight} size={11} />
            <span className="text-gray-600 font-medium">
              {TABS.find(t => t.key === activeTab)?.label || 'Facilities'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">My Organisation</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your registered facilities and organisation settings</p>
          <div className="flex gap-6 mt-4">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'border-jireh-purple text-jireh-purple'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                }`}>{label}</button>
            ))}
          </div>
        </header>

        <div className="flex-1 p-6">
          {activeTab === 'facilities' ? (
            <FacilitiesTab facilities={facilities} journey={journey} onAdd={() => setShowModal(true)} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Outside prototype scope
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && <AddFacilityModal onClose={() => setShowModal(false)} onSave={handleFacilitySaved} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50 whitespace-nowrap">
          <I d={P.check} size={14} className="text-green-400" sw={2.5} />{toast}
        </div>
      )}
    </div>
  )
}
