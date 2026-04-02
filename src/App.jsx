import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import RegistrationForm from './pages/RegistrationForm'
import InboxView from './pages/InboxView'
import ThankYou from './pages/ThankYou'
import PasswordSetup from './pages/PasswordSetup'
import AccountCreated from './pages/AccountCreated'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/inbox" element={<InboxView />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/password-setup" element={<PasswordSetup />} />
        <Route path="/account-created" element={<AccountCreated />} />
      </Routes>
    </BrowserRouter>
  )
}
