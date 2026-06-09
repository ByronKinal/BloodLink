import { LoginLeftPanel } from '../components/LoginLeftPanel.jsx'
import { LoginForm }      from '../components/LoginForm.jsx'

export function LoginPage() {
  return (
    <div className="h-screen flex overflow-hidden font-outfit">
      {/* Dark left panel */}
      <LoginLeftPanel />

      {/* White right panel */}
      <div className="w-[440px] bg-blanco flex flex-col justify-center px-11 py-12 relative overflow-hidden overflow-y-auto">
        <LoginForm />
      </div>
    </div>
  )
}
