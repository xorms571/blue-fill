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

  return (
    <PageLayout containerClassName="mx-auto flex justify-between py-12 px-6">
      {/* Left Content Area */}
      <div className="flex-1 max-w-2xl">
        <header className="mb-8 space-y-2">
          <span className="text-[10px] text-base-500 font-bold uppercase tracking-widest">캐릭터 생성</span>
          <h1 className="text-display-2 font-bold text-base-50">캐릭터 생성</h1>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-base-900 mb-12">
          {['setting', 'prompt', 'example'].map((step, idx) => (
            <button
              key={step}
              className={cn("pb-4 text-body-2 font-bold transition-colors relative", currentStep === step ? "text-base-50" : "text-base-600")}
              onClick={() => setCurrentStep(step as Step)}
            >
              {['캐릭터 기본 설정', '캐릭터 프롬프트', '대화체 설정'][idx]}
              {currentStep === step && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
            </button>
          ))}
        </div>

        {/* Step: Setting */}
        {currentStep === 'setting' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <p className="text-body-3 text-base-400 mb-8">캐릭터가 어떻게 보일지 결정하는 단계입니다. 자유롭게 표현해 주세요!</p>

              <div className="space-y-4">
                <label className="text-body-2 font-bold text-base-50">캐릭터 이미지</label>
                <p className="text-body-4 text-base-500">이미지를 등록하세요. 부적절한 이미지는 제한될 수 있어요.</p>
                <div className="flex items-center gap-6">
                  <div
                    className="w-32 h-32 bg-[#E5E5E5] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden border border-primary/30"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  <div className="space-y-3">
                    <Button variant="Outline" size="s" onClick={() => fileInputRef.current?.click()} className="rounded-full px-6 font-normal text-xs text-base-400 border-base-700">이미지 업로드하기</Button>
                    <p className="text-[11px] text-base-600 max-w-[280px]">PNG, JPG, WebP 형식의 이미지 파일만 업로드할 수 있어요. 1:1 비율의 이미지를 권장해요.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-8 border-t border-base-900">
              <div className="space-y-3">
                <label className="text-body-2 font-bold text-base-50">캐릭터 이름</label>
                <p className="text-body-4 text-base-500">2~30자 이내로 입력해 주세요 (특수문자, 이모지 제외)</p>
                <div className="relative">
                  <input
                    name="name" value={formData.name} onChange={handleChange} maxLength={30}
                    placeholder="캐릭터가 불리게 될 이름입니다."
                    className="w-full bg-base-950 border border-base-800 rounded-lg px-4 py-3 text-sm text-base-50 focus:border-primary outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-base-600">{formData.name.length}/30</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-body-2 font-bold text-base-50">한 줄 소개</label>
                <p className="text-body-4 text-base-500">30자 이내로 입력해 주세요</p>
                <div className="relative">
                  <input
                    name="description" value={formData.description} onChange={handleChange} maxLength={30}
                    placeholder="어떤 캐릭터인지 설명할 수 있는 간단한 소개를 입력해주세요."
                    className="w-full bg-base-950 border border-base-800 rounded-lg px-4 py-3 text-sm text-base-50 focus:border-primary outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-base-600">{formData.description.length}/30</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <Button variant="solid" onClick={() => setCurrentStep('prompt')} className="px-12 rounded-full font-bold">다음 ›</Button>
            </div>
          </div>
        )}

        {currentStep === 'prompt' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <label className="text-body-2 font-bold text-base-50">캐릭터 프롬프트</label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                className="w-full h-64 bg-base-950 border border-base-800 rounded-lg px-4 py-3 text-sm text-base-50 focus:border-primary outline-none transition-colors"
                placeholder="캐릭터의 성격, 말투, 배경 등을 자세히 입력해주세요."
              />
            </div>
            <div className="flex justify-between pt-8">
              <Button variant="Outline" onClick={() => setCurrentStep('setting')} className="px-12 rounded-full font-bold">‹ 이전</Button>
              <Button variant="solid" onClick={() => setCurrentStep('example')} className="px-12 rounded-full font-bold">다음 ›</Button>
            </div>
          </div>
        )}

        {/* Step: Example */}
        {currentStep === 'example' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <label className="text-body-2 font-bold text-base-50">대화체 설정</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={exampleInput}
                  onChange={(e) => setExampleInput(e.target.value)}
                  className="flex-1 bg-base-950 border border-base-800 rounded-lg px-4 py-3 text-sm text-base-50 focus:border-primary outline-none"
                  placeholder="예시 대화를 입력하세요."
                />
                <Button variant="solid" onClick={handleAddExample}>추가</Button>
              </div>
              <ul className="space-y-2 mt-4">
                {formData.exampleDialogues.map((dialogue, index) => (
                  <li key={index} className="bg-base-900 p-3 rounded-lg text-sm text-base-300">{dialogue}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between pt-8">
              <Button variant="Outline" onClick={() => setCurrentStep('prompt')} className="px-12 rounded-full font-bold">‹ 이전</Button>
              <Button variant="solid" onClick={handleSubmit} className="px-12 rounded-full font-bold" disabled={loading}>
                {loading ? '생성 중...' : '생성하기'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Preview Area */}
      <div className="hidden lg:block w-[360px] shrink-0 pt-24">
        <div className="sticky top-24 space-y-6">
          <h3 className="text-header-3 font-bold text-base-50">캐릭터 미리보기</h3>
          <p className="text-body-4 text-base-400">아래에 생성된 캐릭터를 미리 확인해 보세요!</p>
          <div className="bg-base-950 border border-base-800 rounded-3xl p-6 shadow-2xl">
            <div className="aspect-square w-full rounded-2xl bg-base-900 mb-6 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base-700">No Image</div>
              )}
            </div>
            <h4 className="text-[20px] font-bold text-base-50 mb-2">{formData.name || '캐릭터 이름'}</h4>
            <p className="text-[14px] text-base-400 leading-relaxed">{formData.description || '소개글이 여기에 표시됩니다.'}</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CharacterCreationPage;
