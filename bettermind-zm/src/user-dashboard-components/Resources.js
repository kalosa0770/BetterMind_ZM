import { Search, BookOpen, Video, FileText, Lock, Music, PhoneCall, Zap, Smile, Brain, Sun, X, MessageCircle } from "lucide-react";
import React, { useState } from 'react';

// --- API Constants ---
const GEMINI_API_KEY = ""; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const SYSTEM_INSTRUCTION = "You are Aura, a friendly and empathetic mental wellness companion. Your role is to provide gentle support, empathetic listening, and general wellness tips based on recognized self-care principles (like mindfulness, deep breathing, and journaling prompts). You are NOT a licensed medical professional, therapist, or crisis counselor. If the user expresses suicidal ideation, immediate danger, or severe crisis, you MUST respond by immediately directing them to professional resources and the 988 Crisis Lifeline, and emphasize that they need to seek professional help immediately. Keep responses concise, supportive, and focused on wellness.";

// --- Data Definitions (Unchanged) ---

const categories = [
    { name: "All", icon: Search },
    { name: "Anxiety", icon: Zap },
    { name: "Sleep", icon: Sun },
    { name: "CBT", icon: Brain },
    { name: "Journaling", icon: FileText },
    { name: "Mindfulness", icon: Smile },
];

const resourceItems = [
    {
        type: "Audio",
        icon: Music,
        title: "Deep Breathing for Calming Anxiety",
        description: "A comprehensive guide to recognizing and managing anxiety symptoms.",
        category: "Anxiety",
        link: "#",
        time: '3 min'
    },
    
    {
        type: "Book",
        icon: BookOpen,
        title: "Mindfulness for Beginners",
        description: "An easy-to-follow book for starting your mindfulness journey.",
        category: "Mindfulness",
        link: "#",
        time: "10 min"
    },
    {
        type: "Video",
        icon: Video,
        title: "Guided 10-Minute Relaxation",
        description: "A 10-minute video to help you relax and refocus, great for a lunch break.",
        category: "Mindfulness",
        link: "#",
        time: "10 min"
    }
];

const recommendedContentData = [
    {
      cardImg: "https://placehold.co/300x160/2c3e50/ffffff?text=Mindfulness+Guide",
      cardTitle: "Guided Relaxation for Sleep",
      cardText: "A 15-minute audio session to prepare your mind for a deep, restful night.",
      topic: "Sleep",
      icon: <Lock className="w-4 h-4 text-amber-500" />
    },
    {
      cardImg: "https://placehold.co/300x160/3498db/ffffff?text=Stress+Buster",
      cardTitle: "5 Tips to Manage Work Stress",
      cardText: "Quick and actionable strategies to maintain balance during busy weeks.",
      topic: "Stress Management",
      icon: <Lock className="w-4 h-4 text-amber-500" />
    },
    {
      cardImg: "https://placehold.co/300x160/95a5a6/333333?text=Coping+Skills",
      cardTitle: "Beginner's Guide to Thought Challenging (CBT)",
      cardText: "Learn how to structure your entries to maximize emotional clarity using CBT principles.",
      topic: "CBT",
      icon: null // Free content
    },
    {
      cardImg: "https://placehold.co/300x160/e74c3c/ffffff?text=Therapy+Intro",
      cardTitle: "Understanding Teletherapy",
      cardText: "Your questions answered about meeting with a mental health professional online.",
      topic: "Teletherapy",
      icon: <Lock className="w-4 h-4 text-amber-500" />
    }
];

const popularArticles = [
    {
        type: "Article",
        icon: FileText,
        title: "How to Manage Daily Stressors",
        description: "Practical steps to identify and reduce daily anxiety triggers.",
        category: "Anxiety",
        link: "#",
        time: "6 min"
    },
    
    {
        type: "Article",
        icon: FileText,
        title: "Increasing Focus and Productivity",
        description: "Techniques for better concentration and balancing work/life boundaries.",
        category: "CBT",
        link: "#",
        time: "8 min"
    },
    {
        type: "Article",
        icon: FileText,
        title: "Understanding Depression and Seeking Help",
        description: "An introductory guide to depression symptoms and professional therapy options.",
        category: "Therapy",
        link: "#",
        time: "12 min"
    }
];

// --- Sub-Components ---

/**
 * Renders a horizontal, scrollable list of personalized recommended articles/media.
 */
