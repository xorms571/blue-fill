import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/common/Button';
import { createCharacterCard } from '../../lib/characterApi';
import { cn } from '../../lib/utils';

type Step = 'setting' | 'prompt' | 'example';

const CharacterCreationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('setting');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    prompt: '',
    exampleDialogues: [] as string[],
    isPublic: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [exampleInput, setExampleInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // 실제로는 여기서 S3 등 업로드 후 URL을 받아와야 함
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExample = () => {
    if (exampleInput.trim() && formData.exampleDialogues.length < 5) {
      setFormData(prev => ({
        ...prev,
        exampleDialogues: [...prev.exampleDialogues, exampleInput.trim()]
      }));
      setExampleInput('');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.prompt) {
       alert("필수 항목을 모두 입력해주세요.");
       return;
    }

    setLoading(true);
    try {
      // 서버 제약 우회 로직 (이미지가 data:image 로 시작하면 다이스베어 더미 사용)
      let finalImageUrl = formData.imageUrl;
      if (!finalImageUrl || finalImageUrl.startsWith('data:image')) {
          finalImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name + Date.now()}`;
      }

      await createCharacterCard({
         ...formData,
         imageUrl: finalImageUrl
      });
      alert('캐릭터 카드가 생성되었습니다!');
      navigate('/library');
    } catch (err: any) {
      alert(`생성 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex gap-8 border-b border-base-900 mb-12">
      <button 
        className={cn("pb-4 text-body-2 font-bold transition-colors relative", currentStep === 'setting' ? "text-base-50" : "text-base-600")}
        onClick={() => setCurrentStep('setting')}
      >
        Character Setting
        {currentStep === 'setting' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-base-50"></div>}
      </button>
      <button 
        className={cn("pb-4 text-body-2 font-bold transition-colors relative", currentStep === 'prompt' ? "text-base-50" : "text-base-600")}
        onClick={() => setCurrentStep('prompt')}
      >
        Character Prompt
        {currentStep === 'prompt' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-base-50"></div>}
      </button>
      <button 
        className={cn("pb-4 text-body-2 font-bold transition-colors relative", currentStep === 'example' ? "text-base-50" : "text-base-600")}
        onClick={() => setCurrentStep('example')}
      >
        Example Post
        {currentStep === 'example' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-base-50"></div>}
      </button>
    </div>
  );

  return (
    <PageLayout containerClassName="max-w-5xl mx-auto flex gap-12">
      {/* Left Content Area */}
      <div className="flex-1 max-w-2xl">
        <header className="mb-8 space-y-2">
          <span className="text-[10px] text-base-500 font-bold uppercase tracking-widest">CREATE</span>
          <h1 className="text-display-2 font-bold text-base-50">Create Character</h1>
        </header>

        {renderTabs()}

        {currentStep === 'setting' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-header-3 font-bold text-base-50 mb-2">Character Setting</h2>
              <p className="text-body-3 text-base-500 mb-8">Decide the appearance of your character. Feel free to express your imagination.</p>
              
              <div className="space-y-4">
                <label className="text-body-2 font-bold text-base-50">Character Image</label>
                <p className="text-body-4 text-base-500">Upload an image. Inappropriate images may be restricted.</p>
                <div className="flex items-center gap-6">
                  <div 
                    className="w-36 h-36 bg-[#E5E5E5] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                       <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button variant="Outline" size="s" className="rounded-full px-4 font-normal text-xs text-base-400 border-base-700">Create image</Button>
                      <Button variant="Outline" size="s" onClick={() => fileInputRef.current?.click()} className="rounded-full px-4 font-normal text-xs text-base-400 border-base-700">Upload image</Button>
                    </div>
                    <p className="text-[11px] text-base-600">Only upload PNG, JPG, and WebP image files. 1:1 aspect ratio are recommended.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-8 border-t border-base-900">
              <div className="space-y-3">
                <label className="text-body-2 font-bold text-base-50">Character Name</label>
                <p className="text-body-4 text-base-500">Please enter within 2-30 characters.</p>
                <div className="relative">
                   <input 
                     name="name" value={formData.name} onChange={handleChange} maxLength={30}
                     placeholder="This is how your character will be called."
                     className="w-full bg-transparent border border-base-800 rounded-lg px-4 py-3 text-sm text-base-50 focus:border-base-500 outline-none transition-colors"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-base-600">{formData.name.length}/30</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-body-2 font-bold text-base-50">Character Description</label>
                <p className="text-body-4 text-base-500">Please enter within 30 characters.</p>
                <div className="relative">
                   <input 
                     name="description" value={formData.description} onChange={handleChange} maxLength={30}
                     placeholder="Enter a brief description to introduce the character."
                     className="w-full bg-transparent border border-base-800 rounded-lg px-4 py-3 text-sm text-base-50 focus:border-base-500 outline-none transition-colors"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-base-600">{formData.description.length}/30</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button variant="solid" onClick={() => setCurrentStep('prompt')} className="px-10 rounded-full font-bold">Next <span className="ml-1">›</span></Button>
            </div>
          </div>
        )}

        {currentStep === 'prompt' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-header-3 font-bold text-base-50 mb-2">Character Prompt</h2>
              <p className="text-body-3 text-base-500 mb-8">Decide the appearance of your character. Feel free to express your imagination.</p>

              <div className="space-y-3">
                <label className="text-body-2 font-bold text-base-50">Character's personality</label>
                <p className="text-body-4 text-base-500">Please describe the character's personality, speech style, and appearance to be reflected in the dialogue.</p>
                <div className="relative">
                  <textarea 
                    name="prompt" value={formData.prompt} onChange={handleChange} maxLength={2000} rows={15}
                    placeholder="- **캐릭터 개요**\n  - 이름:\n  - 나이:\n..."
                    className="w-full bg-transparent border border-base-800 rounded-xl p-4 text-sm text-base-50 focus:border-base-500 outline-none transition-colors resize-none font-mono"
                  />
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                     <span className="text-[10px] text-base-600">{formData.prompt.length}/2000</span>
                     <button className="px-3 py-1.5 rounded border border-[#134e4a] text-primary text-[11px] font-bold bg-[#042f2e]/50 hover:bg-[#042f2e] transition-colors">자동 완성</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="Outline" onClick={() => setCurrentStep('setting')} className="px-8 rounded-full border-base-800 text-base-300 hover:text-base-50 hover:bg-base-900"><span className="mr-1">‹</span> Before</Button>
              <Button variant="solid" onClick={() => setCurrentStep('example')} className="px-10 rounded-full font-bold">Next <span className="ml-1">›</span></Button>
            </div>
          </div>
        )}

        {currentStep === 'example' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-header-3 font-bold text-base-50 mb-2">Example Post</h2>
              <p className="text-body-3 text-base-500 mb-8">Decide on a post you'd like to share on your feed.</p>

              <div className="space-y-6">
                {formData.exampleDialogues.map((dialogue, idx) => (
                  <div key={idx} className="space-y-3">
                    <label className="text-body-2 font-bold text-base-50">Post describing</label>
                    <p className="text-body-4 text-base-500">Write a post describing what kind of content you'd like to share through your character.</p>
                    <div className="relative">
                      <textarea 
                        readOnly value={dialogue} rows={4}
                        className="w-full bg-transparent border border-base-800 rounded-xl p-4 text-sm text-base-50 focus:border-base-500 outline-none transition-colors resize-none"
                      />
                      <span className="absolute bottom-4 right-4 text-[10px] text-base-600">{dialogue.length}/1000</span>
                    </div>
                  </div>
                ))}

                {formData.exampleDialogues.length < 5 && (
                  <div className="space-y-3">
                    <label className="text-body-2 font-bold text-base-50">Post describing</label>
                    <p className="text-body-4 text-base-500">Write a post describing what kind of content you'd like to share through your character.</p>
                    <div className="relative">
                      <textarea 
                        value={exampleInput} onChange={(e) => setExampleInput(e.target.value)} maxLength={1000} rows={4}
                        placeholder="Enter example dialogue here..."
                        className="w-full bg-transparent border border-base-800 rounded-xl p-4 text-sm text-base-50 focus:border-base-500 outline-none transition-colors resize-none"
                      />
                      <span className="absolute bottom-4 right-4 text-[10px] text-base-600">{exampleInput.length}/1000</span>
                    </div>
                    <button onClick={handleAddExample} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#134e4a] text-primary text-[11px] font-bold bg-transparent hover:bg-[#042f2e]/50 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-3 bg-base-900/50 rounded-lg text-base-500 text-[11px]">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                   Violence, hate, or sexual content may result in permanent restrictions.
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="Outline" onClick={() => setCurrentStep('prompt')} className="px-8 rounded-full border-base-800 text-base-300 hover:text-base-50 hover:bg-base-900"><span className="mr-1">‹</span> Before</Button>
              <Button variant="solid" onClick={handleSubmit} loading={loading} className="px-10 rounded-full font-bold">Complete <span className="ml-1">✓</span></Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Preview Area */}
      <div className="hidden lg:block w-[360px] shrink-0 pt-16">
         <div className="sticky top-24 space-y-6">
            <h3 className="text-header-4 font-bold text-base-50">Preview</h3>
            <div className="bg-base-950 border border-base-900 rounded-3xl p-6 shadow-2xl">
               <div className="aspect-square w-full rounded-2xl bg-base-900 mb-6 overflow-hidden">
                 {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-700">No Image</div>
                 )}
               </div>
               <h4 className="text-[20px] font-bold text-base-50 mb-4">{formData.name || 'Character Name'}</h4>
               <div className="border-t border-base-800 pt-4 space-y-2">
                 <span className="text-[12px] font-bold text-base-400">Description</span>
                 <p className="text-[13px] text-base-300 leading-relaxed min-h-[40px]">{formData.description || 'Brief description will appear here.'}</p>
               </div>
            </div>
         </div>
      </div>
    </PageLayout>
  );
};

export default CharacterCreationPage;
