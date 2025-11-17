export default function Filters({ filters, setFilters, onSearch }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 grid md:grid-cols-5 gap-3" dir="rtl">
      <select value={filters.city} onChange={e=>update('city', e.target.value)} className="px-3 py-2 border rounded-lg">
        <option value="">المدينة</option>
        <option>إسطنبول</option>
        <option>أنقرة</option>
        <option>إزمير</option>
        <option>طرابزون</option>
        <option>قونية</option>
      </select>
      <select value={filters.type} onChange={e=>update('type', e.target.value)} className="px-3 py-2 border rounded-lg">
        <option value="">النوع</option>
        <option value="غرفة">غرفة</option>
        <option value="شقة">شقة</option>
        <option value="سكن طلاب">سكن طلاب</option>
      </select>
      <input type="number" value={filters.min_price} onChange={e=>update('min_price', e.target.value)} placeholder="أدنى سعر" className="px-3 py-2 border rounded-lg"/>
      <input type="number" value={filters.max_price} onChange={e=>update('max_price', e.target.value)} placeholder="أعلى سعر" className="px-3 py-2 border rounded-lg"/>
      <button onClick={onSearch} className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">بحث</button>
    </div>
  )
}
