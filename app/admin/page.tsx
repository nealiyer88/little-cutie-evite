import { cookies } from 'next/headers'
import LoginForm from './LoginForm'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === '1'

  return isAuthenticated ? <AdminDashboard /> : <LoginForm />
}
