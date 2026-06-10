import { AuthLeftPanel } from '../../../shared/components/AuthLeftPanel.jsx'
import { RegisterForm }  from '../components/RegisterForm.jsx'

export function RegisterPage() {
  return (
    <div className="h-screen flex overflow-hidden font-outfit">
      <AuthLeftPanel />
      <div className="w-[500px] bg-blanco flex flex-col justify-center px-11 py-10 relative overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  )
}
