import { useState } from 'react'

export default function PropertyForm({ initial = {}, onSubmit, submitLabel = 'حفظ' }) {
  const [form, setForm] = useState({
    title: '', description: '', city: '', address: '', type: 'غرفة', price_per_month: 0,
    images: '', lat: '', lng: '', distance_to_university: '', available_from: '', available_to: '',
    ...initial
  })
  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const toArray = (v) => v ? v.split(',').map(s=>s.trim()).filter(Boolean) : []

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      images: Array.isArray(form.images) ? form.images : toArray(form.images),
      price_per_month: Number(form.price_per_month) || 0,
      lat: form.lat ? Number(form.lat) : undefined,
      lng: form.lng ? Number(form.lng) : undefined,
      available_from: form.available_from || undefined,
      available_to: form.available_to || undefined,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
      <div className="grid md:grid-cols-2 gap-3">
        <input value={form.title} onChange={e=>update('title', e.target.value)} placeholder="العنوان" className="px-3 py-2 border rounded-lg" required />
        <select value={form.city} onChange={e=>update('city', e.target.value)} className="px-3 py-2 border rounded-lg" required>
          <option value="">المدينة</option>
          <option>إسطنبول</option>
          <option>أنقرة</option>
          <option>إزمير</option>
          <option>طرابزون</option>
          <option>قونية</option>
        </select>
        <select value={form.type} onChange={e=>update('type', e.target.value)} className="px-3 py-2 border rounded-lg" required>
          <option value="غرفة">غرفة</option>
          <option value="شقة">شقة</option>
          <option value="سكن طلاب">سكن طلاب</option>
        </select>
        <input value={form.address} onChange={e=>update('address', e.target.value)} placeholder="العنوان التفصيلي" className="px-3 py-2 border rounded-lg" required />
        <input type="number" value={form.price_per_month} onChange={e=>update('price_per_month', e.target.value)} placeholder="السعر الشهري (₺)" className="px-3 py-2 border rounded-lg" required />
        <input value={form.images} onChange={e=>update('images', e.target.value)} placeholder="روابط الصور مفصولة بفواصل" className="px-3 py-2 border rounded-lg" />
        <input value={form.distance_to_university} onChange={e=>update('distance_to_university', e.target.value)} placeholder="المسافة إلى الجامعة (مثال: 10 دقائق)" className="px-3 py-2 border rounded-lg" />
        <div className="grid grid-cols-2 gap-2">
          <input value={form.lat} onChange={e=>update('lat', e.target.value)} placeholder="خط العرض" className="px-3 py-2 border rounded-lg" />
          <input value={form.lng} onChange={e=>update('lng', e.target.value)} placeholder="خط الطول" className="px-3 py-2 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={form.available_from} onChange={e=>update('available_from', e.target.value)} className="px-3 py-2 border rounded-lg" />
          <input type="date" value={form.available_to} onChange={e=>update('available_to', e.target.value)} className="px-3 py-2 border rounded-lg" />
        </div>
      </div>
      <textarea value={form.description} onChange={e=>update('description', e.target.value)} placeholder="الوصف الكامل" className="w-full px-3 py-2 border rounded-lg" rows={4} />
      <button type="submit" className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">{submitLabel}</button>
    </form>
  )
}
