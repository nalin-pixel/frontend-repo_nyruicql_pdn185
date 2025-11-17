import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-white" />
      <div className="max-w-6xl mx-auto px-4 py-16 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">ابحث عن سكنك الطلابي في تركيا بسهولة</h1>
            <p className="text-slate-600 mb-6">"سكنلي" منصة عربية تساعدك على إيجاد غرف خاصة ومشتركة وشقق وسكن طلابي قرب جامعتك وبأسعار مناسبة.</p>
            <div className="flex items-center gap-3">
              <Link to="/browse" className="px-5 py-3 rounded-xl bg-sky-600 text-white hover:bg-sky-700">ابحث عن سكنك الآن</Link>
              <Link to="/signup?role=host" className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50">تسجيل كمُضيف</Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <img src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxIb3VzaW5nfGVufDB8MHx8fDE3NjM0MTU3NDl8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" alt="Housing" className="w-full h-[320px] object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
