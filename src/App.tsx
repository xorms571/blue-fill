import Button from './components/common/Button';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_494_966)">
      <path d="M8 4.76953V11.2311" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M4.76929 8H11.2308" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11.7692 1H4.23077C2.44647 1 1 2.44647 1 4.23077V11.7692C1 13.5536 2.44647 15 4.23077 15H11.7692C13.5536 15 15 13.5536 15 11.7692V4.23077C15 2.44647 13.5536 1 11.7692 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_494_966">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const VARIANTS = ['solid', 'Graysolid', 'Outline', 'Darksolid', 'Darkoutline', 'Rectangleoutline'] as const;
const SIZES = ['l', 'm', 's', 'xs'] as const;

const ColorSwatch = ({ name, token, hex, textColor = "text-base-50", border = false }: { name: string, token: string, hex: string, textColor?: string, border?: boolean }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${token} ${textColor} ${border ? 'border border-base-800' : ''}`}>
    <div className="flex flex-col">
      <span className="text-caption-1 font-bold uppercase tracking-tighter">{name}</span>
      <span className="text-[10px] opacity-70">{token.replace('bg-', '')}</span>
    </div>
    <span className="text-[10px] font-mono font-medium">{hex}</span>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-background-main text-base-50 p-10 font-sans">
      <header className="mb-12 border-b border-base-800 pb-6">
        <h1 className="text-header-1 font-bold text-primary mb-2">Design System Showcase</h1>
        <p className="text-body-1 text-base-400">Common Component: Button (State & Size Matrix) & Typography</p>
        <div className="mt-4 gap-6 text-caption-1 text-base-500 bg-base-950 p-3 rounded-lg border border-base-900 inline-flex">
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div> Default: Interactive (Hover/Pressed)</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-base-600 rounded-full"></div> Disabled: primary, secondary</span>
        </div>
      </header>

      <div className="flex flex-col gap-24">
        {/* Typography Section */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-header-3 font-bold text-primary uppercase tracking-widest">Typography</h2>
            <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-base-950/30 p-8 rounded-2xl border border-base-900/50">
            <div className="space-y-8">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Display & Header</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Display-1 (96px / 128px)</span>
                  <p className="text-display-1">Display 1</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Display-2 (68px / 98px)</span>
                  <p className="text-display-2">Display 2</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Header-1 (40px / 62px)</span>
                  <p className="text-header-1">Header 1</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Header-2 (32px / 42px)</span>
                  <p className="text-header-2">Header 2</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Header-3 (24px / 36px)</span>
                  <p className="text-header-3">Header 3</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Header-4 (22px / 34px)</span>
                  <p className="text-header-4">Header 4</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Body</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Body-1 (18px / 28px)</span>
                  <p className="text-body-1">The quick brown fox jumps over the lazy dog. 0123456789</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Body-2 (16px / 20px)</span>
                  <p className="text-body-2">The quick brown fox jumps over the lazy dog. 0123456789</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Body-3 (14px / 20px)</span>
                  <p className="text-body-3">The quick brown fox jumps over the lazy dog. 0123456789</p>
                </div>
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Body-4 (12px / 18px)</span>
                  <p className="text-body-4">The quick brown fox jumps over the lazy dog. 0123456789</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Font Weight</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-base-600 text-[10px] w-20 uppercase font-bold tracking-widest">Regular</span>
                  <p className="font-regular text-header-3">Regular (400)</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base-600 text-[10px] w-20 uppercase font-bold tracking-widest">Medium</span>
                  <p className="font-medium text-header-3">Medium (500)</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base-600 text-[10px] w-20 uppercase font-bold tracking-widest">Semibold</span>
                  <p className="font-semibold text-header-3">Semibold (600)</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base-600 text-[10px] w-20 uppercase font-bold tracking-widest">Bold</span>
                  <p className="font-bold text-header-3">Bold (700)</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 md:col-span-2">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Color Palette</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Brand & Background */}
                <div className="space-y-4">
                  <h4 className="text-caption-1 text-base-500 uppercase font-bold tracking-widest mb-4">Brand & Background</h4>
                  <div className="flex flex-col gap-2">
                    <ColorSwatch name="Primary" token="bg-primary" hex="#62F6B5" textColor="text-background-main" />
                    <ColorSwatch name="Primary Hover" token="bg-primary-hovered" hex="#82F8C4" textColor="text-background-main" />
                    <ColorSwatch name="Background Main" token="bg-background-main" hex="#0E0E13" border />
                    <ColorSwatch name="Background Hover" token="bg-background-hovered" hex="#18181B" border />
                  </div>
                </div>

                {/* System Colors */}
                <div className="space-y-4">
                  <h4 className="text-caption-1 text-base-500 uppercase font-bold tracking-widest mb-4">System States</h4>
                  <div className="flex flex-col gap-2">
                    <ColorSwatch name="Success" token="bg-system-success" hex="#7ED6F8" textColor="text-background-main" />
                    <ColorSwatch name="Alert" token="bg-system-alert" hex="#FFE858" textColor="text-background-main" />
                    <ColorSwatch name="Error" token="bg-system-error" hex="#F8834F" textColor="text-background-main" />
                  </div>
                </div>

                {/* Accents */}
                <div className="space-y-4">
                  <h4 className="text-caption-1 text-base-500 uppercase font-bold tracking-widest mb-4">Accents</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-10 h-10 rounded bg-accents-neon" title="Neon"></div>
                    <div className="w-10 h-10 rounded bg-accents-orange" title="Orange"></div>
                    <div className="w-10 h-10 rounded bg-accents-pink" title="Pink"></div>
                    <div className="w-10 h-10 rounded bg-accents-purple" title="Purple"></div>
                    <div className="w-10 h-10 rounded bg-accents-yellow" title="Yellow"></div>
                    <div className="w-10 h-10 rounded bg-accents-blue" title="Blue"></div>
                  </div>
                </div>

                {/* Base Scale */}
                <div className="space-y-4 md:col-span-2 lg:col-span-3">
                  <h4 className="text-caption-1 text-base-500 uppercase font-bold tracking-widest mb-4">Base Scale (Grayscale)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(level => (
                      <div key={level} className="flex flex-col gap-1">
                        <div className={`h-12 rounded bg-base-${level} border border-white/5`}></div>
                        <span className="text-[10px] text-base-500 font-bold">Base-{level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Matrix Section */}
        {VARIANTS.map((variant) => (
          <section key={variant} className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-header-3 font-bold text-primary uppercase tracking-widest">{variant}</h2>
              <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
              {SIZES.map((size) => (
                <div key={`${variant}-${size}`} className="space-y-6 p-6 rounded-2xl bg-base-950/50 border border-base-900/50">
                  <h3 className="text-caption-1 text-base-400 font-bold border-b border-base-900 pb-2 flex justify-between uppercase">
                    <span>Size: {size.toUpperCase()}</span>
                    <span className="text-base-600">H: {size === 'l' ? '48' : size === 'm' ? '40' : size === 's' ? '36' : '28'}px</span>
                  </h3>

                  <div className="flex flex-col gap-8 items-start">
                    {/* Default State */}
                    <div className="space-y-2 w-full">
                      <span className="text-[10px] text-base-600 uppercase font-bold tracking-tighter">Default / Hover / Pressed</span>
                      <div className="flex items-center gap-4">
                        <Button variant={variant} size={size}>
                          {variant}
                        </Button>
                      </div>
                    </div>

                    {/* Disabled State */}
                    <div className="space-y-2 w-full">
                      <span className="text-[10px] text-base-600 uppercase font-bold tracking-tighter">Disabled</span>
                      <div className="flex items-center gap-4">
                        <Button variant={variant} size={size} disabled>
                          Disabled
                        </Button>
                      </div>
                    </div>

                    {/* Icon Version */}
                    <div className="space-y-2 w-full">
                      <span className="text-[10px] text-base-600 uppercase font-bold tracking-tighter">With Icon</span>
                      <div className="flex items-center gap-4">
                        <Button variant={variant} size={size} leftIcon={<PlusIcon />}>
                          {size.toUpperCase()} Action
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Interaction Playground */}
        <section className="mt-12 p-10 bg-linear-to-br from-base-900 to-background-main rounded-3xl border border-primary/20">
          <h2 className="text-header-2 font-bold text-primary mb-8">Interaction Playground</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-header-4 text-base-200">Loading State Transitions</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="solid" size='l' loading>Processing...</Button>
                <Button variant="solid" size='m' loading>Processing...</Button>
                <Button variant="solid" size='s' loading>Processing...</Button>
                <Button variant="Rectangleoutline" size='xs' loading></Button>
                <Button variant="Outline" size='l' loading>Processing...</Button>
                <Button variant="Outline" size='m' loading>Processing...</Button>
                <Button variant="Outline" size='s' loading>Processing...</Button>
                <Button variant="Outline" size='xs' loading>Wait</Button>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-header-4 text-base-200">Layout Integration</h3>
              <div className="space-y-4">
                <Button fullWidth variant="solid" size="l" rightIcon={<PlusIcon />}>Confirm Order</Button>
                <div className="flex gap-4">
                  <Button fullWidth variant="Darkoutline" size="m">Dismiss</Button>
                  <Button fullWidth variant="Rectangleoutline" size="m">Settings</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-32 pt-12 border-t border-base-900 text-center">
        <p className="text-base-600 text-caption-1 uppercase tracking-[0.2em]">Cyberpunk Design System Framework | Component: Button v2.5.0</p>
        <p className="text-base-800 text-[10px] mt-2">© 2024 BLUE PILL PROJECT. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;
