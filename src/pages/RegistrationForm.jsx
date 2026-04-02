import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

const ROLES = [
  {
    value: 'owner',
    label: 'Owner, Director, Signatory',
    description: 'signing contracts, adding & updating payment information, add facility admins',
    authorized: true,
  },
  {
    value: 'admin',
    label: 'Administrator, Facility manager',
    description: 'add/remove staff',
    authorized: false,
  },
  {
    value: 'finance',
    label: 'Finance, Accounting, Bookkeeping',
    description: 'handles bookkeeping and reconciliation',
    authorized: false,
  },
  {
    value: 'frontdesk',
    label: 'Front desk, Customer support',
    description: 'handles client payments (cash, insurance, SHA)',
    authorized: false,
  },
]

const PREFILLS = {
  unauthorized: {
    firstName: 'Jane',
    lastName: 'Wanjiku',
    email: 'jane.wanjiku@hospital.co.ke',
    phone: '+254712345678',
    facilityName: 'Jumuia Hospital Huruma',
    role: 'finance',
  },
  referred: {
    firstName: 'Kamau',
    lastName: 'Ole Tipis',
    email: 'kamau.oletipis@hospital.co.ke',
    phone: '+254712345678',
    facilityName: 'Nairobi General Hospital',
    role: '',
  },
  'email-invite': {
    firstName: 'Kamau',
    lastName: 'Ole Tipis',
    email: 'kamau.oletipis@hospital.co.ke',
    phone: '+254712345678',
    facilityName: 'Nairobi General Hospital',
    role: '',
  },
}

