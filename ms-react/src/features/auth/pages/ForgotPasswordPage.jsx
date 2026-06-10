import { AuthLeftPanel }       from '../../../shared/components/AuthLeftPanel.jsx'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm.jsx'

export function ForgotPasswordPage() {
  return (
    <div className="h-screen flex overflow-hidden font-outfit">
      <AuthLeftPanel />
      <div className="w-[480px] bg-blanco flex flex-col justify-center px-12 py-12 relative overflow-y-auto">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
