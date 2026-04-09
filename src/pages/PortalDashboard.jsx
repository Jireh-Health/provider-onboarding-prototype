import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

// ── helpers ──────────────────────────────────────────────────────────────────
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

// ── generic svg icon ─────────────────────────────────────────────────────────
function Icon({ d, size = 16, className = '', sw = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

const P = {
  home:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  invoice: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  wallet:  'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  building:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  hospital:'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
  person:  'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  logout:  'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  external:'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  chevDown:'M19 9l-7 7-7-7',
  chevRight:'M9 5l7 7-7 7',
  plus:    'M12 5v14M5 12h14',
  check:   'M4.5 12.75l6 6 9-13.5',
  x:       'M6 18L18 6M6 6l12 12',
}

// ── facility switcher ─────────────────────────────────────────────────────────
function FacilitySwitcher({ facilities, activeId, onSwitch, autoOpen, onAddFacility }) {
  const [open, setOpen] = useState(autoOpen)
  const ref = useRef(null)
  const user = loadUser()
  const active = facilities.find(f => f.id === activeId) || facilities[0]

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
          open ? 'bg-jireh-purple-pale ring-2 ring-jireh-purple-border' : 'hover:bg-gray-50'
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-jireh-purple flex items-center justify-center flex-shrink-0">
          <Icon d={P.building} size={13} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate leading-snug">
            {active?.name || 'No facility selected'}
          </p>
          <p className="text-xs text-gray-400 truncate leading-snug">
            {user.email || 'admin@hospital.co.ke'}
          </p>
        </div>
        <Icon d={P.chevDown} size={13}
          className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Facilities ({facilities.length})
          </p>
          {facilities.map(f => (
            <button key={f.id}
              onClick={() => { onSwitch(f.id); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                f.id === activeId ? 'bg-jireh-purple-pale' : ''
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${
                f.id === activeId ? 'bg-jireh-purple' : 'bg-gray-300'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{f.type} · {f.county}</p>
              </div>
              {f.id === activeId && (
                <Icon d={P.check} size={13} className="text-jireh-purple flex-shrink-0" sw={2.5} />
              )}
            </button>
          ))}
          <div className="border-t border-gray-100">
            <button
              onClick={() => { onAddFacility(); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-jireh-purple-pale text-jireh-purple transition-colors"
            >
              <Icon d={P.plus} size={13} className="text-jireh-purple" />
              <span className="text-sm font-medium">Add a facility</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── sidebar nav item ──────────────────────────────────────────────────────────
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
        active
          ? 'bg-jireh-purple-pale text-jireh-purple font-medium'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <Icon d={P[icon]} size={15} className={active ? 'text-jireh-purple' : 'text-gray-400'} />
      {label}
    </button>
  )
}

// ── facilities table ──────────────────────────────────────────────────────────
function FacilitiesContent({ facilities, journey, onAddFacility }) {
  const btnRef = useRef(null)
  const [showBanner, setShowBanner] = useState(journey === 'add-facility')

  useEffect(() => {
    if (journey === 'add-facility')
      setTimeout(() => btnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200)
  }, [journey])

  return (
    <div className="max-w-4xl">
      {/* Journey 4 annotation */}
      {showBanner && (
        <div className="mb-5 bg-purple-50 border border-jireh-purple-border rounded-xl px-4 py-3.5 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-jireh-purple flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">4</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Journey 4 — Adding a new facility</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Kamau already has one active facility. Click{' '}
              <strong className="text-gray-700">"Add a facility"</strong> to walk through the
              end-to-end process of registering a second location.
            </p>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <Icon d={P.x} size={14} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Facilities</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {facilities.length} {facilities.length === 1 ? 'facility' : 'facilities'} registered
          </p>
        </div>
        <button
          ref={btnRef}
          onClick={onAddFacility}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-jireh-purple hover:bg-jireh-purple-light transition-all ${
            journey === 'add-facility' ? 'ring-4 ring-purple-200 shadow-lg shadow-purple-100' : ''
          }`}
        >
          <Icon d={P.plus} size={13} className="text-white" sw={2.5} />
          Add a facility
        </button>
      </div>

      {/* Table */}
      {facilities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
          <Icon d={P.building} size={32} className="text-gray-200" sw={1.25} />
          <p className="text-sm">No facilities registered yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Facility name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">County</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Services</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {facilities.map(f => (
                <tr key={f.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-jireh-purple-pale flex items-center justify-center flex-shrink-0">
                        <Icon d={P.building} size={12} className="text-jireh-purple" />
                      </div>
                      <span className="font-medium text-gray-900">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{f.type}</td>
                  <td className="px-4 py-3 text-gray-500">{f.county}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 bg-green-50 text-green-700 ring-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {f.services?.length || 0} services
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

// ── main export ───────────────────────────────────────────────────────────────
export default function PortalDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const journey = searchParams.get('journey') // 'add-facility' | 'switch-facility'

  const [facilities, setFacilities] = useState(loadFacilities)
  const [activeId, setActiveId] = useState(() => loadActiveId(loadFacilities()))
  const [activeTab, setActiveTab] = useState('facilities')
  const [toast, setToast] = useState(null)

  function handleSwitch(id) {
    localStorage.setItem('jireh_active_facility', id)
    setActiveId(id)
    const f = facilities.find(x => x.id === id)
    setToast(`Switched to ${f?.name}`)
    setTimeout(() => setToast(null), 2800)
  }

  function handleAddFacility() {
    navigate('/add-facility')
  }

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'compliance', label: 'Identity & Compliance' },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100">
          <JirehLogo size="sm" />
        </div>

        {/* Facility switcher */}
        <div className="p-3 border-b border-gray-100">
          {journey === 'switch-facility' && (
            <p className="text-xs text-jireh-purple font-medium mb-2 px-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-jireh-purple text-white text-xs flex items-center justify-center font-bold flex-shrink-0">5</span>
              Click the dropdown to switch facility
            </p>
          )}
          <FacilitySwitcher
            facilities={facilities}
            activeId={activeId}
            onSwitch={handleSwitch}
            autoOpen={journey === 'switch-facility'}
            onAddFacility={handleAddFacility}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          <NavItem icon="home"     label="Overview"        onClick={() => {}} />
          <NavItem icon="invoice"  label="Invoices"        onClick={() => {}} />
          <NavItem icon="wallet"   label="Wallet"          onClick={() => {}} />

          <div className="pt-3 pb-1 px-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</span>
          </div>
          <NavItem icon="building" label="My Organisation" active={true}  onClick={() => {}} />
          <NavItem icon="hospital" label="My Facility"                    onClick={() => {}} />
          <NavItem icon="person"   label="My Profile"                     onClick={() => {}} />
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">About Jireh</p>
          <NavItem icon="external" label="Jireh Website"   onClick={() => {}} />
          <NavItem icon="external" label="Terms of Service" onClick={() => {}} />
          <NavItem icon="logout"   label="Log out"         onClick={() => navigate('/')} />
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 pt-5 pb-0">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>My Organisation</span>
            <Icon d={P.chevRight} size={11} />
            <span className="text-gray-600 font-medium">Facilities</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Organisation</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage your registered facilities and organisation settings</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-6 mt-4">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-jireh-purple text-jireh-purple'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'facilities' ? (
            <FacilitiesContent
              facilities={facilities}
              journey={journey}
              onAddFacility={handleAddFacility}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              Outside prototype scope
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50 whitespace-nowrap">
          <Icon d={P.check} size={14} className="text-green-400" sw={2.5} />
          {toast}
        </div>
      )}
    </div>
  )
}
