import Link from "next/link";
import { NavBar } from "@/components/navbar";
import { ArrowRight, Cpu, Target, Droplets, Map, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-emerald-500/30">
      <NavBar />

      <main className="pt-20">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
  {/* Animated Grid Background */}
  <div className="absolute inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15] animate-grid" />
  </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-fade-in">
                <Zap className="size-4" />
                <span>Next-Gen Precision Farming</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                AgroSentry <span className="text-emerald-500">Drone</span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                AI-Powered Intelligence for precision agriculture. Optimize yields, reduce waste, and automate your farm with our autonomous drone platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-semibold transition-all duration-200">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Feature Grid */}
        <section className="py-24 bg-slate-950/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Precision Intelligence</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Advanced aerial insights powered by proprietary computer vision models designed for large-scale agriculture.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Cpu,
                  title: "AI Crop Intelligence",
                  desc: "Identify pests, diseases, and nutrient deficiencies with neural-based image analysis."
                },
                {
                  icon: Target,
                  title: "Autonomous Missions",
                  desc: "Precision flight planning with sub-centimeter accuracy for consistent field coverage."
                },
                {
                  icon: Droplets,
                  title: "Smart Spray automation",
                  desc: "Dynamic application rates based on real-time crop health data from aerial scans."
                },
                {
                  icon: Map,
                  title: "Heatmap Analytics",
                  desc: "Visualize field health, moisture levels, and growth trends across your entire estate."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300">
                  <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-slate-400">Streamlining aerial data to actionable insights in three simple steps.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                { step: "01", title: "Scan", desc: "Deploy drones to scan fields autonomously using our mission planner." },
                { step: "02", title: "Analyze", desc: "Our AI systems process aerial imagery to detect anomalies and health metrics." },
                { step: "03", title: "Deploy", desc: "Automated spray missions or ground teams execute targeted interventions." }
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="text-6xl font-black text-emerald-500/10 mb-[-1.5rem] select-none">{item.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Metrics Section */}
        <section className="py-24 bg-emerald-500/5">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
              {[
                { label: "Spray Efficiency", value: "95%" },
                { label: "Chemical Waste Reduction", value: "40%" },
                { label: "Faster Detection", value: "3x" }
              ].map((metric, i) => (
                <div key={i} className="text-center p-8 border-x border-slate-800 last:border-r-0 first:border-l-0">
                  <div className="text-5xl lg:text-6xl font-bold text-emerald-500 mb-4">{metric.value}</div>
                  <div className="text-slate-400 uppercase tracking-widest text-sm font-semibold">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Final CTA */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 max-w-2xl mx-auto">
              Ready to revolutionize your farm intelligence?
            </h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all duration-200 shadow-xl shadow-emerald-500/20"
            >
              Start Your Mission
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-900 bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950">A</div>
            <span className="text-xl font-bold text-white tracking-tighter">AgroSentry</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 AgroSentry. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
