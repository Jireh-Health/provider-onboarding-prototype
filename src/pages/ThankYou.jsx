import { useNavigate } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

export default function ThankYou() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-8 pb-20 px-4">
      <JirehLogo className="mb-6" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#7B2DBB"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-lg font-bold text-gray-900">Thank you for signing up!</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xs">
          We have contacted your admin to complete the rest of your account set-up.
        </p>

        <div className="mt-6 bg-gray-50 rounded-xl px-4 py-3 w-full text-left">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">What happens next</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="mt-1 w-4 h-4 rounded-full bg-jireh-purple-pale flex items-center justify-center flex-shrink-0">
                <span className="text-jireh-purple text-xs font-bold">1</span>
              </div>
              The authorized person receives an email invite from Jireh
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-4 h-4 rounded-full bg-jireh-purple-pale flex items-center justify-center flex-shrink-0">
                <span className="text-jireh-purple text-xs font-bold">2</span>
              </div>
              They complete the registration and sign the agreement
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 w-4 h-4 rounded-full bg-jireh-purple-pale flex items-center justify-center flex-shrink-0">
                <span className="text-jireh-purple text-xs font-bold">3</span>
              </div>
              Your facility goes live on the Jireh network
            </li>
          </ul>
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
