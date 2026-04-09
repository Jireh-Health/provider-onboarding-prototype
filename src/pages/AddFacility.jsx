import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

// ── data ──────────────────────────────────────────────────────────────────────
const FACILITY_TYPES = [
  'Hospital', 'Clinic', 'Pharmacy', 'Laboratory',
  'Diagnostic Centre', 'Nursing Home', 'Maternity',
]

const COUNTIES = [
  'Nairobi', 'Kiambu', 'Mombasa', 'Kisumu', 'Nakuru',
  'Machakos', 'Nyeri', 'Meru', 'Eldoret', 'Thika',
]

const SERVICES = [
  'Outpatient & Primary Care',
  'Inpatient & Acute Care',
  'Emergency Services',
  'Pharmacy & Dispensing',
  'Laboratory & Diagnostics',
  'Maternal & Neonatal Care',
  'Surgical Services',
  'Immunisation / Vaccination',
  'Chronic Disease Management (NCDs)',
  'Mental Health Services',
  'Physiotherapy & Rehabilitation',
  'Radiology & Imaging',
]

const PAYMENT_TYPES = [
  { value: 'mpesa-paybill', label: 'M-Pesa Paybill', hint: 'e.g. 400200' },
  { value: 'mpesa-till',    label: 'M-Pesa Till',    hint: 'e.g. 123456' },
  { value: 'bank',          label: 'Bank Account',   hint: 'Account number' },
]

const STEPS = ['Facility details', 'Services', 'Location', 'Payment point']

// ── helpers ───────────────────────────────────────────────────────────────────
function loadFacilities() {
  try { return JSON.parse(localStorage.getItem('jireh_facilities') || '[]') } catch { return [] }
}
function saveFacility(facility) {
  const existing = loadFacilities()
  const updated = [...existing, facility]
  localStorage.setItem('jireh_facilities', JSON.stringify(updated))
  localStorage.setItem('jireh_active_facility', facility.id)
}

// ── icon ──────────────────────────────────────────────────────────────────────
function Icon({ d, size = 16, className = '', sw = 1.75 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  )
}

