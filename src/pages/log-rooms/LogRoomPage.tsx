import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as logRoomApi from '../../lib/logRoomApi';
import PageLayout from '../../components/layout/PageLayout';
import { useR2Upload } from '../../hooks/useR2Upload';
import { LogRoomHeader } from '../../components/log-rooms/LogRoomHeader';
import { LogTimeline } from '../../components/log-rooms/LogTimeline';
import { ChatPanel } from '../../components/log-rooms/ChatPanel';
import { LogPhotoUploadModal } from '../../components/log-rooms/LogPhotoUploadModal';
import { applyPhotoReplyCache, registerPhotoReply } from '../../lib/photoReplyCache';
import { expandChatBatches, saveChatBatchSplit } from '../../lib/chatBatchCache';
import { getErrorMessage, isMobile } from '../../lib/utils';

// 로컬 타임존 기준 YYYY-MM-DD (toISOString()은 UTC라 자정~오전9시 KST 구간에서 하루 어긋남)
const getLocalDateKey = (d = new Date()) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
};

export const LogRoomPage = () => {
    const { publicId } = useParams<{ publicId: string }>();
    if (!publicId) return null;
    // 방(publicId)이 바뀌면 모든 상태를 새로 시작해야 하므로 key로 컴포넌트를 통째로 리마운트한다.
    return <LogRoomPageContent key={publicId} publicId={publicId} />;
};

