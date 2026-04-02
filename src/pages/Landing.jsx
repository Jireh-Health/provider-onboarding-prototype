import { useNavigate } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

const journeys = [
  {
    id: 'unauthorized',
    label: 'Journey 1 — Unauthorized staff',
    persona: 'Jane Wanjiku',
    description:
      'Jane works in Finance & Accounting at Jumuia Hospital Huruma. She is NOT authorized to register the provider. She lands on the registration page, fills her details, and must refer the authorized person.',
    tag: 'No authorization → referral loop',
    tagColor: 'bg-orange-100 text-orange-700',
    path: '/register?journey=unauthorized',
  },
  {
    id: 'referred',
    label: 'Journey 2 — Authorized person via referral',
    persona: 'Kamau Ole Tipis',
    description:
      'Jane has already referred Kamau. He lands directly on the registration form. He is the Owner / Director of Nairobi General Hospital and IS authorized to complete the registration.',
    tag: 'Authorized → completes registration',
    tagColor: 'bg-green-100 text-green-700',
    path: '/register?journey=referred',
  },
  {
    id: 'email',
    label: 'Journey 3 — Authorized person via email invite',
    persona: 'Kamau Ole Tipis',
    description:
      'Start from a mock email inbox. Open the invite email sent by Jireh Health and click "Complete registration" to be taken into the form with details pre-filled.',
    tag: 'Email link → registration',
    tagColor: 'bg-blue-100 text-blue-700',
    path: '/inbox',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center pt-12 px-4 pb-20">
      <JirehLogo className="mb-10" />

      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            Prototype
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            Provider Onboarding — Stage 1
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-md mx-auto">
            The authorization loop: finding the right person to onboard a facility.
            Select a journey entry point below.
          </p>
        </div>

        <div className="space-y-3">
          {journeys.map((j) => (
            <button
              key={j.id}
              onClick={() => navigate(j.path)}
              className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-jireh-purple transition-colors">
                      {j.label}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${j.tagColor}`}>
                      {j.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-jireh-purple">
                    Persona: {j.persona}
                  </p>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                    {j.description}
                  </p>
                </div>
                <div className="mt-1 text-gray-300 group-hover:text-jireh-purple transition-colors flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          No backend. Data stored in <code className="bg-gray-100 px-1 py-0.5 rounded">localStorage</code>.
        </p>
      </div>
    </div>
  )
}
