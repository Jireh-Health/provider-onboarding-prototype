import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const FACILITY_TYPES = ['Hospital/Dispensary/Clinic', 'Pharmacy/Chemist', 'Laboratory']

const LICENCE_MAP = {
  'Hospital/Dispensary/Clinic': [
    { key: 'kmpdc', name: 'KMPDC License', desc: 'Accepts PDF, JPG, PNG' },
    { key: 'ppb',   name: 'Pharmacy & Poisons Board (PPB) License', desc: 'Accepts PDF, JPG, PNG' },
    { key: 'lab',   name: 'Lab', desc: 'Accepts PDF, JPG, PNG' },
  ],
  'Pharmacy/Chemist': [
    { key: 'ppb', name: 'Pharmacy & Poisons Board (PPB) License', desc: 'Accepts PDF, JPG, PNG' },
  ],
  'Laboratory': [
    { key: 'lab', name: 'Lab', desc: 'Accepts PDF, JPG, PNG' },
  ],
}

const HOSPITAL_SERVICES = {
  'Outpatient & Primary Care': {
    services: [
      { name: 'General Outpatient Consultation' },
      { name: 'Triage & Vital Signs Assessment' },
      { name: 'Minor Wound Care & Dressings' },
      { name: 'Chronic Disease Management (DM, HTN, Asthma)' },
      { name: 'Immunisation / Vaccination Services', permit: 'WHO EPI Standards compliance' },
      { name: 'Travel Medicine & Yellow Fever Vaccination' },
      { name: 'Occupational Health Services', permit: 'Approved Occupational Health Physician' },
      { name: 'Telemedicine / Telehealth Consultation', permit: 'Data Protection Registration (ODPC)' },
    ],
    categoryPermit: 'County business permit',
  },
  'Inpatient Services': {
    services: [
      { name: 'General Inpatient Admission & Ward Care' },
      { name: 'High Dependency Unit (HDU)' },
      { name: 'Intensive Care Unit (ICU)', permit: 'Equipment calibration certs' },
      { name: 'Paediatric Ward' },
      { name: 'Newborn Unit / Neonatal Care (NBU/NICU)', permit: 'Neonatal nursing training certification' },
    ],
  },
}

const PHARMACY_SERVICES = {
  'Pharmaceutical Services': {
    services: [
      { name: 'Dispensing' },
      { name: 'Drug Counselling' },
      { name: 'Pharmaceutical Care' },
      { name: 'Over-the-Counter Sales' },
    ],
    categoryPermit: 'PPB Practice licence',
  },
}

const LAB_SERVICES = {
  'Laboratory Services': {
    services: [
      { name: 'Clinical Chemistry' },
      { name: 'Haematology' },
      { name: 'Microbiology' },
      { name: 'Parasitology' },
      { name: 'Histopathology' },
    ],
    categoryPermit: 'KMLTTB licence',
  },
}

const SPECIALISED_SERVICES = [
  'Physiotherapy & Rehabilitation', 'Dental Services', 'Optometry / Eye Care',
  'Dermatology', 'Cardiology', 'Orthopaedics', 'Oncology', 'Radiology & Imaging',
  'Dialysis / Renal Services', 'Mental Health & Counselling', 'Nutrition & Dietetics',
  'ENT (Ear, Nose & Throat)', 'Palliative Care',
]

function getServiceCatalog(type) {
  if (type === 'Pharmacy/Chemist') return PHARMACY_SERVICES
  if (type === 'Laboratory') return LAB_SERVICES
  return HOSPITAL_SERVICES
}

function deduceLevel(name, type) {
  if (type === 'Pharmacy/Chemist') return { key: 'Pharmacy', label: 'Licensed Pharmacy' }
  if (type === 'Laboratory') return { key: 'Laboratory', label: 'Licensed Laboratory' }
  const n = name.toLowerCase()
  if (n.includes('dispensary') || n.includes('annex') || n.includes('kiosk'))
    return { key: 'Level 2', label: 'Level 2' }
  if (n.includes('health centre') || n.includes('health center'))
    return { key: 'Level 3', label: 'Level 3' }
  return { key: 'Level 4', label: 'Level 4' }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback }
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
  grid:     'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  invoice:  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  wallet:   'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
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
  mapPin:   'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  shield:   'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  file:     'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  trash:    'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

