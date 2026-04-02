import { useNavigate } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

export default function AccountCreated() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-8 pb-20 px-4">
      <JirehLogo className="mb-6" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Account created!</h1>
          <p className="mt-2 text-sm text-gray-500">
            Proceed to log in to your account and complete set up.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full py-3 rounded-xl bg-jireh-purple text-white text-sm font-semibold hover:bg-jireh-purple-light transition-colors"
        >
          Log in
        </button>
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