// ── step indicator ────────────────────────────────────────────────────────────
function StepBar({ current, total }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'idle'
        return (
          <div key={i} className="flex items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              state === 'done'   ? 'bg-jireh-purple text-white' :
              state === 'active' ? 'bg-jireh-purple text-white ring-4 ring-purple-100' :
                                   'bg-gray-100 text-gray-400'
            }`}>
              {state === 'done' ? (
                <Icon d="M4.5 12.75l6 6 9-13.5" size={12} className="text-white" sw={2.5} />
              ) : i + 1}
            </div>
            <div className="ml-2 mr-4">
              <p className={`text-xs font-medium whitespace-nowrap ${state === 'active' ? 'text-gray-900' : 'text-gray-400'}`}>
                {STEPS[i]}
              </p>
            </div>
            {i < total - 1 && (
              <div className={`w-6 h-px mr-4 ${i < current ? 'bg-jireh-purple' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── field label ───────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

// ── native select ─────────────────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="input-field bg-white"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ── step 1: facility details ──────────────────────────────────────────────────
function Step1({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label required>Facility name</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} />
          </span>
          <input
            className="input-field pl-8"
            placeholder="e.g. Nairobi General - Annex"
            value={data.name}
            onChange={e => onChange({ ...data, name: e.target.value })}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">This should match the facility's operating licence</p>
      </div>

      <div>
        <Label required>Facility type</Label>
        <Select
          value={data.type}
          onChange={v => onChange({ ...data, type: v })}
          options={FACILITY_TYPES}
          placeholder="Select facility type"
        />
      </div>

      <div>
        <Label required>County</Label>
        <Select
          value={data.county}
          onChange={v => onChange({ ...data, county: v })}
          options={COUNTIES}
          placeholder="Select county"
        />
      </div>
    </div>
  )
}

// ── step 2: services ──────────────────────────────────────────────────────────
function Step2({ data, onChange }) {
  function toggle(svc) {
    const current = data.services || []
    const next = current.includes(svc)
      ? current.filter(s => s !== svc)
      : [...current, svc]
    onChange({ ...data, services: next })
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        Select all services this facility offers. These will be visible to patients searching on Jireh.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {SERVICES.map(svc => {
          const checked = (data.services || []).includes(svc)
          return (
            <button
              key={svc}
              type="button"
              onClick={() => toggle(svc)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                checked
                  ? 'border-jireh-purple bg-jireh-purple-pale'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 ${
                checked ? 'bg-jireh-purple border-jireh-purple' : 'border-gray-300'
              }`}>
                {checked && (
                  <Icon d="M4.5 12.75l6 6 9-13.5" size={10} className="text-white" sw={3} />
                )}
              </div>
              <span className={`text-sm ${checked ? 'font-medium text-jireh-purple' : 'text-gray-700'}`}>
                {svc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── step 3: location ──────────────────────────────────────────────────────────
function Step3({ data, onChange }) {
  const [pinned, setPinned] = useState(!!data.pinned)

  function handlePin() {
    setPinned(true)
    onChange({
      ...data,
      pinned: true,
      lat: (-1.286389 + (Math.random() - 0.5) * 0.05).toFixed(6),
      lng: (36.817223 + (Math.random() - 0.5) * 0.05).toFixed(6),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label required>Street address</Label>
        <input
          className="input-field"
          placeholder="e.g. Ngong Road, off Kilimani"
          value={data.address || ''}
          onChange={e => onChange({ ...data, address: e.target.value })}
        />
      </div>

      <div>
        <Label>Precise location</Label>
        <p className="text-xs text-gray-400 mb-2">
          Pin your facility's exact entrance on the map so patients can find you easily.
        </p>

        {/* Mock map */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
          {/* Tile grid pattern */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Road lines */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-full h-px bg-gray-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="h-full w-px bg-gray-500" />
          </div>

          {pinned ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-jireh-purple flex items-center justify-center shadow-lg">
                  <Icon d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" size={16} className="text-white" sw={1.5} />
                </div>
                <div className="mt-1 bg-white rounded-lg px-2 py-0.5 shadow text-xs font-medium text-gray-700">
                  Location pinned
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-xs">Map preview</p>
            </div>
          )}

          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-1.5 py-0.5 rounded">
            © OpenStreetMap
          </div>
        </div>

        <button
          type="button"
          onClick={handlePin}
          className={`mt-2 w-full py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
            pinned
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-jireh-purple hover:text-jireh-purple'
          }`}
        >
          {pinned ? (
            <>
              <Icon d="M4.5 12.75l6 6 9-13.5" size={14} className="text-green-600" sw={2.5} />
              Location pinned
            </>
          ) : (
            <>
              <Icon d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" size={14} />
              Pin on map
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── step 4: payment point ─────────────────────────────────────────────────────
function Step4({ data, onChange }) {
  const pt = data.paymentPoint || { department: '', type: 'mpesa-paybill', value: '' }
  function update(patch) { onChange({ ...data, paymentPoint: { ...pt, ...patch } }) }

  const hint = PAYMENT_TYPES.find(t => t.value === pt.type)?.hint || ''

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
        A <strong>Payment Point</strong> is a specific collection point (e.g. Pharmacy, Lab) where
        patients pay using Jireh. Each point gets a unique Jireh Payment Number for reconciliation.
      </div>

      <div>
        <Label required>Department / collection point</Label>
        <input
          className="input-field"
          placeholder="e.g. Pharmacy, Lab, Main Reception"
          value={pt.department}
          onChange={e => update({ department: e.target.value })}
        />
      </div>

      <div>
        <Label required>Payment method</Label>
        <div className="space-y-2">
          {PAYMENT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => update({ type: value, value: '' })}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                pt.type === value
                  ? 'border-jireh-purple bg-jireh-purple-pale'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                pt.type === value ? 'border-jireh-purple' : 'border-gray-300'
              }`}>
                {pt.type === value && <div className="w-2 h-2 rounded-full bg-jireh-purple" />}
              </div>
              <span className={`text-sm ${pt.type === value ? 'font-medium text-jireh-purple' : 'text-gray-700'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label required>
          {PAYMENT_TYPES.find(t => t.value === pt.type)?.label} number
        </Label>
        <input
          className="input-field"
          placeholder={hint}
          value={pt.value}
          onChange={e => update({ value: e.target.value })}
        />
      </div>
    </div>
  )
}

// ── done ──────────────────────────────────────────────────────────────────────
function DoneScreen({ facilityName, onViewAll }) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mb-5">
        <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={32} className="text-green-600" sw={1.5} />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Facility added!</h2>
      <p className="mt-2 text-sm text-gray-500 max-w-xs">
        <strong>{facilityName}</strong> has been registered under your organisation.
        You can now configure payment points, staff access, and compliance documents.
      </p>
      <button
        onClick={onViewAll}
        className="mt-6 w-full max-w-xs py-3 rounded-xl bg-jireh-purple text-white text-sm font-semibold hover:bg-jireh-purple-light transition-colors"
      >
        View all facilities
      </button>
    </div>
  )
}

// ── main export ───────────────────────────────────────────────────────────────
export default function AddFacility() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0-3 = wizard steps, 4 = done
  const [data, setData] = useState({
    name: '', type: '', county: '',
    services: [],
    address: '', pinned: false, lat: null, lng: null,
    paymentPoint: { department: '', type: 'mpesa-paybill', value: '' },
  })
  const [isSaving, setIsSaving] = useState(false)

  const canAdvance = [
    data.name.trim() && data.type && data.county,                        // step 1
    (data.services || []).length > 0,                                    // step 2
    data.address?.trim() && data.pinned,                                 // step 3
    data.paymentPoint?.department?.trim() && data.paymentPoint?.value?.trim(), // step 4
  ]

  function handleNext() {
    if (step < 3) { setStep(s => s + 1); return }
    // Step 4 → save & done
    setIsSaving(true)
    const facility = {
      id: `facility_${Date.now()}`,
      name: data.name.trim(),
      type: data.type,
      county: data.county,
      status: 'active',
      services: data.services,
      location: { address: data.address, lat: data.lat, lng: data.lng },
      paymentPoint: data.paymentPoint,
    }
    saveFacility(facility)
    setTimeout(() => {
      setIsSaving(false)
      setStep(4)
    }, 1000)
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-8 pb-20 px-4">
        <JirehLogo className="mb-6" />
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8">
          <DoneScreen facilityName={data.name} onViewAll={() => navigate('/portal')} />
        </div>
        <button onClick={() => navigate('/')} className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to journeys
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-8 pb-20 px-4">
      <JirehLogo className="mb-6" />

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <button onClick={() => navigate('/portal')} className="hover:text-gray-600 transition-colors">
              My Organisation
            </button>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 font-medium">Add a facility</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Add a facility</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Register a new location under your organisation.
          </p>
        </div>

        {/* Step bar */}
        <StepBar current={step} total={4} />

        {/* Step content */}
        <div className="mb-6">
          {step === 0 && <Step1 data={data} onChange={setData} />}
          {step === 1 && <Step2 data={data} onChange={setData} />}
          {step === 2 && <Step3 data={data} onChange={setData} />}
          {step === 3 && <Step4 data={data} onChange={setData} />}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance[step] || isSaving}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              canAdvance[step] && !isSaving
                ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : step === 3 ? 'Add facility' : 'Continue'}
          </button>
        </div>
      </div>

      <button onClick={() => navigate('/')} className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to journeys
      </button>
    </div>
  )
}