function NavItem({ icon, label, active = false, onClick, hasChevron }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
        active ? 'bg-jireh-purple-pale text-jireh-purple font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      }`}>
      <I d={P[icon]} size={15} className={active ? 'text-jireh-purple' : 'text-gray-400'} />
      <span className="flex-1">{label}</span>
      {hasChevron && <I d={P.chevRight} size={12} className="text-gray-400" />}
    </button>
  )
}

function FacilitySwitcher({ facilities, activeId, onSwitch, autoOpen, onAdd }) {
  const [open, setOpen] = useState(autoOpen)
  const ref = useRef(null)
  const active = facilities.find(f => f.id === activeId) || facilities[0]

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!active) return null

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
          open ? 'bg-jireh-purple-pale' : 'hover:bg-gray-50'
        }`}>
        <I d={P.building} size={15} className="text-gray-400 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium text-gray-900 truncate">{active.name}</span>
        <I d={P.chevDown} size={13} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {facilities.map(f => (
            <button key={f.id} onClick={() => { onSwitch(f.id); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-left text-sm ${f.id === activeId ? 'bg-jireh-purple-pale font-medium' : ''}`}>
              <I d={P.building} size={14} className={f.id === activeId ? 'text-jireh-purple' : 'text-gray-400'} />
              <span className="flex-1 truncate">{f.name}</span>
              {f.id === activeId && <I d={P.check} size={13} className="text-jireh-purple" sw={2.5} />}
            </button>
          ))}
          <div className="border-t border-gray-100">
            <button onClick={() => { onAdd(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-jireh-purple-pale text-jireh-purple text-sm font-medium">
              <I d={P.plus} size={13} className="text-jireh-purple" />Add a facility
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Sidebar({ facilities, activeId, onSwitch, onAdd, activeNav, journey }) {
  const navigate = useNavigate()
  const hasSwitcher = facilities.length > 0

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
      <div className="px-5 py-5"><JirehLogo size="sm" /></div>

      {hasSwitcher && (
        <div className="px-3 mb-1">
          {journey === 'switch-facility' && (
            <p className="text-xs text-jireh-purple font-medium mb-2 px-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-jireh-purple text-white text-xs flex items-center justify-center font-bold flex-shrink-0">5</span>
              Click to switch
            </p>
          )}
          <FacilitySwitcher facilities={facilities} activeId={activeId} onSwitch={onSwitch}
            autoOpen={journey === 'switch-facility'} onAdd={onAdd} />
        </div>
      )}

      <nav className="flex-1 px-3 pt-2 space-y-0.5">
        <NavItem icon="grid"     label="Overview"  active={activeNav === 'overview'} onClick={() => {}} />
        <NavItem icon="invoice"  label="Invoices"  onClick={() => {}} />
        <NavItem icon="wallet"   label="Wallet"    onClick={() => {}} />
        <div className="pt-4 pb-1 px-3">
          <span className="text-xs font-medium text-gray-400">Settings</span>
        </div>
        <NavItem icon="building" label="My Organisation" active={activeNav === 'org'} hasChevron onClick={() => {}} />
        <NavItem icon="person"   label="My Profile" onClick={() => {}} />
      </nav>

      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        <p className="text-xs font-medium text-gray-400 px-3 mb-1">About Jireh</p>
        <NavItem icon="external" label="Jireh Website"    onClick={() => {}} />
        <NavItem icon="external" label="Terms of Service" onClick={() => {}} />
        <NavItem icon="external" label="Privacy Policy"   onClick={() => {}} />
        <NavItem icon="logout"   label="Log out"          onClick={() => navigate('/')} />
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-5">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              done   ? 'bg-jireh-purple text-white' :
              active ? 'bg-jireh-purple text-white ring-4 ring-purple-100' :
                       'bg-gray-100 text-gray-400 border border-gray-200'
            }`}>
              {done ? <I d={P.check} size={13} className="text-white" sw={2.5} /> : i + 1}
            </div>
            {i < total - 1 && <div className={`w-5 h-px mx-1 ${i < current ? 'bg-jireh-purple' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIZARD STEP 1: FACILITY DETAILS + LICENCES
// ═══════════════════════════════════════════════════════════════════════════════

function Step1Details({ data, onChange }) {
  const licences = LICENCE_MAP[data.type] || []

  function uploadLicence(key) {
    const fname = `${key}_license.pdf`
    onChange({ ...data, licences: { ...data.licences, [key]: { name: fname, uploaded: true } } })
  }

  function removeLicence(key) {
    const next = { ...data.licences }
    delete next[key]
    onChange({ ...data, licences: next })
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-5">Add facilities details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Facility type</label>
          <select className="input-field bg-white" value={data.type}
            onChange={e => onChange({ ...data, type: e.target.value, licences: {}, services: [] })}>
            <option value=""></option>
            {FACILITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {licences.length > 0 && (
          <div className="space-y-3 pt-1">
            {licences.map(lic => {
              const uploaded = data.licences?.[lic.key]
              return (
                <div key={lic.key} className="border border-gray-200 rounded-lg px-4 py-3">
                  {!uploaded ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lic.name}</p>
                        <p className="text-xs text-gray-400">{lic.desc}</p>
                      </div>
                      <button onClick={() => uploadLicence(lic.key)}
                        className="text-sm font-medium text-jireh-purple hover:underline flex-shrink-0">
                        Add file
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <I d={P.file} size={16} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{uploaded.name}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <I d={P.check} size={10} className="text-green-600" sw={2.5} />Uploaded!
                        </p>
                      </div>
                      <button onClick={() => removeLicence(lic.key)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                        <I d={P.trash} size={15} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIZARD STEP 2: SERVICES
// ═══════════════════════════════════════════════════════════════════════════════

function Step2Services({ data, onChange }) {
  const catalog = getServiceCatalog(data.type)

  function toggle(name) {
    const s = data.services || []
    onChange({ ...data, services: s.includes(name) ? s.filter(x => x !== name) : [...s, name] })
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-5">Add your facility's services</h2>

      {/* Header row */}
      <div className="flex items-center border-b border-gray-200 pb-2 mb-3">
        <span className="flex-1 text-xs font-semibold text-gray-500 uppercase">Service</span>
        <span className="w-48 text-xs font-semibold text-gray-500 uppercase text-right">Additional permit/accreditation</span>
      </div>

      {Object.entries(catalog).map(([category, { services, categoryPermit }]) => (
        <div key={category} className="mb-5">
          {/* Category header with optional permit */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">{category}</p>
            {categoryPermit && (
              <button className="text-xs text-jireh-purple font-medium hover:underline flex items-center gap-1">
                {categoryPermit} <span className="text-jireh-purple">Add file</span>
              </button>
            )}
          </div>

          <div className="space-y-0">
            {services.map(({ name, permit }) => {
              const checked = (data.services || []).includes(name)
              return (
                <div key={name} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                  <button onClick={() => toggle(name)} className="flex items-center gap-2.5 flex-1 text-left">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked ? 'bg-jireh-purple border-jireh-purple' : 'border-gray-300'
                    }`}>
                      {checked && <I d={P.check} size={9} className="text-white" sw={3} />}
                    </div>
                    <span className="text-sm text-gray-700">{name}</span>
                  </button>
                  {permit && (
                    <button className="w-48 text-right text-xs text-jireh-purple font-medium hover:underline flex-shrink-0">
                      {permit} <span className="ml-1">Add file</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Specialised services */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">Specialised Services <span className="text-gray-400 font-normal">(optional)</span></p>
        <div className="space-y-0">
          {SPECIALISED_SERVICES.map(name => {
            const checked = (data.services || []).includes(name)
            return (
              <div key={name} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                <button onClick={() => toggle(name)} className="flex items-center gap-2.5 flex-1 text-left">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    checked ? 'bg-jireh-purple border-jireh-purple' : 'border-gray-300'
                  }`}>
                    {checked && <I d={P.check} size={9} className="text-white" sw={3} />}
                  </div>
                  <span className="text-sm text-gray-700">{name}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIZARD STEP 3: LOCATION
// ═══════════════════════════════════════════════════════════════════════════════

function Step3Location({ data, onChange }) {
  function handlePin() {
    onChange({ ...data, location: { ...data.location, pinned: true, lat: '-1.2864', lng: '36.8172', label: 'Nairobi, Kenya' } })
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Help clients discover your facility</h2>
      <p className="text-sm text-gray-400 mb-5">Set the exact location of your facility on the map.</p>

      {/* Mock map */}
      <div className="relative w-full h-52 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 mb-4 cursor-pointer" onClick={handlePin}>
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          {data.location?.pinned ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-jireh-purple flex items-center justify-center shadow-lg -mb-1">
                <I d={P.mapPin} size={20} className="text-white" sw={1.5} />
              </div>
              <div className="w-3 h-3 bg-jireh-purple/30 rounded-full" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Click to pin location</p>
          )}
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">© OpenStreetMap</div>
      </div>

      {data.location?.pinned && (
        <div className="flex items-center gap-2 text-sm">
          <I d={P.mapPin} size={14} className="text-jireh-purple" />
          <span className="text-gray-700 font-medium">Location label</span>
          <span className="text-gray-400">{data.location.lat} · {data.location.lng}</span>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIZARD STEP 4: DISBURSEMENT
// ═══════════════════════════════════════════════════════════════════════════════

function Step4Disbursement({ data, onChange }) {
  const d = data.disbursement || { method: 'paybill', paybill: '', account: '', till: '' }
  const update = (p) => onChange({ ...data, disbursement: { ...d, ...p } })

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Set up your disbursement account</h2>
      <p className="text-sm text-gray-400 mb-5">We will disburse medical payments to this account</p>

      {/* Toggle */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-5 w-fit">
        {['paybill', 'till'].map(m => (
          <button key={m} onClick={() => update({ method: m })}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              d.method === m ? 'bg-jireh-purple-pale text-jireh-purple' : 'text-gray-500 hover:bg-gray-50'
            }`}>
            {m === 'paybill' ? 'MPESA Paybill' : 'MPESA Till'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {d.method === 'paybill' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter paybill number</label>
              <input className="input-field" value={d.paybill} onChange={e => update({ paybill: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter account number</label>
              <p className="text-xs text-gray-400 mb-1.5">This will be used for all payments made at this facility</p>
              <input className="input-field" value={d.account} onChange={e => update({ account: e.target.value })} />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter till number</label>
            <input className="input-field" value={d.till} onChange={e => update({ till: e.target.value })} />
          </div>
        )}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIZARD STEP 5: CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════

function Step5Confirm({ data }) {
  const level = deduceLevel(data.name || 'Facility', data.type)
  const d = data.disbursement || {}

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Confirm that all the details are correct</h2>

      {/* Facility badge */}
      <div className="bg-jireh-purple-pale rounded-xl px-4 py-3 flex items-center gap-3 mb-5">
        <I d={P.building} size={16} className="text-jireh-purple" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{data.name || 'Facility name as per license'}</p>
          <p className="text-xs text-gray-500">{level.label}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Facility's details:</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-700">Type</span><span className="text-gray-500">{level.label}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-700">Location</span><span className="text-gray-500">{data.location?.label || 'Location label'}</span></div>
        </div>
      </div>

      {/* Services */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Services & licenses:</p>
        <div className="space-y-2">
          {(data.services || []).slice(0, 5).map(s => (
            <div key={s} className="flex justify-between text-sm items-center">
              <span className="text-gray-700">{s}</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">license.pdf</span>
            </div>
          ))}
          {(data.services || []).length > 5 && (
            <p className="text-xs text-gray-400">+{data.services.length - 5} more services</p>
          )}
        </div>
      </div>

      {/* Disbursement */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Disbursement account:</p>
        <div className="space-y-2">
          {d.method === 'paybill' ? (
            <>
              <div className="flex justify-between text-sm"><span className="text-gray-700">MPESA Paybill No.</span><span className="text-gray-500">{d.paybill || '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-700">Account No.</span><span className="text-gray-500">{d.account || '—'}</span></div>
            </>
          ) : (
            <div className="flex justify-between text-sm"><span className="text-gray-700">MPESA Till No.</span><span className="text-gray-500">{d.till || '—'}</span></div>
          )}
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS DIALOG
// ═══════════════════════════════════════════════════════════════════════════════

function SuccessDialog({ facilityName, onDashboard, onView }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 px-8 py-8 text-center">
        <button onClick={onDashboard} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><I d={P.x} size={18} /></button>
        <div className="w-14 h-14 mx-auto rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4">
          <I d={P.check} size={24} className="text-green-600" sw={2} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Facility created!</h2>
        <p className="text-sm text-gray-500 mb-6">{facilityName} has been added to your organisation.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onDashboard}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Back to dashboard
          </button>
          <button onClick={onView}
            className="px-5 py-2.5 rounded-xl bg-jireh-purple text-white text-sm font-semibold hover:bg-jireh-purple-light">
            View facility
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD FACILITY WIZARD (full page)
// ═══════════════════════════════════════════════════════════════════════════════

function AddFacilityWizard({ onCancel, onComplete }) {
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    name: '', type: '', licences: {},
    services: [],
    location: { pinned: false },
    disbursement: { method: 'paybill', paybill: '', account: '', till: '' },
  })

  const requiredLicences = LICENCE_MAP[data.type] || []
  const allLicencesUploaded = requiredLicences.length > 0 && requiredLicences.every(l => data.licences?.[l.key]?.uploaded)

  const canAdvance = [
    data.type && allLicencesUploaded,                                    // step 0: details + licences
    (data.services || []).length > 0,                                    // step 1: services
    data.location?.pinned,                                               // step 2: location
    data.disbursement?.method === 'paybill'                              // step 3: disbursement
      ? data.disbursement.paybill && data.disbursement.account
      : data.disbursement?.till,
    true,                                                                // step 4: confirmation always valid
  ]

  function handleNext() {
    if (step < 4) { setStep(s => s + 1); return }
    // Confirm → save
    setSaving(true)
    const level = deduceLevel(data.name || 'Facility', data.type)
    const facility = {
      id: `facility_${Date.now()}`, name: data.name || `New ${data.type}`,
      type: data.type, level: level.label, status: 'active',
      services: data.services, receivedAmount: '0.00', assignedStaff: 0,
    }
    const existing = load('jireh_facilities', [])
    localStorage.setItem('jireh_facilities', JSON.stringify([...existing, facility]))
    localStorage.setItem('jireh_active_facility', facility.id)
    setTimeout(() => { setSaving(false); setShowSuccess(true) }, 800)
  }

  const btnLabel = step === 4 ? 'Confirm' : step === 1 ? 'Save Services' : step === 2 ? 'Save location' : step === 3 ? 'Save' : 'Save and continue'

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-6 pt-5 pb-5">
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-1">
          <button onClick={onCancel} className="hover:text-gray-600">My Organisation</button>
          <I d={P.chevRight} size={12} />
          <span className="text-gray-600 font-medium">Add a facility</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Add a facility</h1>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 px-6 py-6">
          <StepIndicator current={step} total={5} />

          {step === 0 && <Step1Details data={data} onChange={setData} />}
          {step === 1 && <Step2Services data={data} onChange={setData} />}
          {step === 2 && <Step3Location data={data} onChange={setData} />}
          {step === 3 && <Step4Disbursement data={data} onChange={setData} />}
          {step === 4 && <Step5Confirm data={data} />}

          {/* Buttons — stacked vertically */}
          <div className="mt-6 space-y-2">
            <button onClick={step > 0 ? () => setStep(s => s - 1) : onCancel}
              className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleNext} disabled={!canAdvance[step] || saving}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                canAdvance[step] && !saving
                  ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {saving ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>Saving</>
              ) : btnLabel}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessDialog
          facilityName={data.name || `New ${data.type}`}
          onDashboard={onComplete}
          onView={onComplete}
        />
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MY ORGANISATION PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function MyOrganisationPage({ facilities, journey, onAdd }) {
  const [activeTab, setActiveTab] = useState('Facilities')
  const btnRef = useRef(null)
  const [showBanner, setShowBanner] = useState(journey === 'add-facility')
  const TABS = ['Overview', 'Facilities', 'Identity & Compliance']

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-6 pt-5 pb-5">
        <h1 className="text-xl font-bold text-gray-900 mb-4">My Organisation</h1>
        <div className="flex items-center justify-between">
          {/* Pill tabs */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}>{tab}</button>
            ))}
          </div>
          {activeTab === 'Facilities' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <I d={P.search} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm w-44 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="Search..." />
              </div>
              <button ref={btnRef} onClick={onAdd}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white bg-jireh-purple hover:bg-jireh-purple-light transition-all whitespace-nowrap ${
                  journey === 'add-facility' ? 'ring-4 ring-purple-200 shadow-lg' : ''
                }`}>Add a facility</button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 p-6">
        {showBanner && (
          <div className="max-w-5xl mb-5 bg-purple-50 border border-jireh-purple-border rounded-xl px-4 py-3.5 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-jireh-purple flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">4</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Journey 4 — Adding a new facility</p>
              <p className="text-xs text-gray-500 mt-0.5">Click <strong>"Add a facility"</strong> to walk through the full 5-step flow: details + licences → services → location → disbursement → confirm.</p>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><I d={P.x} size={14} /></button>
          </div>
        )}

        {activeTab === 'Facilities' ? (
          <div className="max-w-5xl bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-8"><input type="checkbox" className="rounded border-gray-300" disabled /></th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Facility Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Account status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Received Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Assigned staff</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map(f => (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" disabled /></td>
                    <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">Active</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{f.receivedAmount || '0.00'}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{f.assignedStaff ?? 0}</td>
                    <td className="px-4 py-3"><button className="text-sm font-medium text-gray-600 hover:text-gray-900">View</button></td>
                  </tr>
                ))}
                {facilities.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No facilities registered yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Outside prototype scope</div>
        )}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function PortalDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const journey = searchParams.get('journey')

  const [facilities, setFacilities] = useState(() => load('jireh_facilities', []))
  const [activeId, setActiveId] = useState(() => {
    const f = load('jireh_facilities', [])
    const id = localStorage.getItem('jireh_active_facility')
    return f.find(x => x.id === id) ? id : (f[0]?.id ?? null)
  })
  const [mode, setMode] = useState('portal') // 'portal' | 'add-facility'
  const [toast, setToast] = useState(null)

  function handleSwitch(id) {
    localStorage.setItem('jireh_active_facility', id)
    setActiveId(id)
    const f = facilities.find(x => x.id === id)
    setToast(`Switched to ${f?.name}`)
    setTimeout(() => setToast(null), 2800)
  }

  function handleComplete() {
    setFacilities(load('jireh_facilities', []))
    const id = localStorage.getItem('jireh_active_facility')
    setActiveId(id)
    setMode('portal')
    setToast('Facility added successfully')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar facilities={facilities} activeId={activeId} onSwitch={handleSwitch}
        onAdd={() => setMode('add-facility')} activeNav={mode === 'portal' ? 'org' : 'overview'} journey={journey} />

      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {mode === 'portal' ? (
          <MyOrganisationPage facilities={facilities} journey={journey} onAdd={() => setMode('add-facility')} />
        ) : (
          <AddFacilityWizard onCancel={() => setMode('portal')} onComplete={handleComplete} />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50 whitespace-nowrap">
          <I d={P.check} size={14} className="text-green-400" sw={2.5} />{toast}
        </div>
      )}
    </div>
  )
}