const RecommendedContent = () => {
    return (
        <div className="my-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-start">Recommended for you</h3>
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 scrollbar-hide">
                {recommendedContentData.map((data, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-80 sm:w-96 snap-start bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200"
                    >
                        <a href="#" className="flex flex-col space-y-3 h-full">
                            <div className="h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                    src={data.cardImg} 
                                    alt={data.cardTitle} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x160/f0f0f0/333333?text=Content+Card"; }}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{data.cardTitle}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{data.cardText}</p>
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-sm font-medium text-teal-600">#{data.topic}</p>
                                {data.icon && (
                                    <div className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                        {data.icon}
                                        <span className="ml-1">Premium</span>
                                    </div>
                                )}
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            {/* Custom CSS to hide the scrollbar for aesthetic purposes */}
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
            `}</style>
        </div>
      );
};

/**
 * Renders the filter buttons for resource categories.
 */
const CategoryFilter = ({ activeCategory, setActiveCategory }) => (
    <div className="flex space-x-3 overflow-x-auto py-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
            <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 
                    ${activeCategory === cat.name 
                        ? 'bg-teal-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                    }`
                }
            >
                <cat.icon size={16} className="mr-2" />
                {cat.name}
            </button>
        ))}
    </div>
);

/**
 * Renders a clean vertical list of popular articles.
 */
const PopularArticles = ({ items }) => (
    <div className="space-y-4">
        {items.map((item, idx) => (
            <a
                key={idx}
                href={item.link}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200 group"
            >
                <div className="p-3 rounded-xl bg-teal-50 text-teal-600 mr-4 flex-shrink-0">
                    <item.icon size={20} />
                </div>
                <div className="flex-grow">
                    <h3 className="text-base font-semibold text-gray-800 group-hover:text-teal-700">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                </div>
                <div className="flex flex-col items-end pl-4 text-right flex-shrink-0">
                    <span className="text-xs font-medium text-teal-500">#{item.category}</span>
                    <p className="text-sm text-gray-500 font-medium mt-1">{item.time}</p>
                </div>
            </a>
        ))}
    </div>
);

/**
 * Modal content for the Chatbot with Gemini API integration.
 */
