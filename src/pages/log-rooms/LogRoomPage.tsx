import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as logRoomApi from '../../lib/logRoomApi';
import PageLayout from '../../components/layout/PageLayout';
import { useR2Upload } from '../../hooks/useR2Upload';
import { LogRoomHeader } from '../../components/log-rooms/LogRoomHeader';
import { LogTimeline } from '../../components/log-rooms/LogTimeline';
import { ChatPanel } from '../../components/log-rooms/ChatPanel';

export const LogRoomPage = () => {
    const { publicId } = useParams<{ publicId: string }>();
    const [timelineData, setTimelineData] = useState<logRoomApi.DayLogTimeSlot[]>([]);
    const [chatMessages, setChatMessages] = useState<logRoomApi.ChatMessage[]>([]);
    const [sharedPosts, setSharedPosts] = useState<logRoomApi.SharedPost[]>([]);
    const [participants, setParticipants] = useState<logRoomApi.LogRoomParticipant[]>([]);
    const [memberNames, setMemberNames] = useState<Record<string, string>>({});
    const [ownerPublicId, setOwnerPublicId] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [isAiTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [replyPhotoId, setReplyPhotoId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Calculate initial time slot based on current hour: 0, 3, 6, 9, 12, 15, 18, 21
    const getInitialTimeSlot = () => {
        const hour = new Date().getHours();
        return Math.floor(hour / 3) * 3;
    };
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(getInitialTimeSlot());

    const [isChatOpen, setIsChatOpen] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadToR2 } = useR2Upload();

    // Fetch data
    useEffect(() => {
        if (!publicId) return;

        const fetchData = async () => {
            try {
                // Fetch timeline
                const timelineResponse = await logRoomApi.getDayLog(publicId, selectedDate);
                setTimelineData(timelineResponse);

                // Fetch chats
                const chatResponse = await logRoomApi.getChatMessages(publicId);
                setChatMessages(chatResponse.messages);

                // Fetch shared posts
                const postResponse = await logRoomApi.getLogRoomPosts(publicId);
                setSharedPosts(postResponse.content);

                // Fetch log rooms to get participants for this room
                const roomListResponse = await logRoomApi.getMyLogRooms();
                const room = roomListResponse.content.find(r => r.publicId === publicId);
                console.log("Room List Response:", roomListResponse);
                if (room) {
                    console.log("Participants:", room.participants, "Owner Public ID:", room.ownerPublicId);
                    setParticipants(room.participants);
                    setOwnerPublicId(room.ownerPublicId);
                    setRoomName(room.name);

                    // Room owner is the human user; the character-card endpoint doesn't cover
                    // users, but the room summary already carries their nickname.
                    // Note: room.ownerPublicId is the owner's account ID, not their
                    // room-membership memberPublicId, so look up the flagged participant instead.
                    const ownerParticipant = room.participants.find(p => p.isOwner);
                    if (ownerParticipant) {
                        setMemberNames(prev => ({ ...prev, [ownerParticipant.memberPublicId]: room.ownerNickname }));
                    }

                    // Fetch display names for character participants not already known
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
                console.error('Failed to fetch data', e);
            }
        };
        fetchData();
    }, [publicId, selectedDate]);

    // File Upload Handler
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !publicId) return;

        try {
            // 1. Get image URL from R2
            const imageUrl = await uploadToR2(file, 'LOG');

            // 2. Upload photo info to server
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            await logRoomApi.uploadLogPhoto(publicId, { imageUrl }, timezone);

            // 3. Re-fetch
            const updatedResponse = await logRoomApi.getDayLog(publicId, selectedDate);
            setTimelineData(updatedResponse);
        } catch (error) {
            console.error('Failed to upload log image', error);
            alert('로그 업로드에 실패했습니다.');
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!publicId || !inputValue.trim()) return;

        const content = inputValue;
        setInputValue('');

        // API Call
        try {
            await logRoomApi.sendChatMessage(publicId, {
                message: content,
                photoPublicId: replyPhotoId || undefined,
            });

            // Re-fetch
            const updatedResponse = await logRoomApi.getChatMessages(publicId);
            setChatMessages(updatedResponse.messages);

            setReplyPhotoId(null);
        } catch (e) {
            console.error('Failed to send message', e);
        }
    };

    const handleViewLog = (post: logRoomApi.SharedPost) => {
        setSelectedDate(post.postDate);
        setSelectedTimeSlot(post.timeSlot);
    };

    const handleJumpToDate = (date: string) => {
        setSelectedDate(date);
    };

    return (
        <PageLayout
        >
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />

            <LogRoomHeader
                roomName={roomName}
                participants={participants}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotChange={setSelectedTimeSlot}
                isChatOpen={isChatOpen}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
                timelineData={timelineData}
            />

            <main className="flex">
                <LogTimeline
                    timelineData={timelineData}
                    sharedPosts={sharedPosts}
                    participants={participants}
                    memberNames={memberNames}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    ownerPublicId={ownerPublicId}
                    onUpload={() => fileInputRef.current?.click()}
                    onReply={setReplyPhotoId}
                />
                {isChatOpen && (
                    <ChatPanel
                        chatMessages={chatMessages}
                        sharedPosts={sharedPosts}
                        isAiTyping={isAiTyping}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSendMessage={sendMessage}
                        replyPhotoId={replyPhotoId}
                        onViewLog={handleViewLog}
                        onJumpToDate={handleJumpToDate}
                        myImageUrl={participants.find(p => p.isUser)?.imageUrl ?? null}
                    />
                )}
            </main>
        </PageLayout>
    );
};

