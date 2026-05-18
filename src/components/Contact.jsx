import { useState, useRef, useEffect } from "react";
import { auth, db, signInWithGoogle, logOut } from "../lib/firebase";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Contact() {
    // Auth State
    const [user, setUser] = useState(null);

    // Community Messages
    const [commMessages, setCommMessages] = useState([]);
    const [commInput, setCommInput] = useState("");
    const [isCommTyping, setIsCommTyping] = useState(false);

    // Reply State
    const [replyingTo, setReplyingTo] = useState(null);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Theo dõi trạng thái đăng nhập
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Lắng nghe tin nhắn từ Firestore (Chạy cả khi chưa đăng nhập!)
    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "asc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = [];
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() });
            });
            setCommMessages(msgs);
            setTimeout(scrollToBottom, 100);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [commMessages, isCommTyping]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleCommSend = async (e) => {
        e.preventDefault();
        if (!commInput.trim()) return;

        if (!user) return;

        try {
            const messageData = {
                text: commInput,
                createdAt: serverTimestamp(),
                userName: user.displayName,
                userImg: user.photoURL,
                uid: user.uid
            };

            // Nếu đang trả lời tin nhắn khác
            if (replyingTo) {
                messageData.replyTo = {
                    id: replyingTo.id,
                    text: replyingTo.text,
                    userName: replyingTo.userName
                };
            }

            await addDoc(collection(db, "messages"), messageData);
            setCommInput("");
            setReplyingTo(null); // Reset reply state
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleRecall = async (msgId) => {
        try {
            const msgRef = doc(db, "messages", msgId);
            await updateDoc(msgRef, {
                isRecalled: true,
                text: "Tin nhắn đã bị thu hồi" // Ghi đè text để bảo mật
            });
        } catch (error) {
            console.error("Error recalling message:", error);
        }
    };

    return (
        <section
            id="contact"
            className="relative min-h-[100vh] py-32 flex items-center bg-paper text-ink transition-colors duration-500"
        >
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 w-full">
                <div className="text-center mb-10">
                    <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-acid-deep mb-5">
                        05 — Live.Community()
                    </p>
                    <h2 className="font-display uppercase text-4xl md:text-5xl lg:text-6xl leading-[0.9] text-ink drop-shadow-xl">
                        Interactive <br /> Hub
                    </h2>
                    <p className="mt-6 max-w-xl mx-auto text-ink-soft font-body">
                        Sign in to join the live community chat to discuss projects and ideas.
                    </p>
                </div>

                {/* Chat Application ALWAYS VISIBLE */}
                <div className="w-full h-[550px] md:h-[650px] max-h-[80vh] border border-ink/15 bg-white/85 dark:bg-[#1a1c23]/90 backdrop-blur-md flex flex-col rounded-xl overflow-hidden transition-all duration-700 ease-out hover:scale-[1.01] shadow-[20px_30px_50px_-15px_rgba(0,0,0,0.25)] dark:shadow-[20px_30px_50px_-15px_rgba(0,0,0,0.7)]">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-ink/15 bg-paper-soft dark:bg-[#0f1115] px-6 py-4">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center overflow-hidden">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-acid-deep text-[#0a0a0a] flex items-center justify-center font-mono font-bold">
                                                {user.displayName?.substring(0, 2).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-mono text-sm font-bold uppercase text-ink">{user.displayName}</p>
                                </div>
                                <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors border border-red-500/20 flex items-center justify-center font-bold shadow-sm">Sign Out</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center overflow-hidden bg-paper">
                                        <svg className="w-6 h-6 text-ink opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a5 5 0 00-5 5v4H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a5 5 0 00-5-5z"></path></svg>
                                    </div>
                                    <p className="font-mono text-sm font-bold uppercase text-ink">Guest</p>
                                </div>
                                <button onClick={handleLogin} className="px-3 py-1.5 bg-acid-deep hover:bg-acid-deep/80 text-[#0a0a0a] font-mono text-xs uppercase tracking-wider rounded-lg transition-colors border border-ink flex items-center justify-center font-bold shadow-sm">Sign In</button>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="font-mono text-xs uppercase tracking-widest text-ink">Global Room</span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex min-h-0 flex-col md:flex-row bg-[#fdfdfd] dark:bg-[#171921] transition-colors duration-500">

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Messages */}
                            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6" data-lenis-prevent>
                                {commMessages.length === 0 ? (
                                    <div className="text-center text-ink opacity-50 font-mono text-sm mt-10">
                                        No messages yet. Say hi!
                                    </div>
                                ) : (
                                    commMessages.map((msg) => {
                                        const isMyMessage = user && msg.userName === user?.displayName;
                                        const isRecalled = msg.isRecalled;

                                        return (
                                            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMyMessage ? 'self-end flex-row-reverse' : 'self-start flex-row'}`}>
                                                {/* Avatar */}
                                                <div className="w-8 h-8 rounded-full border border-ink/10 flex-shrink-0 overflow-hidden shadow-sm self-end">
                                                    {msg.userImg ? (
                                                        <img src={msg.userImg} alt={msg.userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-acid-deep text-[#0a0a0a] flex items-center justify-center font-mono text-xs font-bold">
                                                            {(msg.userName || "U").substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Message Content Area */}
                                                <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} group relative`}>
                                                    {/* Name & Time */}
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-ink opacity-70">{msg.userName || "Anonymous"}</span>
                                                        <span className="font-mono text-[9px] text-ink opacity-40">
                                                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "..."}
                                                        </span>
                                                    </div>

                                                    {/* Reply Quote Display */}
                                                    {msg.replyTo && !isRecalled && (
                                                        <div className={`mb-1 p-2 bg-paper-soft dark:bg-[#0a0a0a]/50 rounded-lg text-xs max-w-[200px] border-l-2 border-acid-deep flex flex-col gap-0.5 opacity-80 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                                                            <span className="font-mono text-[9px] font-bold text-ink-soft">{msg.replyTo.userName}</span>
                                                            <span className="font-body text-[11px] text-ink opacity-70 truncate">{msg.replyTo.text}</span>
                                                        </div>
                                                    )}

                                                    {/* Message Box */}
                                                    <div className={`p-3 px-4 font-body text-[14px] leading-relaxed shadow-sm ${isRecalled ? 'bg-paper-soft dark:bg-[#212431] border border-ink/5 text-ink opacity-50 italic rounded-2xl' : isMyMessage ? 'bg-acid-deep/20 dark:bg-acid-deep/10 border border-acid-deep/30 text-ink rounded-l-2xl rounded-tr-2xl' : 'bg-white dark:bg-[#212431] border border-ink/10 text-ink rounded-r-2xl rounded-tl-2xl'}`}>
                                                        {msg.text}
                                                    </div>

                                                    {/* Action Buttons (Reply, Recall) on Hover - ONLY FOR LOGGED IN USERS */}
                                                    {user && !isRecalled && (
                                                        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMyMessage ? 'left-[-60px]' : 'right-[-60px]'}`}>
                                                            {/* Reply Button */}
                                                            <button
                                                                onClick={() => setReplyingTo({ id: msg.id, text: msg.text, userName: msg.userName })}
                                                                className="w-6 h-6 bg-white dark:bg-[#2b2e3b] rounded-full flex items-center justify-center text-ink opacity-70 hover:opacity-100 hover:bg-paper-soft border border-ink/10 shadow-sm"
                                                                title="Reply"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                                            </button>

                                                            {/* Recall Button (Only for my messages) */}
                                                            {isMyMessage && (
                                                                <button
                                                                    onClick={() => handleRecall(msg.id)}
                                                                    className="w-6 h-6 bg-white dark:bg-[#2b2e3b] rounded-full flex items-center justify-center text-red-500 opacity-70 hover:opacity-100 hover:bg-paper-soft border border-ink/10 shadow-sm"
                                                                    title="Recall"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Preview Box */}
                            {replyingTo && (
                                <div className="px-5 py-2 border-t border-ink/15 bg-paper-soft dark:bg-[#0a0a0a]/50 flex justify-between items-center transition-all duration-300">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[10px] font-bold text-acid-deep uppercase">Replying to {replyingTo.userName}</span>
                                        <span className="font-body text-xs text-ink opacity-70 truncate max-w-[250px]">{replyingTo.text}</span>
                                    </div>
                                    <button onClick={() => setReplyingTo(null)} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                                        <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            )}

                            {/* Input Form - CONDITIONAL FOR LOGIN */}
                            {user ? (
                                <form onSubmit={handleCommSend} className="p-4 md:p-5 border-t border-ink/15 bg-paper-soft dark:bg-[#0f1115] flex gap-3 items-center transition-colors duration-500 shadow-[inset_0_15px_20px_-15px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_15px_20px_-15px_rgba(0,0,0,0.3)]">
                                    <input
                                        type="text"
                                        value={commInput}
                                        onChange={(e) => setCommInput(e.target.value)}
                                        placeholder="Message the community..."
                                        className="flex-1 min-w-0 bg-white dark:bg-[#1a1c23] border border-ink/20 focus:border-acid-deep focus:ring-1 focus:ring-acid-deep focus:outline-none px-3 sm:px-5 py-3 sm:py-4 font-body text-base text-ink placeholder:text-ink opacity-30 rounded-lg shadow-inner transition-colors duration-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!commInput.trim()}
                                        className="font-mono text-xs tracking-[0.2em] uppercase bg-ink text-paper px-4 sm:px-8 py-4 border-2 border-ink hover:bg-[#c8ee00] hover:text-black hover:border-[#c8ee00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-full shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                                    >
                                        Send →
                                    </button>
                                </form>
                            ) : (
                                <div className="p-4 md:p-5 border-t border-ink/15 bg-paper-soft dark:bg-[#0f1115] flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors duration-500 shadow-[inset_0_15px_20px_-15px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_15px_20px_-15px_rgba(0,0,0,0.3)]">
                                    <p className="font-body text-sm text-ink opacity-70">Sign in to join the conversation.</p>
                                    <button
                                        onClick={handleLogin}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 font-mono text-xs tracking-[0.1em] uppercase bg-ink text-paper border-2 border-ink px-6 py-3 hover:bg-acid hover:text-ink hover:border-acid transition-all duration-300 shadow-md hover:shadow-lg rounded-lg"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4 bg-white rounded-full p-0.5" />
                                        Login to Chat
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar: Online Users */}
                        <div className="w-64 border-t md:border-t-0 md:border-l border-ink/15 bg-paper-soft dark:bg-[#0f1115] p-6 hidden lg:flex flex-col transition-colors duration-500 shadow-[inset_15px_0_20px_-15px_rgba(0,0,0,0.05)] dark:shadow-[inset_15px_0_20px_-15px_rgba(0,0,0,0.3)]">
                            <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-soft mb-6 flex items-center">
                                Online Members
                            </h3>
                            <ul className="space-y-4">
                                {user ? (
                                    <li className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full border border-ink/10 overflow-hidden shadow-md">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-acid-deep text-[#0a0a0a] flex items-center justify-center font-mono text-xs">
                                                    {user.displayName?.substring(0, 2).toUpperCase() || "U"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm text-ink font-bold">{user.displayName}</span>
                                            <span className="font-mono text-[9px] text-acid-deep">You</span>
                                        </div>
                                    </li>
                                ) : (
                                    <li className="flex items-center gap-3 opacity-50">
                                        <div className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center bg-paper">
                                            <svg className="w-4 h-4 text-ink opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a5 5 0 00-5 5v4H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-1V7a5 5 0 00-5-5z"></path></svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm text-ink font-bold">Guest</span>
                                            <span className="font-mono text-[9px] text-ink-soft">Not logged in</span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
