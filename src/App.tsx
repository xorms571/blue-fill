import './App.css'

function App() {
  return (
    <main className="min-h-screen bg-background-main text-base-100 font-sans p-10 space-y-20 pb-40">
      {/* Header */}
      <header className="border-b border-base-800 pb-10">
        <h1 className="text-display-2 font-bold text-primary">Blue-Pill Foundation Guide</h1>
        <p className="text-header-4 text-base-400 mt-2 font-regular italic">Verified via Tailwind Keywords</p>
      </header>

      {/* 1. Typography: Font Sizes & Line Heights */}
      <section className="space-y-8">
        <h2 className="text-header-1 font-bold text-accents-purple border-l-8 border-accents-purple pl-4 uppercase tracking-tighter">1. Font Sizes</h2>
        <div className="space-y-10">
          <div className="border-b border-base-900 pb-4"><p className="text-display-1 leading-none">Display-1 (96px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-display-2 leading-none">Display-2 (68px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-header-1">Header-1 (40px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-header-2">Header-2 (32px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-header-3">Header-3 (24px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-header-4">Header-4 (22px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-body-1">Body-1 (18px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-body-2">Body-2 (16px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-body-3 text-base-400">Body-3 (14px)</p></div>
          <div className="border-b border-base-900 pb-4"><p className="text-body-4 text-base-500 italic">Body-4 (12px)</p></div>
        </div>
      </section>

      {/* 2. Font Weights */}
      <section className="space-y-8">
        <h2 className="text-header-1 font-bold text-accents-blue border-l-8 border-accents-blue pl-4 uppercase tracking-tighter">2. Font Weights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-6 bg-base-900 rounded-xl border border-base-800"><p className="text-header-2 font-regular italic">Regular</p><span className="text-body-4 text-base-500">400</span></div>
          <div className="p-6 bg-base-900 rounded-xl border border-base-800"><p className="text-header-2 font-medium">Medium</p><span className="text-body-4 text-base-500">500</span></div>
          <div className="p-6 bg-base-900 rounded-xl border border-base-800"><p className="text-header-2 font-semibold">Semibold</p><span className="text-body-4 text-base-500">600</span></div>
          <div className="p-6 bg-base-900 rounded-xl border border-base-800"><p className="text-header-2 font-bold text-primary">Bold</p><span className="text-body-4 text-base-500">700</span></div>
        </div>
      </section>

      {/* 3. Color Palette: All Tokens */}
      <section className="space-y-12">
        <h2 className="text-header-1 font-bold text-accents-neon border-l-8 border-accents-neon pl-4 uppercase tracking-tighter">3. Color Tokens</h2>

        {/* Primary & Background */}
        <div className="space-y-4">
          <h3 className="text-header-4 font-bold text-base-300">Brand & Background</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2"><div className="h-16 bg-primary rounded-lg shadow-lg"></div><p className="text-body-4 text-center">primary</p></div>
            <div className="space-y-2"><div className="h-16 bg-primary-hovered rounded-lg"></div><p className="text-body-4 text-center">primary-hovered</p></div>
            <div className="space-y-2"><div className="h-16 bg-background-main border border-base-700 rounded-lg"></div><p className="text-body-4 text-center">bg-main</p></div>
            <div className="space-y-2"><div className="h-16 bg-background-hovered border border-base-700 rounded-lg"></div><p className="text-body-4 text-center">bg-hovered</p></div>
          </div>
        </div>

        {/* Base Gray Scale (50-950) */}
        <div className="space-y-4">
          <h3 className="text-header-4 font-bold text-base-300">Base Neutral (All Levels)</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-50 border border-white/5"></div><p className="text-[10px] text-center font-bold">50</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-100 border border-white/5"></div><p className="text-[10px] text-center font-bold">100</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-200 border border-white/5"></div><p className="text-[10px] text-center font-bold">200</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-300 border border-white/5"></div><p className="text-[10px] text-center font-bold">300</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-400 border border-white/5"></div><p className="text-[10px] text-center font-bold">400</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-500 border border-white/5"></div><p className="text-[10px] text-center font-bold">500</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-600 border border-white/5"></div><p className="text-[10px] text-center font-bold">600</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-700 border border-white/5"></div><p className="text-[10px] text-center font-bold">700</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-800 border border-white/5"></div><p className="text-[10px] text-center font-bold">800</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-900 border border-white/5"></div><p className="text-[10px] text-center font-bold">900</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-base-950 border border-white/5"></div><p className="text-[10px] text-center font-bold">950</p></div>
          </div>
        </div>

        {/* Secondary Scale (100-800) */}
        <div className="space-y-4">
          <h3 className="text-header-4 font-bold text-base-300">Secondary Scale</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-100"></div><p className="text-[10px] text-center font-bold">100</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-200"></div><p className="text-[10px] text-center font-bold">200</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-300"></div><p className="text-[10px] text-center font-bold">300</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-400"></div><p className="text-[10px] text-center font-bold">400</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-500"></div><p className="text-[10px] text-center font-bold">500</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-600"></div><p className="text-[10px] text-center font-bold">600</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-700"></div><p className="text-[10px] text-center font-bold">700</p></div>
            <div className="flex-1 min-w-[60px] space-y-1"><div className="h-12 rounded bg-secondary-800"></div><p className="text-[10px] text-center font-bold">800</p></div>
          </div>
        </div>

        {/* Accents & System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-header-4 font-bold text-base-300">Accents</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-12 bg-accents-neon rounded flex items-center justify-center text-black font-bold text-[10px]">Neon</div>
              <div className="h-12 bg-accents-orange rounded flex items-center justify-center text-white font-bold text-[10px]">Orange</div>
              <div className="h-12 bg-accents-pink rounded flex items-center justify-center text-white font-bold text-[10px]">Pink</div>
              <div className="h-12 bg-accents-purple rounded flex items-center justify-center text-white font-bold text-[10px]">Purple</div>
              <div className="h-12 bg-accents-yellow rounded flex items-center justify-center text-black font-bold text-[10px]">Yellow</div>
              <div className="h-12 bg-accents-blue rounded flex items-center justify-center text-white font-bold text-[10px]">Blue</div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-header-4 font-bold text-base-300">System Feedback</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-system-success rounded flex items-center justify-center text-black font-bold text-[10px]">Success</div>
                <div className="flex-1 h-10 bg-system-success-hovered rounded flex items-center justify-center text-black font-bold text-[10px]">Hover</div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-system-alert rounded flex items-center justify-center text-black font-bold text-[10px]">Alert</div>
                <div className="flex-1 h-10 bg-system-alert-hovered rounded flex items-center justify-center text-black font-bold text-[10px]">Hover</div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-system-error rounded flex items-center justify-center text-white font-bold text-[10px]">Error</div>
                <div className="flex-1 h-10 bg-system-error-hovered rounded flex items-center justify-center text-white font-bold text-[10px]">Hover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Components */}
      <section className="space-y-8">
        <h2 className="text-header-1 font-bold text-accents-pink border-l-8 border-accents-pink pl-4 uppercase tracking-tighter">4. Interactive Preview</h2>
        <div className="flex flex-wrap gap-4 p-10 bg-base-950 rounded-3xl border border-base-800 shadow-inner">
          <button className="px-10 py-4 bg-primary hover:bg-primary-hovered text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(98,246,181,0.2)]">
            Primary Action
          </button>
          <button className="px-10 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/10 transition-colors">
            Secondary Outline
          </button>
          <div className="px-6 py-4 bg-background-hovered border border-base-700 rounded-2xl flex items-center gap-4">
            <div className="w-3 h-3 bg-accents-neon rounded-full animate-pulse"></div>
            <span className="text-body-2 font-medium">System Live Status</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