const ChatbotModal = ({ onClose }) => {
    const [messages, setMessages] = useState([{ sender: 'Aura', text: "Hello! I'm Aura, your mental wellness companion. How can I support you today?", id: Date.now() }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(scrollToBottom, [messages]);

    const callGemini = async (query, history) => {
        const chatHistory = history.map(msg => ({
            role: msg.sender === 'User' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const payload = {
            contents: [...chatHistory, { role: 'user', parts: [{ text: query }] }],
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            tools: [{ "google_search": {} }],
        };

        const maxRetries = 3;
        let delay = 1000;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.json();
                    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response right now. Please try again.";
                } else if (response.status === 429 && i < maxRetries - 1) {
                    // Handle rate limiting with exponential backoff
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; // Double the delay for the next attempt
                } else {
                    console.error("Gemini API error:", response.status, await response.text());
                    return "I'm running into a technical difficulty. Please check back in a moment.";
                }
            } catch (error) {
                console.error("Fetch error:", error);
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    return "I'm unable to connect right now. Please check your network connection.";
                }
            }
        }
        return "I'm having trouble connecting to my service. Please try again later.";
    };

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage = input.trim();
        const newUserMessage = { sender: 'User', text: userMessage, id: Date.now() + 1 };
        
        // Add user message immediately and clear input
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        const botResponseText = await callGemini(userMessage, [...messages, newUserMessage]);

        const botResponse = {
            sender: 'Aura',
            text: botResponseText,
            id: Date.now() + 2
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-0 sm:p-8 animate-slideUp">
            <div className="bg-white rounded-xl flex flex-col w-full h-lg  shadow-2xl transition-all duration-600 transform translate-y-0">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-teal-600 rounded-t-xl">
                    <h4 className="text-xl font-bold text-white flex items-center">
                        <MessageCircle size={24} className="mr-2" /> Chat with Aura
                    </h4>
                    <button onClick={onClose} className="text-teal-100 hover:text-white p-1 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Message Area */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${
                                msg.sender === 'User' 
                                    ? 'bg-teal-500 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] p-3 rounded-xl bg-white text-gray-800 rounded-tl-none border border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="h-2 w-2 bg-teal-500 rounded-full animate-bounce delay-75"></div>
                                    <div className="h-2 w-2 bg-teal-500 rounded-full animate-bounce delay-150"></div>
                                    <div className="h-2 w-2 bg-teal-500 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white flex items-center rounded-b-xl">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Say hello to Aura..."
                        rows={1}
                        className="flex-grow p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 outline-none transition-shadow text-sm"
                    />
                    <button
                        onClick={handleSend}
                        className="ml-3 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={input.trim() === '' || isLoading}
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
                    </button>
                </div>
            </div>
            <style jsx="true">{`
                @keyframes slideUp {
                        from {
                            transform: translateY(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                }
                .animate-slideUp {
                        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
            
        </div>
    );
};

/**
 * Floating button component for the Chatbot.
 */
const ChatBot = () => {
    const [showChatbot, setShowChatbot] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowChatbot(true)}
                // Removed fixed positioning
                className="flex flex-col gap-2 items-start text-sm bg-gray-600 text-white font-bold px-5 py-3 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                aria-label="Chat with Aura"
            >
                <MessageCircle size={20} className="mr-2" />
                Chat with Aura
            </button>
            {showChatbot && <ChatbotModal onClose={() => setShowChatbot(false)} />}
        </>
    );
};


/**
 * Sticky button component for immediate crisis intervention.
 */
const CrisisLink = () => {
    const [showModal, setShowModal] = useState(false);

    const Modal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-red-600">Immediate Crisis Support</h4>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-gray-700 my-4">If you are in immediate danger or distress, please use the resources below:</p>
                <div className="space-y-3">
                    <a
                        href="tel:988" // US Suicide & Crisis Lifeline
                        className="flex items-center justify-center w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
                    >
                        <PhoneCall size={20} className="mr-3" />
                        Call 988 (Crisis Lifeline)
                    </a>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); console.log("Directing to local emergency services list."); setShowModal(false); }}
                        className="flex items-center justify-center w-full bg-red-100 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-200 transition"
                    >
                        Find Local Emergency Contacts
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                // Removed fixed positioning
                className="flex flex-col gap-2 items-start text-sm bg-gray-600 text-white font-bold px-5 py-3 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                aria-label="Crisis Support"
            >
                <PhoneCall size={20} className="mr-2" />
                Crisis Support
            </button>
            {showModal && <Modal />}
        </>
    );
};


// --- Main Component ---

const Resources = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    // Filtered resources based on search term and active category
    const filteredResources = resourceItems.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full min-h-screen bg-gray-50 pb-20">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-white w-full p-4 shadow-md z-10 border-b border-gray-100">
                <h3 className="text-center text-2xl font-extrabold text-teal-700">Resources</h3>
            </div>
           
           <div className="py-6 px-5 max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="flex bg-white border-2 border-teal-600 rounded-xl items-center py-3 px-4 mb-4 shadow-md focus-within:shadow-lg transition">
                    <input
                        type="text"
                        placeholder="Search by: title, topic, or mood..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow bg-transparent outline-none px-2 text-gray-700 placeholder-gray-500"
                    />
                    <Search className="w-6 h-6 text-teal-600" />
                </div>

                {/* Category Filters (Styled inside CategoryFilter component) */}
                <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

                {/* Personalized Content Section */}
                <RecommendedContent />

                {/* Featured Resources Grid */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-start mt-8">
                    Featured Resources ({activeCategory})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredResources.length > 0 ? (
                        filteredResources.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link}
                                className="flex flex-col bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition transform hover:-translate-y-0.5 border border-teal-100"
                            >
                                <div className="p-3 rounded-full bg-teal-100 text-teal-700 mb-4 self-start">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-md font-semibold text-gray-800 line-clamp-2">{item.title}</h3>
                                <div className="flex items-center justify-between w-full mt-3">
                                    <span className="text-sm text-teal-600 font-medium">#{item.category}</span>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full py-8 text-center">
                            No resources found for "{searchTerm}" in the "{activeCategory}" category.
                        </p>
                    )}
                </div>

                {/* Popular Content List */}
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-start mt-10">Popular Articles & Guides</h2>
                <PopularArticles items={popularArticles} />

                {/* Non-Sticky Utility Buttons at the bottom */}
                <div className="flex flex-row sm:flex-row gap-4 mt-12 justify-center p-4 border-t border-gray-200">
                    <ChatBot />
                    <CrisisLink />
                </div>
           </div>

        </div>
    );
};

export default Resources;