const LogRoomPageContent = ({ publicId }: { publicId: string }) => {
    const navigate = useNavigate();
    const [timelineData, setTimelineData] = useState<logRoomApi.DayLogTimeSlot[]>([]);
    const [chatMessages, setChatMessages] = useState<logRoomApi.ChatMessage[]>([]);
    const [sharedPosts, setSharedPosts] = useState<logRoomApi.SharedPost[]>([]);
    const [participants, setParticipants] = useState<logRoomApi.LogRoomParticipant[]>([]);
    const [memberNames, setMemberNames] = useState<Record<string, string>>({});
    const [ownerPublicId, setOwnerPublicId] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isInputLocked, setIsInputLocked] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [replyPhotoId, setReplyPhotoId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(getLocalDateKey());

    // 현재 시각 기준 초기 타임슬롯 계산: 0, 3, 6, 9, 12, 15, 18, 21
    const getInitialTimeSlot = () => {
        const hour = new Date().getHours();
        return Math.floor(hour / 3) * 3;
    };
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(getInitialTimeSlot());

    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [markedDates, setMarkedDates] = useState<Set<string>>(() => new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pendingChatsRef = useRef<{ content: string; createdAt: string; photoPublicId?: string }[]>([]);
    const aiDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const loadedCalendarMonthsRef = useRef<Set<string>>(new Set());
    const { uploadToR2 } = useR2Upload();
    const isMobileDevice = isMobile();

    useEffect(() => {
        return () => {
            if (aiDebounceTimerRef.current) clearTimeout(aiDebounceTimerRef.current);
        };
    }, []);

    // 현재 보고 있는 날짜에 로그가 있으면 달력 표시에 반영 (effect로 markedDates에 되써넣지 않고,
    // 렌더링 시점에 파생시켜 react-hooks/set-state-in-effect를 피한다)
    const markedDatesWithCurrent = useMemo(() => {
        const hasCurrentDayLog = timelineData.some((slot) => slot.entries.length > 0);
        if (!hasCurrentDayLog || markedDates.has(selectedDate)) return markedDates;
        const next = new Set(markedDates);
        next.add(selectedDate);
        return next;
    }, [markedDates, timelineData, selectedDate]);

    const loadCalendarMonth = useCallback(async (year: number, month: number) => {
        if (!publicId) return;
        const monthKey = `${year}-${month}`;
        if (loadedCalendarMonthsRef.current.has(monthKey)) return;
        loadedCalendarMonthsRef.current.add(monthKey);

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dates = Array.from({ length: daysInMonth }, (_, i) => {
            const day = String(i + 1).padStart(2, '0');
            const mm = String(month + 1).padStart(2, '0');
            return `${year}-${mm}-${day}`;
        });

        const results = await Promise.all(
            dates.map(async (date) => {
                try {
                    const slots = await logRoomApi.getDayLog(publicId, date);
                    return slots.some((slot) => slot.entries.length > 0) ? date : null;
                } catch {
                    return null;
                }
            }),
        );

        setMarkedDates((prev) => {
            const next = new Set(prev);
            results.forEach((date) => {
                if (date) next.add(date);
            });
            return next;
        });
    }, [publicId]);

    // 데이터 조회
    useEffect(() => {
        if (!publicId) return;

        const fetchData = async () => {
            try {
                // 타임라인 조회
                const timelineResponse = await logRoomApi.getDayLog(publicId, selectedDate);
                setTimelineData(timelineResponse);

                // 채팅 조회 (사진 답장 연결은 서버가 안 내려주므로 로컬 캐시로 복원)
                const chatResponse = await logRoomApi.getChatMessages(publicId);
                setChatMessages(
                    expandChatBatches(publicId, applyPhotoReplyCache(publicId, chatResponse.messages)),
                );

                // 공유 게시물 조회
                const postResponse = await logRoomApi.getLogRoomPosts(publicId);
                setSharedPosts(postResponse.content);

                // 이 방의 참여자 정보를 위해 로그방 목록 조회
                const roomListResponse = await logRoomApi.getMyLogRooms();
                const room = roomListResponse.content.find(r => r.publicId === publicId);
                console.log("Room List Response:", roomListResponse);
                if (room) {
                    console.log("Participants:", room.participants, "Owner Public ID:", room.ownerPublicId);
                    setParticipants(room.participants);
                    setOwnerPublicId(room.ownerPublicId);
                    setRoomName(room.name);

                    // 방장은 사람 유저라 캐릭터 카드 API로 이름을 못 가져온다.
                    // 대신 방 목록 응답에 이미 닉네임이 있으므로 그걸 쓴다.
                    // 주의: room.ownerPublicId는 계정 ID이고, 방 멤버의 memberPublicId와는 다르다.
                    // 그래서 isOwner로 표시된 참여자를 찾아 이름을 넣는다.
                    const ownerParticipant = room.participants.find(p => p.isOwner);
                    if (ownerParticipant) {
                        setMemberNames(prev => ({ ...prev, [ownerParticipant.memberPublicId]: room.ownerNickname }));
                    }

                    // 아직 모르는 캐릭터 참여자 표시 이름 조회
                    const missingIds = room.participants
                        .filter(p => !p.isUser && !p.isOwner && !(p.memberPublicId in memberNames))
                        .map(p => p.memberPublicId);

                    if (missingIds.length > 0) {
                        const results = await Promise.allSettled(
                            missingIds.map(id => logRoomApi.getLogCharacterCard(publicId, id))
                        );
                        const newNames: Record<string, string> = {};
                        results.forEach((result, i) => {
                            if (result.status === 'fulfilled') newNames[missingIds[i]] = result.value.name;
                        });
                        setMemberNames(prev => ({ ...prev, ...newNames }));
                    }
                }
            } catch (e) {
                console.error(getErrorMessage(e, '데이터를 불러오는 중 오류가 발생했습니다.'));
            }
        };
        fetchData();
    }, [publicId, selectedDate]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        setPendingFile(file);
        setIsUploadModalOpen(true);
    };

    const closeUploadModal = () => {
        if (isUploading) return;
        setIsUploadModalOpen(false);
        setPendingFile(null);
    };

    const handleUploadSubmit = async (caption: string) => {
        if (!pendingFile || !publicId) return;

        setIsUploading(true);
        try {
            const imageUrl = await uploadToR2(pendingFile, 'LOG');
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            await logRoomApi.uploadLogPhoto(
                publicId,
                { imageUrl, caption: caption || undefined },
                timezone,
            );

            const updatedResponse = await logRoomApi.getDayLog(publicId, selectedDate);
            setTimelineData(updatedResponse);
            setMarkedDates((prev) => {
                const next = new Set(prev);
                next.add(selectedDate);
                return next;
            });

            setIsUploadModalOpen(false);
            setPendingFile(null);
        } catch (error) {
            const message = getErrorMessage(error, '로그 업로드에 실패했습니다.');
            console.error(message);
            alert(message);
        } finally {
            setIsUploading(false);
        }
    };

    // 유저 메시지는 화면에 각각 표시하고, 5초 디바운스 후 서버로만 묶어서 전송한다.
    const flushPendingChats = async () => {
        if (!publicId || pendingChatsRef.current.length === 0) return;

        const batch = [...pendingChatsRef.current];
        pendingChatsRef.current = [];
        if (aiDebounceTimerRef.current) {
            clearTimeout(aiDebounceTimerRef.current);
            aiDebounceTimerRef.current = null;
        }

        const batchedContent = batch.map((m) => m.content).join('\n');
        const lastPhotoId = [...batch].reverse().find((m) => m.photoPublicId)?.photoPublicId;

        setIsInputLocked(true);
        setIsAiTyping(true);

        try {
            await logRoomApi.sendChatMessage(publicId, {
                message: batchedContent,
                photoPublicId: lastPhotoId,
            });

            const updatedResponse = await logRoomApi.getChatMessages(publicId);
            const sorted = [...updatedResponse.messages].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );

            let combinedIdx = -1;
            for (let i = sorted.length - 1; i >= 0; i--) {
                if (sorted[i].isMe && sorted[i].content === batchedContent) {
                    combinedIdx = i;
                    break;
                }
            }

            const before = combinedIdx >= 0 ? sorted.slice(0, combinedIdx) : sorted;
            const after = combinedIdx >= 0 ? sorted.slice(combinedIdx + 1) : [];

            saveChatBatchSplit(
                publicId,
                batchedContent,
                batch.map((m) => ({
                    content: m.content,
                    createdAt: m.createdAt,
                    photoPublicId: m.photoPublicId ?? null,
                })),
            );

            const individuals = batch.map((m) => ({
                isMe: true as const,
                content: m.content,
                createdAt: m.createdAt,
                quotedPhotoPublicId: m.photoPublicId ?? null,
            }));

            let afterMessages = after;
            if (lastPhotoId) {
                // AI 답장에 사진 연결을 남기기 위해 묶인 원본 기준으로 캐시 등록 후, 표시용 after만 사용
                registerPhotoReply(publicId, updatedResponse.messages, batchedContent, lastPhotoId);
                afterMessages = after.map((m) =>
                    m.isMe ? m : { ...m, quotedPhotoPublicId: lastPhotoId },
                );
            } else {
                afterMessages = applyPhotoReplyCache(publicId, after);
            }

            setChatMessages([
                ...expandChatBatches(publicId, applyPhotoReplyCache(publicId, before)),
                ...individuals,
                ...afterMessages,
            ]);
        } catch (e) {
            console.error(getErrorMessage(e, '메시지 전송 중 오류가 발생했습니다.'));
            try {
                const updatedResponse = await logRoomApi.getChatMessages(publicId);
                setChatMessages(
                    expandChatBatches(publicId, applyPhotoReplyCache(publicId, updatedResponse.messages)),
                );
            } catch {
                /* 무시 */
            }
        } finally {
            setIsAiTyping(false);
            setIsInputLocked(false);
        }
    };

    const sendMessage = () => {
        if (!publicId || !inputValue.trim() || isInputLocked || isAiTyping) return;

        const content = inputValue.trim();
        const quotedPhotoPublicId = replyPhotoId || undefined;
        const createdAt = new Date().toISOString();
        setInputValue('');
        setReplyPhotoId(null);

        pendingChatsRef.current.push({ content, createdAt, photoPublicId: quotedPhotoPublicId });

        // 화면에는 항상 개별 말풍선으로 표시
        setChatMessages((prev) => [
            ...prev,
            {
                isMe: true,
                content,
                createdAt,
                quotedPhotoPublicId: quotedPhotoPublicId ?? null,
            },
        ]);

        if (aiDebounceTimerRef.current) clearTimeout(aiDebounceTimerRef.current);
        aiDebounceTimerRef.current = setTimeout(() => {
            void flushPendingChats();
        }, 5000);
    };

    // 현재 선택된 (날짜, 시간대)를 게시물로 공유하고, 모든 로그방의 공유 게시물이 모이는
    // 홈 피드(/feed)로 이동한다. 방금 공유한 게시물 정보는 state로 함께 전달해
    // 피드 페이지에서 곧바로 상세를 열어 보여줄 수 있게 한다.
    const handleShare = async () => {
        if (!publicId || isSharing) return;

        setIsSharing(true);
        try {
            const newPost = await logRoomApi.shareLog(publicId, {
                postDate: selectedDate,
                timeSlot: selectedTimeSlot,
            });
            navigate('/feed', { state: { newPost } });
        } catch (error) {
            const message = getErrorMessage(error, '게시물 공유에 실패했습니다.');
            console.error(message);
            alert(message);
        } finally {
            setIsSharing(false);
        }
    };

    // 달력에서 날짜를 고르면, 그 날짜에 로그가 있는 타임슬롯 중 가장 늦은 구간으로 이동한다.
    const handleDateChange = async (date: string) => {
        setSelectedDate(date);
        if (!publicId) return;

        try {
            const slots = await logRoomApi.getDayLog(publicId, date);
            setTimelineData(slots);

            const slotsWithLogs = slots.filter((slot) => slot.entries.length > 0);
            if (slotsWithLogs.length === 0) return;

            // 0시는 UI에서 24로 보이므로, 늦은 시간 비교 시 0을 24로 취급한다.
            const rank = (timeSlot: number) => (timeSlot === 0 || timeSlot === 24 ? 24 : timeSlot);
            const latest = slotsWithLogs.reduce((best, slot) =>
                rank(slot.timeSlot) > rank(best.timeSlot) ? slot : best,
            );
            setSelectedTimeSlot(latest.timeSlot);
        } catch (e) {
            console.error(getErrorMessage(e, '날짜별 로그를 불러오는 중 오류가 발생했습니다.'));
        }
    };

    // 채팅에서 특정 로그/게시물을 눌렀을 때 해당 (날짜, 시간대)의 타임라인으로 이동.
    // 모바일에서는 채팅과 타임라인이 배타적으로 표시되므로, 채팅을 닫아 타임라인이 보이게 한다.
    const jumpToLog = (date: string, timeSlot: number) => {
        setSelectedDate(date);
        setSelectedTimeSlot(timeSlot);
        if (isMobileDevice) setIsChatOpen(false);
    };

    const characterParticipant = participants.find(p => !p.isUser);
    const characterName = characterParticipant ? memberNames[characterParticipant.memberPublicId] : undefined;

    return (
        <PageLayout
        >
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />

            <LogPhotoUploadModal
                isOpen={isUploadModalOpen}
                file={pendingFile}
                isUploading={isUploading}
                onClose={closeUploadModal}
                onSubmit={handleUploadSubmit}
            />

            <LogRoomHeader
                roomName={roomName}
                participants={participants}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotChange={setSelectedTimeSlot}
                isChatOpen={isChatOpen}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
                timelineData={timelineData}
                markedDates={markedDatesWithCurrent}
                onCalendarMonthChange={loadCalendarMonth}
                onShare={handleShare}
                isSharing={isSharing}
            />

            <div className="flex max-h-[calc(100vh-263.5px)]">
                {isMobileDevice ? !isChatOpen ? <LogTimeline
                    timelineData={timelineData}
                    sharedPosts={sharedPosts}
                    chatMessages={chatMessages}
                    participants={participants}
                    memberNames={memberNames}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    ownerPublicId={ownerPublicId}
                    onUpload={() => fileInputRef.current?.click()}
                    onReply={setReplyPhotoId}
                /> : null : <LogTimeline
                    timelineData={timelineData}
                    sharedPosts={sharedPosts}
                    chatMessages={chatMessages}
                    participants={participants}
                    memberNames={memberNames}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    ownerPublicId={ownerPublicId}
                    onUpload={() => fileInputRef.current?.click()}
                    onReply={setReplyPhotoId}
                />}
                {isChatOpen && (
                    <ChatPanel
                        roomPublicId={publicId ?? ''}
                        chatMessages={chatMessages}
                        sharedPosts={sharedPosts}
                        timelineData={timelineData}
                        selectedDate={selectedDate}
                        isAiTyping={isAiTyping}
                        isInputDisabled={isInputLocked || isAiTyping}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSendMessage={sendMessage}
                        replyPhotoId={replyPhotoId}
                        onJumpToLog={jumpToLog}
                        myImageUrl={participants.find(p => p.isUser)?.imageUrl ?? null}
                        characterName={characterName}
                        characterImageUrl={characterParticipant?.imageUrl ?? null}
                    />
                )}
            </div>
        </PageLayout>
    );
};

