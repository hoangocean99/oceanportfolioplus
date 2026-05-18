import { useState, useRef, useEffect } from "react";
import { aiKnowledge } from "../data/aiKnowledge";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: "AI", text: "Hi! I'm the AI Agent for Hoang Duong's portfolio. I can help you navigate the site, open social links, or send an email!", isSelf: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        const handleOpenChat = (e) => {
            setIsOpen(true);
            if (e.detail?.type === 'hire') {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        sender: "AI",
                        text: "Great! Are you looking to hire me for a freelance project or an Intern/Fresher position? How can I help you today?",
                        isSelf: false,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
            }
        };
        window.addEventListener('openChatbot', handleOpenChat);
        return () => window.removeEventListener('openChatbot', handleOpenChat);
    }, []);

    const callGemini = async (prompt) => {
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        if (!apiKey) {
            return "⚠️ Gemini API Key is missing! Vui lòng thêm REACT_APP_GEMINI_API_KEY vào file .env của bạn.";
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{
                            text: `Bạn là trợ lý ảo AI Agent cho website portfolio của Hoàng Dương (Hoàng Hải Dương).
Bạn có khả năng giúp người dùng thực hiện các hành động trên trang bằng cách trả về các lệnh đặc biệt trong ngoặc vuông ở CUỐI câu trả lời của bạn.
Các lệnh bạn có thể dùng:
1. Chuyển hướng đến phần nào đó trong trang: [NAVIGATE: sectionId]
   Các sectionId hợp lệ: 'hero', 'intro', 'about', 'skills', 'projects', 'contact'.
2. Mở link mạng xã hội hoặc link ngoài: [OPEN: url]
   Ví dụ: [OPEN: https://www.facebook.com/hoang.hai.duong.484951/] (Sử dụng link này cho Facebook nếu người dùng yêu cầu).
3. Gửi mail cho Dương: [MAIL: nội dung mail]

QUY TẮC NGÔN NGỮ:
- Hãy trả lời bằng CHÍNH NGÔN NGỮ mà người dùng đang sử dụng để hỏi bạn (Ví dụ: nếu họ hỏi bằng tiếng Anh thì trả lời hoàn toàn bằng tiếng Anh, hỏi bằng tiếng Việt thì trả lời bằng tiếng Việt).

Hãy trả lời thân thiện, xưng Tôi/Mình và gọi người dùng là Bạn (nếu dùng tiếng Việt) hoặc I/You (nếu dùng tiếng Anh). Trả lời ngắn gọn.

DỮ LIỆU KIẾN THỨC VỀ HOÀNG DƯƠNG (Hãy dùng thông tin này để trả lời):
${aiKnowledge}

Ví dụ: "Tôi sẽ đưa bạn đến phần dự án nhé! [NAVIGATE: projects]"
"Để gửi mail cho Dương, tôi đã mở trình soạn thảo mail cho bạn rồi! [MAIL: Chào Dương, mình muốn hợp tác...]"` }]
                    },
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "Xin lỗi, tôi gặp sự cố khi xử lý câu trả lời.";
            }
        } catch (error) {
            console.error("Error calling Gemini:", error);
            return "Không thể kết nối với AI lúc này. Vui lòng thử lại sau!";
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userPrompt = input.trim();

        const newMessage = {
            id: Date.now(),
            sender: "You",
            text: userPrompt,
            isSelf: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsTyping(true);

        // Gọi API Gemini
        const aiResponse = await callGemini(userPrompt);

        // Xử lý các lệnh từ AI
        const navMatch = aiResponse.match(/\[NAVIGATE:\s*(\w+)\]/);
        const openMatch = aiResponse.match(/\[OPEN:\s*(https?:\/\/[^\s\]]+)\]/);
        const mailMatch = aiResponse.match(/\[MAIL:\s*([^\]]+)\]/);

        if (navMatch) {
            const sectionId = navMatch[1];
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }

        if (openMatch) {
            const url = openMatch[1];
            window.open(url, '_blank');
        }

        if (mailMatch) {
            const content = mailMatch[1];
            window.location.href = `mailto:duonghaiduong090905@gmail.com?body=${encodeURIComponent(content)}`;
        }

        // Xóa các lệnh khỏi text hiển thị cho người dùng
        const cleanedText = aiResponse.replace(/\[(NAVIGATE|OPEN|MAIL):[^\]]+\]/g, '').trim();

        setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            sender: "AI",
            text: cleanedText || "Tôi đã thực hiện yêu cầu của bạn!",
            isSelf: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            <div
                data-lenis-prevent
                className={`mb-4 w-[340px] md:w-[380px] h-[500px] max-h-[80vh] bg-white dark:bg-[#1a1c23] border border-ink/20 shadow-2xl rounded-lg flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="bg-ink dark:bg-[#0a0a0a] text-paper p-4 flex justify-between items-center transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-acid-deep rounded-full flex items-center justify-center text-[#0a0a0a] shadow-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h.01M16 10h.01M9 14h6m-3-10v2M5 8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"></path></svg>
                        </div>
                        <div className="text-paper dark:text-white">
                            <h3 className="font-display uppercase text-sm m-0 leading-tight">AI Agent</h3>
                            <p className="font-mono text-[9px] tracking-wider opacity-70">Gemini Powered</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity p-1 text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Messages */}
                <div data-lenis-prevent className="flex-1 p-5 overflow-y-auto overscroll-contain bg-[#fdfdfd] dark:bg-[#171921] flex flex-col gap-5 scrollbar-thin scrollbar-thumb-ink/20 transition-colors">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.isSelf ? 'self-end items-end' : 'self-start items-start'}`}>
                            <div className={`p-3 px-4 font-body text-[14px] leading-relaxed shadow-sm ${msg.isSelf ? 'bg-acid-deep text-[#0a0a0a] rounded-l-2xl rounded-tr-2xl' : 'bg-white dark:bg-[#2b2e3b] border border-ink/10 text-ink rounded-r-2xl rounded-tl-2xl'}`}>
                                {msg.text}
                            </div>
                            <span className="font-mono text-[9px] text-ink opacity-40 mt-1.5 px-1">{msg.time}</span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex flex-col max-w-[80%] self-start items-start">
                            <div className="p-3 px-4 font-body text-sm border bg-white dark:bg-[#2b2e3b] border-ink/10 text-ink rounded-r-2xl rounded-tl-2xl flex items-center gap-1.5 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                                <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t border-ink/15 bg-paper-soft dark:bg-[#0f1115] flex gap-2 transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me about everything of Hoang Hai Duong..."
                        className="flex-1 bg-white dark:bg-[#1a1c23] border border-ink/20 focus:border-acid-deep focus:ring-1 focus:ring-acid-deep focus:outline-none px-4 py-2.5 font-body text-sm text-ink rounded-lg shadow-inner transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="bg-ink dark:bg-acid text-paper dark:text-[#0a0a0a] px-4 py-2.5 rounded-lg hover:bg-acid hover:text-[#0a0a0a] transition-colors disabled:opacity-50 flex items-center justify-center shadow-md"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 bg-acid-deep text-[#0a0a0a] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-transparent hover:border-[#0a0a0a]/20 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 hover:scale-105 active:scale-95'}`}
                style={{ position: isOpen ? 'absolute' : 'relative', bottom: 0, right: 0 }}
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 10h.01M16 10h.01M9 14h6m-3-10v2M5 8h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z"></path></svg>
            </button>
        </div>
    );
}
