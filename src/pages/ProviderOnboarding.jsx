import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
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
  check:    'M4.5 12.75l6 6 9-13.5',
  chevRight:'M9 5l7 7-7 7',
  chevDown: 'M19 9l-7 7-7-7',
  x:        'M6 18L18 6M6 6l12 12',
  upload:   'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  person:   'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  shield:   'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  file:     'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  phone:    'M2.25 6.338c0-1.006.738-1.914 1.73-2.094l3.434-.603a1.5 1.5 0 011.62.806l1.404 2.808a1.5 1.5 0 01-.33 1.794l-.923.83a11.255 11.255 0 005.634 5.634l.83-.923a1.5 1.5 0 011.794-.33l2.808 1.404a1.5 1.5 0 01.806 1.62l-.603 3.434c-.18.992-1.088 1.73-2.094 1.73C9.716 22.5 1.5 14.284 1.5 6.338z',
  idCard:   'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z',
  camera:   'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z',
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  pen:      'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

const STEP_LABELS = [
  'Personal Details',
  'Authorization',
  'Identity Verification',
  'CR12 & Matching',
  'Ownership',
  'Agreement',
  'Activated',
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEP_LABELS.map((_, i) => {
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
            {i < STEP_LABELS.length - 1 && <div className={`w-5 h-px mx-1 ${i < current ? 'bg-jireh-purple' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1: PERSONAL DETAILS
// ═══════════════════════════════════════════════════════════════════════════════

function Step1PersonalDetails({ data, onChange }) {
  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Enter your official details</h2>
      <p className="text-sm text-gray-400 text-center mb-5">These should match your National ID.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">First name</label>
            <input className="input-field" value={data.firstName}
              onChange={e => onChange({ ...data, firstName: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Last name</label>
            <input className="input-field" value={data.lastName}
              onChange={e => onChange({ ...data, lastName: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
            <input className="input-field pl-7" type="email" value={data.email}
              onChange={e => onChange({ ...data, email: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <I d={P.phone} size={14} />
            </span>
            <input className="input-field pl-7" type="tel" value={data.phone}
              onChange={e => onChange({ ...data, phone: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Provider / Organisation name</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <I d={P.building} size={14} />
            </span>
            <input className="input-field pl-8" value={data.providerName}
              onChange={e => onChange({ ...data, providerName: e.target.value })}
              placeholder="e.g. City General Hospital" />
          </div>
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2: AUTHORIZATION CHECK
// ═══════════════════════════════════════════════════════════════════════════════

function Step2Authorization({ data, onChange, onSendInvite, isSending, inviteSent }) {
  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Authorization check</h2>
      <p className="text-sm text-gray-400 text-center mb-5">
        We need to confirm you have the legal authority to register <strong className="text-gray-600">{data.providerName || 'this provider'}</strong> on Jireh.
      </p>

      <div className="space-y-2 mb-4">
        <button type="button" onClick={() => onChange({ ...data, authorized: 'yes' })}
          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
            data.authorized === 'yes' ? 'border-jireh-purple bg-jireh-purple-pale' : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className="flex items-start gap-2.5">
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              data.authorized === 'yes' ? 'border-jireh-purple' : 'border-gray-300'
            }`}>
              {data.authorized === 'yes' && <div className="w-2 h-2 rounded-full bg-jireh-purple" />}
            </div>
            <div>
              <p className="font-medium text-gray-900">Yes, I am the legal owner or authorized signatory</p>
              {data.authorized === 'yes' && (
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p>You will be asked to:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                    <li>Verify your identity (National ID + selfie)</li>
                    <li>Upload your CR12 business registration document</li>
                    <li>Sign the Jireh commercial agreement</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </button>

        <button type="button" onClick={() => onChange({ ...data, authorized: 'no' })}
          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
            data.authorized === 'no' ? 'border-jireh-purple bg-jireh-purple-pale' : 'border-gray-200 hover:border-gray-300'
          }`}>
          <div className="flex items-start gap-2.5">
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              data.authorized === 'no' ? 'border-jireh-purple' : 'border-gray-300'
            }`}>
              {data.authorized === 'no' && <div className="w-2 h-2 rounded-full bg-jireh-purple" />}
            </div>
            <p className="font-medium text-gray-900">No, I need to invite the authorized person</p>
          </div>
        </button>
      </div>

      {data.authorized === 'no' && !inviteSent && (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Invite the authorized person</p>
            <p className="text-xs text-gray-500 mt-0.5">
              They must be the legal owner or a director listed on the CR12 document.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">First name</label>
              <input className="input-field" value={data.delegateFirstName || ''}
                onChange={e => onChange({ ...data, delegateFirstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Last name</label>
              <input className="input-field" value={data.delegateLastName || ''}
                onChange={e => onChange({ ...data, delegateLastName: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input className="input-field pl-7" type="email" value={data.delegateEmail || ''}
                onChange={e => onChange({ ...data, delegateEmail: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <I d={P.phone} size={14} />
              </span>
              <input className="input-field pl-7" type="tel" value={data.delegatePhone || ''}
                onChange={e => onChange({ ...data, delegatePhone: e.target.value })} />
            </div>
          </div>

          <button type="button" onClick={onSendInvite}
            disabled={!(data.delegateFirstName?.trim() && data.delegateLastName?.trim() && data.delegateEmail?.trim()) || isSending}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              data.delegateFirstName?.trim() && data.delegateLastName?.trim() && data.delegateEmail?.trim() && !isSending
                ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {isSending ? <><Spinner /> Sending invite</> : 'Send invite'}
          </button>
        </div>
      )}

      {inviteSent && (
        <div className="border border-green-200 rounded-xl p-5 bg-green-50 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
            <I d={P.check} size={20} className="text-green-600" sw={2} />
          </div>
          <p className="text-sm font-semibold text-gray-900">Invite sent to {data.delegateFirstName} {data.delegateLastName}</p>
          <p className="text-xs text-gray-500 mt-1.5">
            We've sent an email to <strong>{data.delegateEmail}</strong> with instructions to complete the provider registration.
            You'll be notified once they've finished.
          </p>
          <div className="mt-4 pt-3 border-t border-green-200 text-left">
            <p className="text-xs font-medium text-gray-600 mb-2">What happens next:</p>
            <ul className="text-xs text-gray-500 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-green-200 text-green-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">1</span>
                {data.delegateFirstName} receives the invite email
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-green-200 text-green-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">2</span>
                They verify their identity and upload the CR12
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-green-200 text-green-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">3</span>
                They sign the commercial agreement
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-green-200 text-green-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">4</span>
                The provider is activated and you both get access
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3: IDENTITY VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

function Step3Identity({ data, onChange }) {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(data.identityVerified || false)
  const [verifyStage, setVerifyStage] = useState(0) // 0=idle, 1=IPRS, 2=MNO, 3=done

  function startVerification() {
    setVerifying(true)
    setVerifyStage(1)
    setTimeout(() => setVerifyStage(2), 1200)
    setTimeout(() => {
      setVerifyStage(3)
      setVerified(true)
      setVerifying(false)
      onChange({ ...data, identityVerified: true })
    }, 2200)
  }

  const idUploaded = data.idUploaded
  const selfieUploaded = data.selfieUploaded
  const bothUploaded = idUploaded && selfieUploaded

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Verify your identity</h2>
      <p className="text-sm text-gray-400 text-center mb-5">
        Upload your National ID and take a selfie for verification.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* National ID */}
        <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          idUploaded ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-jireh-purple hover:bg-jireh-purple-pale'
        }`} onClick={() => !idUploaded && onChange({ ...data, idUploaded: true })}>
          {idUploaded ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <I d={P.idCard} size={20} className="text-green-600" sw={1.5} />
              </div>
              <p className="text-xs font-medium text-green-700">ID uploaded</p>
              <p className="text-xs text-gray-400">national_id_front.jpg</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <I d={P.idCard} size={20} className="text-gray-400" sw={1.5} />
              </div>
              <p className="text-xs font-medium text-gray-700">National ID</p>
              <p className="text-xs text-gray-400">Click to upload front of ID</p>
            </div>
          )}
        </div>

        {/* Selfie */}
        <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          selfieUploaded ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-jireh-purple hover:bg-jireh-purple-pale'
        }`} onClick={() => !selfieUploaded && onChange({ ...data, selfieUploaded: true })}>
          {selfieUploaded ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <I d={P.camera} size={20} className="text-green-600" sw={1.5} />
              </div>
              <p className="text-xs font-medium text-green-700">Selfie captured</p>
              <p className="text-xs text-gray-400">selfie_capture.jpg</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <I d={P.camera} size={20} className="text-gray-400" sw={1.5} />
              </div>
              <p className="text-xs font-medium text-gray-700">Selfie</p>
              <p className="text-xs text-gray-400">Click to capture selfie</p>
            </div>
          )}
        </div>
      </div>

      {bothUploaded && !verified && !verifying && (
        <button onClick={startVerification}
          className="w-full py-3 rounded-xl bg-jireh-purple text-white text-sm font-semibold hover:bg-jireh-purple-light transition-all flex items-center justify-center gap-2">
          <I d={P.shield} size={16} className="text-white" sw={1.5} />
          Verify my identity
        </button>
      )}

      {verifying && (
        <div className="border border-purple-200 rounded-xl p-5 bg-purple-50">
          <p className="text-sm font-semibold text-gray-900 mb-3 text-center">Verifying identity...</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {verifyStage >= 2 ? (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <I d={P.check} size={11} className="text-green-600" sw={2.5} />
                </div>
              ) : (
                <div className="flex-shrink-0"><Spinner /></div>
              )}
              <span className={`text-sm ${verifyStage >= 2 ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                IPRS lookup — National ID verification
              </span>
            </div>
            <div className="flex items-center gap-3">
              {verifyStage >= 3 ? (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <I d={P.check} size={11} className="text-green-600" sw={2.5} />
                </div>
              ) : verifyStage >= 2 ? (
                <div className="flex-shrink-0"><Spinner /></div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>
              )}
              <span className={`text-sm ${verifyStage >= 3 ? 'text-green-700 font-medium' : verifyStage >= 2 ? 'text-gray-600' : 'text-gray-400'}`}>
                MNO phone ownership check
              </span>
            </div>
          </div>
        </div>
      )}

      {verified && (
        <div className="border border-green-200 rounded-xl p-5 bg-green-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <I d={P.shield} size={18} className="text-green-600" sw={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Identity verified</p>
              <p className="text-xs text-green-600">All checks passed</p>
            </div>
          </div>
          <div className="space-y-2 pl-11">
            <div className="flex items-center gap-2 text-xs">
              <I d={P.check} size={12} className="text-green-600" sw={2.5} />
              <span className="text-gray-700">National ID matches: <strong>{data.firstName} {data.lastName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <I d={P.check} size={12} className="text-green-600" sw={2.5} />
              <span className="text-gray-700">Phone ownership confirmed: <strong>{data.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <I d={P.check} size={12} className="text-green-600" sw={2.5} />
              <span className="text-gray-700">Selfie matches ID photo</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 4: CR12 UPLOAD & FACILITY MATCHING
// ═══════════════════════════════════════════════════════════════════════════════

function Step4CR12({ data, onChange }) {
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(data.cr12Scanned || false)

  function handleUpload() {
    onChange({ ...data, cr12Uploaded: true })
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setScanned(true)
      onChange({
        ...data,
        cr12Uploaded: true,
        cr12Scanned: true,
        extractedBusiness: 'City General Hospital Ltd',
        extractedRegNo: 'PVT-2019-123456',
        extractedDirectors: ['Dr. Amina Ochieng', 'James Mwangi', 'Sarah Kamau'],
      })
    }, 1800)
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Upload CR12 document</h2>
      <p className="text-sm text-gray-400 text-center mb-5">
        Your CR12 (Certificate of Registration) confirms the business entity and its directors.
      </p>

      {!data.cr12Uploaded && !scanning && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-jireh-purple hover:bg-jireh-purple-pale transition-all"
          onClick={handleUpload}>
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <I d={P.upload} size={22} className="text-gray-400" sw={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-700">Upload CR12 document</p>
          <p className="text-xs text-gray-400 mt-1">Accepts PDF, JPG, PNG</p>
        </div>
      )}

      {scanning && (
        <div className="border border-purple-200 rounded-xl p-6 bg-purple-50 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <Spinner />
          </div>
          <p className="text-sm font-semibold text-gray-900">Scanning document...</p>
          <p className="text-xs text-gray-500 mt-1">Extracting business details via OCR</p>
          <div className="mt-3 h-1.5 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-jireh-purple rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {scanned && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <I d={P.file} size={16} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">CR12_City_General_Hospital.pdf</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <I d={P.check} size={10} className="text-green-600" sw={2.5} /> Uploaded & scanned
                </p>
              </div>
            </div>
          </div>

          <div className="border border-green-200 rounded-xl p-4 bg-green-50">
            <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-3">Extracted Information</p>
            <div className="space-y-2.5">
              <div>
                <p className="text-xs text-gray-500">Business Name</p>
                <p className="text-sm font-semibold text-gray-900">{data.extractedBusiness}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Registration Number</p>
                <p className="text-sm font-medium text-gray-900">{data.extractedRegNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Directors</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(data.extractedDirectors || []).map(d => (
                    <span key={d} className="text-xs bg-white border border-green-200 px-2 py-1 rounded-full text-gray-700">{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <I d={P.check} size={11} className="text-green-600" sw={2.5} />
            </div>
            <span className="text-sm text-green-700 font-medium">Match found in KMPDC registry</span>
          </div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 5: OWNERSHIP VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

function Step5Ownership({ data }) {
  const currentUser = `${data.firstName} ${data.lastName}`
  const directors = data.extractedDirectors || []

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Ownership verification</h2>
      <p className="text-sm text-gray-400 text-center mb-5">
        We're checking that your verified identity matches a director on the CR12.
      </p>

      <div className="border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Directors from CR12</p>
        <div className="space-y-2">
          {directors.map(d => {
            const isMatch = d.includes(data.firstName) && d.includes(data.lastName)
            return (
              <div key={d} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isMatch ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isMatch ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  <I d={P.person} size={14} className={isMatch ? 'text-green-600' : 'text-gray-400'} sw={1.5} />
                </div>
                <span className={`text-sm flex-1 ${isMatch ? 'font-semibold text-green-800' : 'text-gray-700'}`}>{d}</span>
                {isMatch && (
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <I d={P.check} size={10} className="text-green-600" sw={2.5} /> You
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="border border-green-200 rounded-xl p-4 bg-green-50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <I d={P.shield} size={16} className="text-green-600" sw={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">Ownership confirmed</p>
            <p className="text-xs text-green-700 mt-0.5">
              <strong>{currentUser}</strong> is listed as a director on the CR12 for <strong>{data.extractedBusiness}</strong>.
              You are authorized to sign the commercial agreement.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 6: LEGAL AGREEMENT
// ═══════════════════════════════════════════════════════════════════════════════

function Step6Agreement({ data, onChange }) {
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(data.agreementSigned || false)

  function handleSign() {
    setSigning(true)
    setTimeout(() => {
      setSigning(false)
      setSigned(true)
      onChange({
        ...data,
        agreementSigned: true,
        agreementTimestamp: new Date().toLocaleString('en-KE', {
          dateStyle: 'long', timeStyle: 'short',
        }),
      })
    }, 1500)
  }

  return (
    <>
      <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Commercial agreement</h2>
      <p className="text-sm text-gray-400 text-center mb-5">
        Review and sign the Jireh partnership agreement for <strong className="text-gray-600">{data.extractedBusiness}</strong>.
      </p>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jireh Health — Provider Partnership Agreement</p>
        </div>
        <div className="px-4 py-4 max-h-64 overflow-y-auto text-xs text-gray-600 leading-relaxed space-y-3">
          <div>
            <p className="font-semibold text-gray-800">1. Partnership Terms</p>
            <p>This agreement establishes {data.extractedBusiness || 'the Provider'} as an In-Network partner of the Jireh Health platform. The Provider agrees to accept Jireh-facilitated payments for healthcare services rendered to patients and caregivers registered on the Jireh platform.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">2. Pricing & Discount Commitment</p>
            <p>The Provider commits to offering a minimum 20% discount on published prices for all Jireh-facilitated transactions. This discount applies to all services offered through the platform and forms the basis of the value proposition to Jireh members.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">3. Professional Indemnity</p>
            <p>The Provider warrants that all clinical services are rendered by qualified and registered professionals. The Provider maintains valid professional indemnity insurance covering all practitioners and services offered through the Jireh network.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">4. Data Protection Obligations</p>
            <p>Both parties agree to comply with the Kenya Data Protection Act (2019). Patient health and financial data processed through the Jireh platform shall be handled in accordance with ODPC guidelines. The Provider shall not share patient data obtained through Jireh transactions with unauthorized third parties.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">5. Settlement Terms</p>
            <p>Jireh shall settle verified transactions to the Provider's designated settlement account within 3 business days of transaction confirmation. Settlement reports detailing individual transactions will be available through the Provider Portal.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">6. Termination</p>
            <p>Either party may terminate this agreement with 30 days written notice. Outstanding settlements will be completed within 14 days of termination.</p>
          </div>
        </div>
      </div>

      {!signed && (
        <>
          <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              data.agreementAccepted ? 'bg-jireh-purple border-jireh-purple' : 'border-gray-300'
            }`} onClick={() => onChange({ ...data, agreementAccepted: !data.agreementAccepted })}>
              {data.agreementAccepted && <I d={P.check} size={9} className="text-white" sw={3} />}
            </div>
            <span className="text-sm text-gray-700" onClick={() => onChange({ ...data, agreementAccepted: !data.agreementAccepted })}>
              I have read and agree to the terms of the Jireh Provider Partnership Agreement, including the 20% discount commitment and professional indemnity requirements.
            </span>
          </label>

          <button onClick={handleSign}
            disabled={!data.agreementAccepted || signing}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              data.agreementAccepted && !signing
                ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {signing ? <><Spinner /> Signing agreement...</> : (
              <><I d={P.pen} size={15} className="text-white" sw={1.5} /> Sign Agreement</>
            )}
          </button>
        </>
      )}

      {signed && (
        <div className="border border-green-200 rounded-xl p-4 bg-green-50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <I d={P.pen} size={16} className="text-green-600" sw={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Agreement signed</p>
              <p className="text-xs text-green-700 mt-0.5">
                Signed by <strong>{data.firstName} {data.lastName}</strong> on {data.agreementTimestamp}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 7: ACCOUNT ACTIVATED
// ═══════════════════════════════════════════════════════════════════════════════

function Step7Activated({ data, onProceed, onBack }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4">
        <I d={P.sparkles} size={28} className="text-green-600" sw={1.5} />
      </div>

      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
        In-Network
      </span>

      <h2 className="text-xl font-bold text-gray-900 mb-1">Provider account activated!</h2>
      <p className="text-sm text-gray-500 mb-6">
        <strong>{data.extractedBusiness}</strong> is now an In-Network partner on the Jireh Health platform.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mb-6">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Provider</span>
            <span className="font-medium text-gray-900">{data.extractedBusiness}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Registration No.</span>
            <span className="font-medium text-gray-900">{data.extractedRegNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Verified Owner</span>
            <span className="font-medium text-gray-900">{data.firstName} {data.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Agreement Signed</span>
            <span className="font-medium text-gray-900">{data.agreementTimestamp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium text-green-700 flex items-center gap-1">
              <I d={P.check} size={12} className="text-green-600" sw={2.5} /> Active
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button onClick={onProceed}
          className="w-full py-3 rounded-xl bg-jireh-purple text-white text-sm font-semibold hover:bg-jireh-purple-light transition-all">
          Proceed to Facility Setup
        </button>
        <button onClick={onBack}
          className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Back to journeys
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProviderOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [inviteSent, setInviteSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const [data, setData] = useState({
    firstName: 'Amina',
    lastName: 'Ochieng',
    email: 'amina.ochieng@citygeneralhospital.co.ke',
    phone: '+254722345678',
    providerName: 'City General Hospital',
    authorized: '',
    // delegation
    delegateFirstName: '',
    delegateLastName: '',
    delegateEmail: '',
    delegatePhone: '',
    // identity
    idUploaded: false,
    selfieUploaded: false,
    identityVerified: false,
    // CR12
    cr12Uploaded: false,
    cr12Scanned: false,
    extractedBusiness: '',
    extractedRegNo: '',
    extractedDirectors: [],
    // agreement
    agreementAccepted: false,
    agreementSigned: false,
    agreementTimestamp: '',
  })

  function handleSendInvite() {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setInviteSent(true)
    }, 1200)
  }

  const canAdvance = [
    // Step 0: personal details
    data.firstName.trim() && data.lastName.trim() && data.email.trim() && data.phone.trim() && data.providerName.trim(),
    // Step 1: authorization — yes must be selected (no path ends at invite)
    data.authorized === 'yes',
    // Step 2: identity verified
    data.identityVerified,
    // Step 3: CR12 scanned
    data.cr12Scanned,
    // Step 4: ownership — always true once here (ownership is confirmed by data)
    true,
    // Step 5: agreement signed
    data.agreementSigned,
    // Step 6: activated — terminal
    true,
  ]

  function handleNext() {
    if (step < 6) setStep(s => s + 1)
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1)
  }

  const isTerminal = step === 6
  const isDelegationDead = step === 1 && inviteSent

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-8 pb-20 px-4">
      <JirehLogo className="mb-6" />

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
        <StepIndicator current={step} />

        <div className="text-xs text-gray-400 text-center mb-4">
          Step {step + 1} of 7 — {STEP_LABELS[step]}
        </div>

        {step === 0 && <Step1PersonalDetails data={data} onChange={setData} />}
        {step === 1 && <Step2Authorization data={data} onChange={setData} onSendInvite={handleSendInvite} isSending={isSending} inviteSent={inviteSent} />}
        {step === 2 && <Step3Identity data={data} onChange={setData} />}
        {step === 3 && <Step4CR12 data={data} onChange={setData} />}
        {step === 4 && <Step5Ownership data={data} />}
        {step === 5 && <Step6Agreement data={data} onChange={setData} />}
        {step === 6 && <Step7Activated data={data} onProceed={() => navigate('/facility-onboarding')} onBack={() => navigate('/')} />}

        {/* Navigation buttons */}
        {!isTerminal && !isDelegationDead && (
          <div className="mt-6 space-y-2">
            {step > 0 && (
              <button onClick={handleBack}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Back
              </button>
            )}
            <button onClick={handleNext}
              disabled={!canAdvance[step]}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                canAdvance[step]
                  ? 'bg-jireh-purple text-white hover:bg-jireh-purple-light'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              Continue
            </button>
          </div>
        )}
      </div>

      <button onClick={() => navigate('/')}
        className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to journeys
      </button>
    </div>
  )
}