function PersonIcon() {
  return (
    <div className="relative w-14 h-14 mx-auto">
      <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-jireh-purple flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = ROLES.find((r) => r.value === value)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.label : 'Select your role'}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => { onChange(role.value); setOpen(false) }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <p className="text-sm font-medium text-gray-900">{role.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RegistrationForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const journey = searchParams.get('journey') || 'unauthorized'

  const prefill = PREFILLS[journey] || PREFILLS.unauthorized

  const [form, setForm] = useState({
    firstName: prefill.firstName,
    lastName: prefill.lastName,
    email: prefill.email,
    phone: prefill.phone,
    facilityName: prefill.facilityName,
    role: prefill.role,
    authorized: '',
  })

  const [referral, setReferral] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [referralErrors, setReferralErrors] = useState({})
  const [isSendingInvite, setIsSendingInvite] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isFormComplete =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.facilityName.trim() &&
    form.role

  const isReferralComplete =
    referral.firstName.trim() &&
    referral.lastName.trim() &&
    referral.email.trim() &&
    referral.phone.trim()

  function validateReferral() {
    const errors = {}
    const refName = `${referral.firstName.trim()} ${referral.lastName.trim()}`.toLowerCase()
    const ownName = `${form.firstName.trim()} ${form.lastName.trim()}`.toLowerCase()

    if (refName === ownName) errors.name = 'Cannot be your own name'
    if (referral.email.trim().toLowerCase() === form.email.trim().toLowerCase())
      errors.email = 'Cannot be your own email'
    if (referral.phone.trim() === form.phone.trim())
      errors.phone = 'Cannot be your own phone number'

    return errors
  }

  const referralErrors_ = isReferralComplete ? validateReferral() : {}
  const referralIsValid = isReferralComplete && Object.keys(referralErrors_).length === 0

  function handleSendInvite() {
    const errors = validateReferral()
    if (Object.keys(errors).length > 0) {
      setReferralErrors(errors)
      return
    }
    setReferralErrors({})
    setIsSendingInvite(true)
    // Save to localStorage
    localStorage.setItem('jireh_referral', JSON.stringify({
      referredBy: form,
      referral,
      facilityName: form.facilityName,
    }))
    setTimeout(() => {
      navigate('/thank-you')
    }, 1200)
  }

  function handleSaveDetails() {
    setIsSaving(true)
    localStorage.setItem('jireh_registration', JSON.stringify(form))
    setTimeout(() => {
      navigate('/password-setup')
    }, 1200)
  }

  const canSaveDetails = isFormComplete && form.authorized === 'yes'

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-8 pb-20 px-4">
      <JirehLogo className="mb-6" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8">
        <div className="flex flex-col items-center mb-6">
          <PersonIcon />
          <h1 className="mt-3 text-xl font-bold text-gray-900 text-center">
            Enter your official details
          </h1>
          <p className="mt-1 text-sm text-gray-500 text-center">
            These should match your National ID.
          </p>
        </div>

        <div className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">First name</label>
              <input
                className="input-field"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Last name</label>
              <input
                className="input-field"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder=""
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input
                className="input-field pl-7"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder=""
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.006.738-1.914 1.73-2.094l3.434-.603a1.5 1.5 0 011.62.806l1.404 2.808a1.5 1.5 0 01-.33 1.794l-.923.83a11.255 11.255 0 005.634 5.634l.83-.923a1.5 1.5 0 011.794-.33l2.808 1.404a1.5 1.5 0 01.806 1.62l-.603 3.434c-.18.992-1.088 1.73-2.094 1.73C9.716 22.5 1.5 14.284 1.5 6.338z" />
                </svg>
              </span>
              <input
                className="input-field pl-7"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder=""
              />
            </div>
          </div>

          {/* Facility name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Facility name</label>
            <input
              className="input-field"
              value={form.facilityName}
              onChange={(e) => setForm({ ...form, facilityName: e.target.value })}
              placeholder=""
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role in care facility</label>
            <RoleDropdown
              value={form.role}
              onChange={(val) => setForm({ ...form, role: val })}
            />
          </div>

          {/* Authorization question */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Are you authorized to register this provider?
            </label>
            <div className="space-y-2">
              {/* Yes */}
              <button
                type="button"
                onClick={() => setForm({ ...form, authorized: 'yes' })}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  form.authorized === 'yes'
                    ? 'border-jireh-purple bg-jireh-purple-pale'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    form.authorized === 'yes'
                      ? 'border-jireh-purple'
                      : 'border-gray-300'
                  }`}>
                    {form.authorized === 'yes' && (
                      <div className="w-2 h-2 rounded-full bg-jireh-purple" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Yes</p>
                    {form.authorized === 'yes' && (
                      <div className="mt-1.5 text-xs text-gray-600">
                        <p>I will complete the set-up for this facility including:</p>
                        <ul className="mt-1 space-y-0.5 list-disc list-inside">
                          <li>Providing compliance documents</li>
                          <li>Adding facilities</li>
                          <li>Adding team members</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* No */}
              <button
                type="button"
                onClick={() => setForm({ ...form, authorized: 'no' })}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                  form.authorized === 'no'
                    ? 'border-jireh-purple bg-jireh-purple-pale'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    form.authorized === 'no'
                      ? 'border-jireh-purple'
                      : 'border-gray-300'
                  }`}>
                    {form.authorized === 'no' && (
                      <div className="w-2 h-2 rounded-full bg-jireh-purple" />
                    )}
                  </div>
                  <p className="font-medium text-gray-900">No</p>
                </div>
              </button>
            </div>
          </div>

          {/* Referral section — shown when No selected */}
          {form.authorized === 'no' && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Refer authorized personnel</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  They will complete the set-up for this facility including:
                </p>
                <ul className="mt-1 text-xs text-gray-500 list-disc list-inside space-y-0.5">
                  <li>Providing compliance documents</li>
                  <li>Adding facilities</li>
                  <li>Adding team members</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First name</label>
                  <input
                    className={`input-field ${referralErrors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                    value={referral.firstName}
                    onChange={(e) => {
                      setReferral({ ...referral, firstName: e.target.value })
                      setReferralErrors({})
                    }}
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    className={`input-field ${referralErrors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                    value={referral.lastName}
                    onChange={(e) => {
                      setReferral({ ...referral, lastName: e.target.value })
                      setReferralErrors({})
                    }}
                    placeholder=""
                  />
                </div>
              </div>
              {referralErrors.name && (
                <p className="text-xs text-red-500 -mt-1">{referralErrors.name}</p>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                  <input
                    className={`input-field pl-7 ${referralErrors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                    type="email"
                    value={referral.email}
                    onChange={(e) => {
                      setReferral({ ...referral, email: e.target.value })
                      setReferralErrors({})
                    }}
                    placeholder=""
                  />
                </div>
                {referralErrors.email && (
                  <p className="text-xs text-red-500 mt-0.5">{referralErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.006.738-1.914 1.73-2.094l3.434-.603a1.5 1.5 0 011.62.806l1.404 2.808a1.5 1.5 0 01-.33 1.794l-.923.83a11.255 11.255 0 005.634 5.634l.83-.923a1.5 1.5 0 011.794-.33l2.808 1.404a1.5 1.5 0 01.806 1.62l-.603 3.434c-.18.992-1.088 1.73-2.094 1.73C9.716 22.5 1.5 14.284 1.5 6.338z" />
                    </svg>
                  </span>
                  <input
                    className={`input-field pl-7 ${referralErrors.phone ? 'border-red-400 focus:ring-red-300' : ''}`}
                    type="tel"
                    value={referral.phone}
                    onChange={(e) => {
                      setReferral({ ...referral, phone: e.target.value })
                      setReferralErrors({})
                    }}
                    placeholder=""
                  />
                </div>
                {referralErrors.phone && (
                  <p className="text-xs text-red-500 mt-0.5">{referralErrors.phone}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendInvite}
                disabled={!referralIsValid || isSendingInvite}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  referralIsValid && !isSendingInvite
                    ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSendingInvite ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending invite
                  </>
                ) : (
                  'Send invite'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Save details */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSaveDetails}
            disabled={!canSaveDetails || isSaving}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              canSaveDetails && !isSaving
                ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving details
              </>
            ) : (
              'Save details'
            )}
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Back to journeys
      </button>
    </div>
  )
}
