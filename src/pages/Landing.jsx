import { useNavigate } from 'react-router-dom'
import JirehLogo from '../components/JirehLogo'

// ── seed helpers ──────────────────────────────────────────────────────────────
const BASE_USER = {
  firstName: 'Kamau', lastName: 'Ole Tipis',
  email: 'kamau.oletipis@nairobigeneral.co.ke',
  phone: '+254712345678',
}

const FACILITY_1 = {
  id: 'facility_1',
  name: 'Nairobi General Hospital',
  type: 'Hospital/Dispensary/Clinic',
  level: 'Level 4 — Sub-County Hospital',
  status: 'active',
  services: ['General Outpatient Consultation', 'Immunisation / Vaccination', 'Triage', 'Chronic Disease Management', 'General Inpatient Admission', 'Maternity', 'Theatres'],
  receivedAmount: '1,245,000.00',
  assignedStaff: 12,
}

const FACILITY_2 = {
  id: 'facility_2',
  name: 'Nairobi General - Annex',
  type: 'Hospital/Dispensary/Clinic',
  level: 'Level 2 — Dispensary',
  status: 'active',
  services: ['General Outpatient Consultation', 'Triage', 'Basic Pharmacy', 'Immunisation / Vaccination'],
  receivedAmount: '342,500.00',
  assignedStaff: 4,
}

function seedAddFacility() {
  localStorage.setItem('jireh_user', JSON.stringify(BASE_USER))
  localStorage.setItem('jireh_facilities', JSON.stringify([FACILITY_1]))
  localStorage.setItem('jireh_active_facility', 'facility_1')
}

function seedSwitchFacility() {
  localStorage.setItem('jireh_user', JSON.stringify(BASE_USER))
  localStorage.setItem('jireh_facilities', JSON.stringify([FACILITY_1, FACILITY_2]))
  localStorage.setItem('jireh_active_facility', 'facility_1')
}

function seedFacilityOnboarding() {
  localStorage.setItem('jireh_user', JSON.stringify({
    firstName: 'Amina', lastName: 'Ochieng',
    email: 'amina.ochieng@citygeneralhospital.co.ke',
    phone: '+254722345678',
  }))
  localStorage.setItem('jireh_facilities', JSON.stringify([]))
  localStorage.removeItem('jireh_active_facility')
}

// ── journeys ──────────────────────────────────────────────────────────────────
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
  {
    id: 'add-facility',
    label: 'Journey 4 — Adding a new facility',
    persona: 'Kamau Ole Tipis',
    description:
      'Kamau is already logged in and has one active facility (Level 4 Hospital). He wants to register a second branch. Walk through the end-to-end flow: enter facility details → upload licence for AI verification → configure services filtered by deduced level.',
    tag: 'Portal → add facility modal',
    tagColor: 'bg-purple-100 text-purple-700',
    path: '/portal?journey=add-facility',
    seed: seedAddFacility,
  },
  {
    id: 'switch-facility',
    label: 'Journey 5 — Switching between facilities',
    persona: 'Kamau Ole Tipis',
    description:
      'Kamau manages two facilities: Nairobi General Hospital (Level 4) and Nairobi General - Annex (Level 2 Dispensary). He works from one facility at a time and switches context using the facility dropdown in the portal sidebar.',
    tag: 'Portal → facility switcher',
    tagColor: 'bg-teal-100 text-teal-700',
    path: '/portal?journey=switch-facility',
    seed: seedSwitchFacility,
  },
  { id: 'divider', divider: true, title: 'Onboarding Process Scenarios' },
  {
    id: 'provider-onboarding',
    label: 'Journey 6 — Provider Onboarding',
    persona: 'Dr. Amina Ochieng',
    description:
      'The full provider onboarding process: establishing the legal partnership between a business entity and Jireh. Covers personal details, authorization check, identity verification (ID + selfie), CR12 upload with OCR matching, ownership verification, commercial agreement signing, and account activation.',
    tag: 'Identity-first → agreement → In-Network',
    tagColor: 'bg-indigo-100 text-indigo-700',
    path: '/provider-onboarding',
  },
  {
    id: 'facility-onboarding',
    label: 'Journey 7 — Facility Onboarding',
    persona: 'Dr. Amina Ochieng',
    description:
      'Adding and configuring a facility under an already-onboarded provider. Covers license upload with OCR-based level deduction, level-filtered service configuration, map pinning, payment points with Jireh Payment Numbers, settlement account setup, and ABAC staff management.',
    tag: 'License-first → level deduction → provisioning',
    tagColor: 'bg-rose-100 text-rose-700',
    path: '/facility-onboarding',
    seed: seedFacilityOnboarding,
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
            Provider Onboarding & Portal
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 max-w-md mx-auto">
            End-to-end journeys covering the authorization loop, registration, and multi-facility portal management.
            Select a journey below.
          </p>
        </div>

        <div className="space-y-3">
          {journeys.map((j) => {
            if (j.divider) {
              return (
                <div key={j.id} className="pt-6 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{j.title}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                </div>
              )
            }
            return (
              <button
                key={j.id}
                onClick={() => { j.seed?.(); navigate(j.path) }}
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
            )
          })}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          No backend. Data stored in <code className="bg-gray-100 px-1 py-0.5 rounded">localStorage</code>.
        </p>
      </div>
    </div>
  )
}
