import { Link } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <header className="w-full bg-white/70 backdrop-blur border-b border-slate-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-sky-600">سكنلي</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/" className="text-slate-700 hover:text-sky-600">الرئيسية</Link>
          <Link to="/browse" className="text-slate-700 hover:text-sky-600">تصفح العقارات</Link>
          {user?.role === 'host' && (
            <Link to="/host" className="text-slate-700 hover:text-sky-600">لوحة المالك</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-slate-700 hover:text-sky-600">الإدارة</Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">تسجيل الدخول</Link>
              <Link to="/signup?role=host" className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700">تسجيل كمُضيف</Link>
            </>
          ) : (
            <button onClick={onLogout} className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">تسجيل الخروج</button>
          )}
        </div>
      </div>
    </header>
  )
}
