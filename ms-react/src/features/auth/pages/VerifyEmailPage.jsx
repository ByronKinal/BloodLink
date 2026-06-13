import { AuthLeftPanel }    from '../../../shared/components/AuthLeftPanel.jsx'
import { VerifyEmailForm } from '../components/VerifyEmailForm.jsx'

export function VerifyEmailPage() {
  return (
    <div className="h-screen flex overflow-hidden font-outfit">
      <AuthLeftPanel />
      <div className="w-[520px] bg-blanco flex flex-col justify-center px-12 py-12 relative overflow-y-auto">
        <VerifyEmailForm />
      </div>
    </div>
  )
}
