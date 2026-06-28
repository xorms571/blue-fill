import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as logRoomApi from '../../lib/logRoomApi';
import PageLayout from '../../components/layout/PageLayout';
import { useR2Upload } from '../../hooks/useR2Upload';

export const LogRoomPage = () => {
    const { publicId } = useParams<{ publicId: string }>();
    const [timelineData, setTimelineData] = useState<logRoomApi.DayLogTimeSlot[]>([]);
    const [chatMessages, setChatMessages] = useState<logRoomApi.ChatMessage[]>([]);
    const [isAiTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [replyPhotoId, setReplyPhotoId] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadToR2 } = useR2Upload();

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isAiTyping]);

    // Fetch data
    useEffect(() => {
        if (!publicId) return;

        const fetchData = async () => {
            try {
                // Fetch timeline (Using today's date for now)
                const today = new Date().toISOString().split('T')[0];
                const timelineResponse = await logRoomApi.getDayLog(publicId, today);
                setTimelineData(timelineResponse.data);

                // Fetch chats
                const chatResponse = await logRoomApi.getChatMessages(publicId);
                setChatMessages(chatResponse.data.messages);
            } catch (e) {
                console.error('Failed to fetch data', e);
            }
        };
        fetchData();
    }, [publicId]);

    // File Upload Handler
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !publicId) return;

        const caption = window.prompt("로그 캡션을 입력하세요 (최대 30자):") || "새로운 로그";

        try {
            // R2로 업로드 후 key 반환
            const imageUrl = await uploadToR2(file, 'LOG');

            // Mock: Create a new log entry (Update to use real API once available)
            const newEntry: logRoomApi.DayLogEntry = {
                photoPublicId: Date.now().toString(),
                memberPublicId: 'me',
                authorName: '나',
                authorImageUrl: '/default-profile.png',
                imageUrl: imageUrl, // 서버에서 조회 가능한 URL 혹은 key
                caption: caption,
                authorType: 'USER'
            };

            const hour = new Date().getHours();
            const timeSlot = Math.floor(hour / 3) * 3;

            // Update state
            setTimelineData(prev => {
                const newData = [...prev];
                const slotIndex = newData.findIndex(s => s.timeSlot === timeSlot);
                if (slotIndex !== -1) {
                    newData[slotIndex] = { ...newData[slotIndex], entries: [...newData[slotIndex].entries, newEntry] };
                } else {
                    newData.push({ timeSlot, entries: [newEntry] });
                }
                return newData;
            });
        } catch (error) {
            console.error('Failed to upload log image', error);
            alert('로그 업로드에 실패했습니다.');
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!publicId || !inputValue.trim()) return;

        // Optimistic Update
        const optimisticMessage: logRoomApi.ChatMessage = {
            publicId: Date.now().toString(),
            isMe: true,
            content: inputValue,
            createdAt: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, optimisticMessage]);
        setInputValue('');

        // API Call
        try {
            await logRoomApi.sendChatMessage(publicId, {
                message: optimisticMessage.content,
                photoPublicId: replyPhotoId || undefined,
            });

            // Re-fetch to be safe
            const updatedResponse = await logRoomApi.getChatMessages(publicId);
            setChatMessages(updatedResponse.data.messages);

            setReplyPhotoId(null);
        } catch (e) {
            console.error('Failed to send message', e);
        }
    };

    return (
        <PageLayout containerClassName='flex flex-col h-full'>
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />

            {/* Header (Simplified) */}
            <header className="h-16 border-b border-gray-800 flex items-center px-6">Header</header>

            <main className="flex flex-1 overflow-hidden h-full">
                {/* Left Timeline View (65%) */}
                <section className="w-[65%] h-full overflow-y-auto border-r border-gray-800 p-6 space-y-8">
                    {timelineData.length > 0 ? (
                        timelineData.map(slot => (
                            <div key={slot.timeSlot} className="space-y-4">
                                <h2 className="text-sm text-gray-500">{slot.timeSlot}:00</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {slot.entries.length > 0 ? (
                                        slot.entries.map((entry) => (
                                            <div key={entry.photoPublicId} className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video group">
                                                <img src={entry.imageUrl} alt={entry.caption || 'Log'} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <img src={entry.authorImageUrl || '/default-profile.png'} alt={entry.authorName} className="w-8 h-8 rounded-full bg-gray-700" />
                                                        <span className="text-sm font-semibold">{entry.authorName}</span>
                                                    </div>
                                                    <p className="text-sm">{entry.caption}</p>
                                                </div>
                                                <button onClick={() => setReplyPhotoId(entry.photoPublicId)} className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-full">✈️</button>
                                            </div>
                                        ))
                                    ) : (
                                        <div key="upload-placeholder" className="relative rounded-lg border-2 border-dashed border-gray-700 aspect-video flex flex-col items-center justify-center p-4">
                                            <button onClick={() => fileInputRef.current?.click()} className="bg-[#22C55E] text-[#121214] font-bold py-2 px-4 rounded-full">
                                                + 로그 업로드
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p>오늘 생성된 로그가 없습니다.</p>
                            <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-[#22C55E] text-[#121214] font-bold py-2 px-4 rounded-full">
                                + 첫 로그 업로드하기
                            </button>
                        </div>
                    )}
                </section>

                {/* Right Chat View (35%) */}
                <section className="w-[35%] h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {[...chatMessages].reverse().map((msg) => {
                            const date = new Date(msg.createdAt);
                            const isValidDate = !isNaN(date.getTime());
                            return (
                                <div key={msg.publicId} className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                    <div className={`p-3 rounded-2xl max-w-[70%] ${msg.isMe ? 'bg-[#22C55E] text-[#121214]' : 'bg-gray-800'}`}>
                                        <p className="text-sm">{msg.content}</p>
                                        {isValidDate && (
                                            <span className="text-xs opacity-70 mt-1 block">
                                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {isAiTyping && <div className="text-xs text-gray-400 p-2">AI가 메시지를 읽고 생각하는 중...</div>}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="sticky bottom-0 bg-[#121214] p-4 border-t border-gray-800 flex items-center gap-2">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder={replyPhotoId ? "사진에 답장 중..." : "메시지 입력..."}
                            className="flex-1 bg-gray-900 rounded-full py-2 px-4 text-sm focus:outline-none"
                        />
                        <button onClick={sendMessage} className="bg-[#22C55E] p-2 rounded-full text-[#121214]">Send</button>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
};
