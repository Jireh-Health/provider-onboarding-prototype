import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import RegistrationForm from './pages/RegistrationForm'
import InboxView from './pages/InboxView'
import ThankYou from './pages/ThankYou'
import PasswordSetup from './pages/PasswordSetup'
import AccountCreated from './pages/AccountCreated'
import PortalDashboard from './pages/PortalDashboard'
import ProviderOnboarding from './pages/ProviderOnboarding'
import FacilityOnboarding from './pages/FacilityOnboarding'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || ''}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/inbox" element={<InboxView />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/password-setup" element={<PasswordSetup />} />
        <Route path="/account-created" element={<AccountCreated />} />
        <Route path="/portal" element={<PortalDashboard />} />
        <Route path="/provider-onboarding" element={<ProviderOnboarding />} />
        <Route path="/facility-onboarding" element={<FacilityOnboarding />} />
      </Routes>
    </BrowserRouter>
  )
}
