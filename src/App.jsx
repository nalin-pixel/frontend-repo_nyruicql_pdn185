import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Filters from './components/Filters'
import Card from './components/Card'
import PropertyForm from './components/PropertyForm'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useAuth() {
  const [auth, setAuth] = useState(()=>{
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return token && user ? { token, user: JSON.parse(user) } : { token: null, user: null }
  })
  const login = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({ token, user })
  }
  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); setAuth({ token: null, user: null })
  }
  return { ...auth, login, logout }
}

async function api(path, method = 'GET', body, token) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'خطأ في الطلب')
  return res.json()
}

function Landing() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <Hero />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">أحدث العروض</h2>
        <p className="text-slate-600">استكشف خيارات السكن المناسبة لك في مدن تركيا.</p>
      </section>
    </div>
  )
}

function Browse() {
  const [filters, setFilters] = useState({ city: '', type: '', min_price: '', max_price: '' })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (filters.city) qs.append('city', filters.city)
    if (filters.type) qs.append('type', filters.type)
    if (filters.min_price) qs.append('min_price', filters.min_price)
    if (filters.max_price) qs.append('max_price', filters.max_price)
    const data = await api(`/properties?${qs.toString()}`)
    setItems(data)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Filters filters={filters} setFilters={setFilters} onSearch={load} />
        {loading ? (
          <p>جارِ التحميل...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map(i => <Card key={i.id} item={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function PropertyPage() {
  const { pathname } = useLocation()
  const id = pathname.split('/').pop()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api(`/properties/${id}`).then(setData).finally(()=>setLoading(false))
  }, [id])

  if (loading) return <div className="p-8">جارِ التحميل...</div>
  if (!data) return <div className="p-8">غير موجود</div>

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <img src={data.images?.[0] || 'https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1600&auto=format&fit=crop'} className="w-full h-72 object-cover rounded-xl border" />
            <div className="grid grid-cols-4 gap-2">
              {(data.images || []).slice(1,5).map((src,i)=> (
                <img key={i} src={src} className="w-full h-20 object-cover rounded-lg border" />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
            <p className="text-slate-600 mb-3">{data.city} • {data.type} • {data.price_per_month} ₺ / شهر</p>
            <p className="mb-4 text-slate-700 whitespace-pre-line">{data.description}</p>
            {data.distance_to_university && <p className="text-slate-500 mb-4">المسافة إلى الجامعة: {data.distance_to_university}</p>}
            <a href={`https://www.google.com/maps?q=${data.lat || ''},${data.lng || ''}`} target="_blank" className="text-sky-700 underline">عرض على الخريطة</a>
            <div className="mt-6">
              <Link to={`/book/${data.id}`} className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800">احجز الآن</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookPage({ token }) {
  const { pathname } = useLocation()
  const id = pathname.split('/').pop()
  const nav = useNavigate()
  const [form, setForm] = useState({ start_date: '', end_date: '', guests: 1 })
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api('/bookings', 'POST', { property_id: id, ...form, guests: Number(form.guests) }, token)
      setMsg('تم إرسال طلب الحجز بنجاح')
      setTimeout(()=> nav('/'), 1200)
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">الحجز</h1>
        <form onSubmit={submit} className="space-y-3 bg-white border p-4 rounded-xl">
          <input type="date" value={form.start_date} onChange={e=>setForm(f=>({...f, start_date: e.target.value}))} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="date" value={form.end_date} onChange={e=>setForm(f=>({...f, end_date: e.target.value}))} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="number" min={1} value={form.guests} onChange={e=>setForm(f=>({...f, guests: e.target.value}))} className="w-full px-3 py-2 border rounded-lg" required />
          <button className="w-full px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">تأكيد الحجز</button>
          {msg && <p className="text-center text-sm text-slate-700">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api('/auth/login', 'POST', form)
      onLogin(res.token, res.user)
    } catch (e) { setMsg(e.message) }
  }
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">تسجيل الدخول</h1>
        <form onSubmit={submit} className="space-y-3 bg-white border p-4 rounded-xl">
          <input value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} placeholder="البريد الإلكتروني" className="w-full px-3 py-2 border rounded-lg" />
          <input type="password" value={form.password} onChange={e=>setForm(f=>({...f, password: e.target.value}))} placeholder="كلمة المرور" className="w-full px-3 py-2 border rounded-lg" />
          <button className="w-full px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">دخول</button>
          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

function Signup({ onLogin }) {
  const params = new URLSearchParams(window.location.search)
  const defaultRole = params.get('role') || 'user'
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: defaultRole, phone: '', city: '' })
  const [msg, setMsg] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api('/auth/signup', 'POST', form)
      onLogin(res.token, res.user)
    } catch (e) { setMsg(e.message) }
  }
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">إنشاء حساب</h1>
        <form onSubmit={submit} className="space-y-3 bg-white border p-4 rounded-xl">
          <input value={form.full_name} onChange={e=>setForm(f=>({...f, full_name: e.target.value}))} placeholder="الاسم الكامل" className="w-full px-3 py-2 border rounded-lg" />
          <input value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} placeholder="البريد الإلكتروني" className="w-full px-3 py-2 border rounded-lg" />
          <input type="password" value={form.password} onChange={e=>setForm(f=>({...f, password: e.target.value}))} placeholder="كلمة المرور" className="w-full px-3 py-2 border rounded-lg" />
          <select value={form.role} onChange={e=>setForm(f=>({...f, role: e.target.value}))} className="w-full px-3 py-2 border rounded-lg">
            <option value="user">مستخدم</option>
            <option value="host">مالك</option>
          </select>
          <input value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} placeholder="رقم الهاتف" className="w-full px-3 py-2 border rounded-lg" />
          <input value={form.city} onChange={e=>setForm(f=>({...f, city: e.target.value}))} placeholder="المدينة" className="w-full px-3 py-2 border rounded-lg" />
          <button className="w-full px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">تسجيل</button>
          {msg && <p className="text-center text-sm text-red-600">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

function Host({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await api('/properties')
    setItems(data)
    setLoading(false)
  }
  useEffect(()=>{ load() }, [])

  const create = async (payload) => {
    await api('/properties', 'POST', payload, token)
    await load()
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">لوحة المالك</h1>
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">إضافة سكن</h2>
          <PropertyForm onSubmit={create} submitLabel="نشر" />
        </div>
        <div>
          <h2 className="font-semibold mb-3">عقاراتك المنشورة</h2>
          {loading ? '...' : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(i => <Card key={i.id} item={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Admin({ token }) {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])

  const load = async () => {
    try {
      const s = await api('/admin/stats', 'GET', null, token)
      const u = await api('/admin/users', 'GET', null, token)
      setStats(s); setUsers(u)
    } catch (e) { /* ignore */ }
  }
  useEffect(()=>{ load() }, [])

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border rounded-xl p-4">المستخدمون: {stats.users}</div>
            <div className="bg-white border rounded-xl p-4">المالكون: {stats.hosts}</div>
            <div className="bg-white border rounded-xl p-4">العقارات: {stats.properties}</div>
            <div className="bg-white border rounded-xl p-4">الحجوزات: {stats.bookings}</div>
          </div>
        )}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">قائمة المستخدمين</h2>
          <ul className="list-disc pr-6">
            {users.map(u => (
              <li key={u.id}>{u.full_name} - {u.email} ({u.role})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { token, user, login, logout } = useAuth()

  return (
    <div className="bg-white min-h-screen">
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/book/:id" element={<BookPage token={token} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/signup" element={<Signup onLogin={login} />} />
        <Route path="/host" element={<Host token={token} />} />
        <Route path="/admin" element={<Admin token={token} />} />
      </Routes>
      <footer className="text-center py-8 text-slate-500" dir="rtl">© {new Date().getFullYear()} سكنلي</footer>
    </div>
  )
}
