import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Active Users', value: '12,000+' },
  { label: 'Deals Closed', value: '?2.4Cr+' },
  { label: 'Leads Tracked', value: '85,000+' },
  { label: 'Uptime', value: '99.9%' },
];

const features = [
  { icon: 'ti-users', title: 'Lead Management', desc: 'Track every lead from first contact to closed deal with smart stage tracking and filters.' },
  { icon: 'ti-layout-kanban', title: 'Kanban Pipeline', desc: 'Visualize your entire sales pipeline with drag-and-drop deal cards across custom stages.' },
  { icon: 'ti-chart-bar', title: 'Sales Analytics', desc: 'Real-time dashboards with revenue charts, win rates, and team performance breakdowns.' },
  { icon: 'ti-mail', title: 'Email & Activity Logs', desc: 'Log every call, email, and meeting. Never lose context on any deal or customer.' },
  { icon: 'ti-lock', title: 'Role-Based Access', desc: 'Admin, Manager, and Sales roles with granular permission control across all modules.' },
  { icon: 'ti-bolt', title: 'Lightning Fast', desc: 'Built on modern stack — React, Node.js, MongoDB. Blazing fast UI with zero lag.' },
];

const plans = [
  { name: 'Starter', price: 'Free', features: ['Up to 3 users', '500 leads', 'Basic dashboard', 'Email support'], highlight: false },
  { name: 'Pro', price: '?999/mo', features: ['Unlimited users', 'Unlimited leads', 'Advanced analytics', 'Priority support', 'Kanban pipeline'], highlight: true },
  { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'], highlight: false },
];

const testimonials = [
  { name: 'Arjun Mehta', role: 'Sales Head, TechCorp', text: 'Our deal closure rate went up 40% in just 2 months. The pipeline view is a game changer.' },
  { name: 'Priya Sharma', role: 'Founder, GrowthLabs', text: 'Finally a CRM that feels modern. The UI is clean and our team adopted it instantly.' },
  { name: 'Rahul Singh', role: 'VP Sales, Nexus Inc', text: 'The activity logs and email tracking save us hours every week. Absolutely love it.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [count, setCount] = useState({ users: 0, deals: 0, leads: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount({ users: 12000, deals: 24000000, leads: 85000 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className={"fixed top-0 w-full z-50 transition-all duration-300 " + (scrolled ? "bg-gray-950/95 backdrop-blur border-b border-gray-800 shadow-lg" : "bg-transparent")}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ti ti-bolt text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold">Enterprise CRM</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Testimonials'].map(item => (
              <a key={item} href={"#" + item.toLowerCase()}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:scale-105 inline-block">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white text-sm transition px-4 py-2 rounded-lg hover:bg-gray-800">
              Sign in
            </button>
            <button onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-4 py-2 rounded-full mb-8 hover:bg-blue-500/20 transition cursor-default">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Now with AI-powered lead scoring
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Close More Deals
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The enterprise CRM built for modern sales teams. Track leads, manage pipelines,
            and close deals — all in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => navigate('/login')}
              className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-base font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 flex items-center gap-2">
              Start for Free
              <i className="ti ti-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button className="group flex items-center gap-2 text-gray-400 hover:text-white px-8 py-4 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/50">
              <i className="ti ti-play text-blue-400"></i>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 hover:border-gray-600 hover:bg-gray-900 transition-all duration-300 hover:scale-105 cursor-default">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything your sales team needs</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Powerful features designed to help you sell smarter, not harder.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={"group relative bg-gray-900 border rounded-2xl p-6 transition-all duration-300 cursor-default " +
                  (hoveredFeature === i ? "border-blue-500/50 shadow-lg shadow-blue-500/10 scale-105 -translate-y-1" : "border-gray-800 hover:border-gray-700")}>
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 " +
                  (hoveredFeature === i ? "bg-blue-600 shadow-lg shadow-blue-500/30" : "bg-gray-800")}>
                  <i className={"ti " + f.icon + " text-xl " + (hoveredFeature === i ? "text-white" : "text-gray-400")}></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                <div className={"absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 transition-opacity duration-300 " +
                  (hoveredFeature === i ? "opacity-100" : "opacity-0")}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 text-lg">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={"relative rounded-2xl p-6 transition-all duration-300 cursor-default " +
                  (plan.highlight
                    ? "bg-blue-600 border border-blue-500 scale-105 shadow-2xl shadow-blue-500/20"
                    : "bg-gray-900 border border-gray-800 " + (hoveredPlan === i ? "border-gray-600 scale-102 -translate-y-1 shadow-lg" : ""))}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="text-3xl font-bold my-4">{plan.price}</div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat, j) => (
                    <li key={j} className={"flex items-center gap-2 text-sm " + (plan.highlight ? "text-blue-100" : "text-gray-400")}>
                      <i className={"ti ti-check text-base " + (plan.highlight ? "text-white" : "text-green-400")}></i>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')}
                  className={"w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 " +
                    (plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg"
                      : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700")}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by sales teams</h2>
            <p className="text-gray-400 text-lg">Join thousands of teams already using Enterprise CRM.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <i key={j} className="ti ti-star-filled text-yellow-400 text-sm"></i>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to supercharge your sales?</h2>
              <p className="text-gray-400 text-lg mb-8">Start free. No credit card required.</p>
              <button onClick={() => navigate('/login')}
                className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl text-base font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 flex items-center gap-2 mx-auto">
                Get Started for Free
                <i className="ti ti-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <i className="ti ti-bolt text-white text-xs"></i>
            </div>
            <span className="text-sm font-semibold">Enterprise CRM</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Enterprise CRM. Built with React + Node.js + MongoDB.</p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className="text-gray-500 hover:text-white text-sm transition">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
