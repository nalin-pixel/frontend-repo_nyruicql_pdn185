import { Link } from 'react-router-dom'

export default function Card({ item }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" dir="rtl">
      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1600&auto=format&fit=crop'} alt={item.title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900">{item.title}</h3>
          <span className="text-sky-700 font-semibold">{item.price_per_month} ₺ / شهر</span>
        </div>
        <p className="text-slate-600 text-sm mb-2">{item.city} • {item.type}</p>
        {item.distance_to_university && (
          <p className="text-slate-500 text-xs mb-3">يبعد عن الجامعة: {item.distance_to_university}</p>
        )}
        <Link to={`/property/${item.id}`} className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">عرض التفاصيل</Link>
      </div>
    </div>
  )
}
