import Button from './components/common/Button';
import CharacterProfileItem from './components/common/CharacterProfileItem';
import Chip from './components/common/Chip';
import InstagramPostCard from './components/common/InstagramPostCard';

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

const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_778_4480)">
      <g clip-path="url(#clip1_778_4480)">
        <path d="M2.37872 7.10151C2.92515 6.37003 3.79782 5.89648 4.78109 5.89648C5.48105 5.89648 6.12496 6.13646 6.63504 6.53864" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.35295 9.10705H1.35621C1.12913 9.10705 0.911346 9.0168 0.750779 8.85626C0.590208 8.69572 0.5 8.47792 0.5 8.25084V1.40114C0.5 1.17405 0.590208 0.956276 0.750779 0.795701C0.911346 0.63513 1.12913 0.544922 1.35621 0.544922H8.20591C8.433 0.544922 8.65076 0.63513 8.81138 0.795701C8.97192 0.956276 9.06217 1.17405 9.06217 1.40114V3.96978" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M4.78105 4.61161C5.49037 4.61161 6.06537 4.03659 6.06537 3.32729C6.06537 2.61798 5.49037 2.04297 4.78105 2.04297C4.07175 2.04297 3.49673 2.61798 3.49673 3.32729C3.49673 4.03659 4.07175 4.61161 4.78105 4.61161Z" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6.29072 9.05058C5.99025 8.99826 5.99025 8.56693 6.29072 8.51466C7.37928 8.32528 8.24507 7.49615 8.48134 6.41681L8.49945 6.33407C8.56446 6.03711 8.98732 6.03526 9.05488 6.33164L9.07688 6.42806C9.32193 7.50231 10.1879 8.32443 11.2735 8.51329C11.5755 8.56583 11.5755 8.99938 11.2735 9.05195C10.1879 9.24074 9.32193 10.0629 9.07688 11.1372L9.05488 11.2336C8.98732 11.5299 8.56446 11.5281 8.49945 11.2311L8.48134 11.1484C8.24507 10.069 7.37928 9.23989 6.29072 9.05058Z" stroke="#62F6B5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_778_4480">
        <rect width="12" height="12" fill="white" />
      </clipPath>
      <clipPath id="clip1_778_4480">
        <rect width="12" height="12" fill="white" />
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
    <div className="min-h-screen bg-background-main text-base-50 p-4 md:p-10 font-sans">
      <header className="mb-12 border-b border-base-800 pb-6">
        <h1 className="text-header-1 font-bold text-primary mb-2">Design System Showcase</h1>
        <p className="text-body-1 text-base-400">Common Component: Button (State & Size Matrix) & Typography</p>
        <div className="mt-4 gap-6 text-caption-1 text-base-500 bg-base-950 p-3 rounded-lg border border-base-900 inline-flex">
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-primary rounded-full"></div> Default: Interactive (Hover/Pressed)</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-base-600 rounded-full"></div> Disabled: primary, secondary</span>
        </div>
      </header>

      <div className="flex flex-col gap-24">
        {/* Components Showcase Section */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-header-3 font-bold text-primary uppercase tracking-widest">Components</h2>
            <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-base-700/30 p-4 md:p-8 rounded-2xl border border-base-900/50">
            {/* Chips */}
            <div className="space-y-8">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Chips</h3>
              <div className="flex flex-wrap gap-6">
                <div className="space-y-3">
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Variant: Gray / Size: M & S</span>
                  <div className="flex items-center gap-3">
                    <Chip variant="gray" size="s">Text</Chip>
                    <Chip variant="gray" size="m">Text</Chip>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Chip variant="gray" size="s" icon={<UserIcon />}>Text</Chip>
                    <Chip variant="gray" size="m" icon={<UserIcon />}>Text</Chip>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-1">Variant: Black / Size: M & S</span>
                  <div className="flex items-center gap-3">
                    <Chip variant="black" size="s">Text</Chip>
                    <Chip variant="black" size="m">Text</Chip>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Chip variant="black" size="s" icon={<UserIcon />}>Text</Chip>
                    <Chip variant="black" size="m" icon={<UserIcon />}>Text</Chip>
                  </div>
                </div>
              </div>
            </div>

            {/* Character Profile Item */}
            <div className="space-y-8">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Character Profile</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-base-600 text-[10px] uppercase font-bold tracking-widest block mb-4">Profile List Item</span>
                  <div className="flex flex-col gap-4 max-w-sm">
                    <CharacterProfileItem
                      imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      instagramId="@cyber_ninja"
                      characterName="Aiden Pierce"
                      tags={['Creator', '#A1B2']}
                    />
                    <div className="h-px bg-base-800"></div>
                    <CharacterProfileItem
                      imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia"
                      instagramId="@neon_dreamer"
                      characterName="Sarah Connor"
                      tags={['Player', '#C3D4']}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Post Card */}
            <div className="space-y-8 lg:col-span-2 pt-8 mt-4">
              <h3 className="text-header-4 text-base-300 border-b border-base-800 pb-2">Instagram Post</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InstagramPostCard
                  user={{
                    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                    instagramId: "@cyber_ninja",
                    characterName: "Aiden Pierce",
                    tags: ["#Code"]
                  }}
                  postImageUrl="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000"
                  date="2025.05.25"
                  caption={"...나쁘지는 않았다.\n...나쁘지는 않았다."}
                />
                <InstagramPostCard
                  user={{
                    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
                    instagramId: "@neon_dreamer",
                    characterName: "Sarah Connor",
                    tags: ["Player", "#C3D4"]
                  }}
                  postImageUrl="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000"
                  date="2025.06.12"
                  caption={"새로운 도시에서의 첫 날. 모든 것이 낯설지만 흥미롭다. 네온 사인이 가득한 거리를 걷다 보니 마치 꿈속을 걷는 기분이다. 이곳에서의 생활이 앞으로 어떻게 펼쳐질지 기대된다. #Cyberpunk #NeonCity #NewBeginning"}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-header-3 font-bold text-primary uppercase tracking-widest">Typography</h2>
            <div className="h-px flex-1 bg-linear-to-r from-base-800 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-base-950/30 p-4 md:p-8 rounded-2xl border border-base-900/50">
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
              <div>
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
              <div>
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
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-50 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-50</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-100 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-100</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-200 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-200</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-300 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-300</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-400 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-400</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-500 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-500</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-600 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-600</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-700 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-700</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-800 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-800</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-900 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-900</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="h-12 rounded bg-base-950 border border-white/5"></div>
                      <span className="text-[10px] text-base-500 font-bold">Base-950</span>
                    </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
              {SIZES.map((size) => (
                <div key={`${variant}-${size}`} className="space-y-6 p-4 md:p-6 rounded-2xl bg-base-950/50 border border-base-900/50">
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
        <section className="mt-12 p-4 md:p-10 bg-linear-to-br from-base-900 to-background-main rounded-3xl border border-primary/20">
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
