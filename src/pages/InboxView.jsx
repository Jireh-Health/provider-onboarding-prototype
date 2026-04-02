import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMAILS = [
  {
    id: 1,
    from: 'Jireh Health',
    fromEmail: 'no-reply@jireh.com',
    subject: 'Complete Registration for Nairobi General Hospital',
    preview: 'You have been invited by Jane Wanjiku to complete the registration of Nairobi General Hospital on the Jireh Health platform.',
    time: '2:14 PM',
    unread: true,
    isJireh: true,
  },
  {
    id: 2,
    from: 'Kenya Revenue Authority',
    fromEmail: 'noreply@kra.go.ke',
    subject: 'PIN Certificate Renewal Reminder',
    preview: 'Dear Taxpayer, this is a reminder that your PIN certificate is due for renewal.',
    time: 'Yesterday',
    unread: false,
    isJireh: false,
  },
  {
    id: 3,
    from: 'Equity Bank Kenya',
    fromEmail: 'alerts@equitybank.co.ke',
    subject: 'Your monthly account statement is ready',
    preview: 'Your account statement for March 2026 is now available. Log in to view.',
    time: 'Mar 31',
    unread: false,
    isJireh: false,
  },
  {
    id: 4,
    from: 'NHIF Kenya',
    fromEmail: 'info@nhif.or.ke',
    subject: 'NHIF Contribution Update',
    preview: 'Dear member, your NHIF contribution for Q1 2026 has been received.',
    time: 'Mar 28',
    unread: false,
    isJireh: false,
  },
]

function InboxRow({ email, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        email.unread ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className={`mt-0.5 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
        email.isJireh ? 'bg-purple-100 text-jireh-purple' : 'bg-gray-100 text-gray-500'
      }`}>
        {email.from.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${email.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {email.from}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0">{email.time}</span>
        </div>
        <p className={`text-xs truncate ${email.unread ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
          {email.subject}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">{email.preview}</p>
      </div>
      {email.unread && (
        <div className="mt-1.5 w-2 h-2 rounded-full bg-jireh-purple flex-shrink-0" />
      )}
    </button>
  )
}

function EmailDetail({ email, onBack, onCompleteRegistration }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-sm font-semibold text-gray-900 flex-1 truncate">{email.subject}</p>
      </div>

      <div className="px-4 py-5">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-jireh-purple flex-shrink-0">
            J
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{email.from}</p>
            <p className="text-xs text-gray-400">{email.fromEmail} · Today at {email.time}</p>
          </div>
        </div>

        {/* Email body */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-sm mx-auto">
          {/* Logo */}
          <div className="px-8 pt-8 pb-4 text-center border-b border-gray-100">
            <div className="flex items-baseline justify-center gap-0 mb-0" style={{ fontFamily: "'Nunito', 'Inter', sans-serif", fontWeight: 800 }}>
              <span className="text-xl" style={{ color: '#8B00FF' }}>jireh</span>
              <span className="text-xl" style={{ color: '#D4A0F5', fontWeight: 700 }}>health</span>
              <span className="text-xl" style={{ color: '#8B00FF' }}>.</span>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="#7B2DBB" strokeWidth="1.5" />
                  <path d="M7 8h10M7 12h6" stroke="#7B2DBB" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="17" cy="16" r="3" fill="#7B2DBB" />
                  <path d="M15.5 16l1 1 2-1.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h2 className="text-base font-bold text-gray-900 text-center mb-4">
              Complete Registration for<br />
              <span className="text-jireh-purple">Nairobi General Hospital</span>
            </h2>

            <p className="text-sm text-gray-600 mb-1">Hello,</p>
            <p className="text-sm text-gray-600 mb-3">Welcome to Jireh!</p>
            <p className="text-sm text-gray-600 mb-5">
              You have been invited by{' '}
              <span className="font-semibold text-gray-900">Jane Wanjiku</span>{' '}
              to complete the registration of{' '}
              <span className="font-semibold text-gray-900">Nairobi General Hospital</span>{' '}
              on the Jireh Health platform.
            </p>

            <button
              onClick={onCompleteRegistration}
              className="w-full py-3 rounded-lg bg-jireh-purple text-white text-sm font-semibold hover:bg-jireh-purple-light transition-colors mb-5"
            >
              Complete registration
            </button>

            <div className="text-xs text-gray-500 mb-5 bg-gray-50 rounded-lg p-3">
              If you are not familiar with the email that recommended you, please reach out to us on{' '}
              <span className="text-gray-700">+254 123 456 789</span> or{' '}
              <span className="text-jireh-purple">support@jireh.com</span>.
              <br /><br />
              Your security is our top priority!
              <br /><br />
              Stay safe,<br />
              <span className="font-medium text-gray-700">The Jireh Team</span>
            </div>

            <p className="text-xs text-gray-400 text-center">
              This email is meant for{' '}
              <span className="text-gray-600">kamau.oletipis@hospital.co.ke</span>
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#6B7280">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                </svg>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#6B7280">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InboxView() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const selectedEmail = EMAILS.find((e) => e.id === selected)

  function handleCompleteRegistration() {
    navigate('/register?journey=email-invite')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-xl">
      {/* Status bar mock */}
      <div className="bg-white px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">Gmail</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <div className="w-7 h-7 rounded-full bg-jireh-purple flex items-center justify-center text-white text-xs font-bold">K</div>
        </div>
      </div>

      {!selected ? (
        <>
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <p className="text-base font-semibold text-gray-900">Inbox</p>
            <p className="text-xs text-gray-400 mt-0.5">1 unread message</p>
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            {EMAILS.map((email) => (
              <InboxRow key={email.id} email={email} onClick={() => setSelected(email.id)} />
            ))}
          </div>
        </>
      ) : (
        <EmailDetail
          email={selectedEmail}
          onBack={() => setSelected(null)}
          onCompleteRegistration={handleCompleteRegistration}
        />
      )}

      {/* Bottom nav mock */}
      <div className="bg-white border-t border-gray-200 flex items-center justify-around py-2 px-4">
        {[
          { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Mail', active: true },
          { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Meet', active: false },
        ].map((item) => (
          <button key={item.label} className="flex flex-col items-center gap-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.active ? '#7B2DBB' : '#9CA3AF'} strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className={`text-xs ${item.active ? 'text-jireh-purple font-medium' : 'text-gray-400'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
