import { Search, BookOpen, Video, FileText } from "lucide-react";

const resourceItems = [
    {
        type: "Article",
        icon: FileText,
        title: "Understanding Anxiety",
        description: "A comprehensive guide to recognizing and managing anxiety symptoms.",
        link: "#"
    },
    
    {
        type: "Book",
        icon: BookOpen,
        title: "Mindfulness for Beginners",
        description: "An easy-to-follow book for starting your mindfulness journey.",
        link: "#"
    },
    {
        type: "Video",
        icon: Video,
        title: "Guided Meditation",
        description: "A 10-minute video to help you relax and refocus.",
        link: "#"
    }
];

const RecommendedContent = () => {
    const contentData = [
        {
          cardImg: "https://placehold.co/300x160/2c3e50/ffffff?text=Mindfulness+Guide",
          cardTitle: "Guided Relaxation for Sleep",
          cardText: "A 15-minute audio session to prepare your mind for a deep, restful night.",
          cardBtn: <button className="rounded-full border-none bg-teal-600 text-white">read article</button>
        },
        {
          cardImg: "https://placehold.co/300x160/3498db/ffffff?text=Stress+Buster",
          cardTitle: "5 Tips to Manage Work Stress",
          cardText: "Quick and actionable strategies to maintain balance during busy weeks.",
          cardBtn: <button className="rounded-full border-none bg-teal-600 text-white">read article</button>
        },
        {
          cardImg: "https://placehold.co/300x160/95a5a6/333333?text=Coping+Skills",
          cardTitle: "Beginner's Guide to Journaling",
          cardText: "Learn how to structure your entries to maximize emotional clarity.",
          cardBtn: <button className="rounded-full border-none bg-teal-600 text-white" >read article</button>
        },
        {
          cardImg: "https://placehold.co/300x160/e74c3c/ffffff?text=Therapy+Intro",
          cardTitle: "Understanding Teletherapy",
          cardText: "Your questions answered about meeting with a mental health professional online.",
          cardBtn: <button className="rounded-full border-none bg-teal-600 text-white">read article</button>
        }
    ];
     
    return (
        <div className="my-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-start">Recommended Articles</h3>
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 scrollbar-hide">
                {contentData.map((data, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-start bg-white p-4 rounded-xl shadow-md border border-gray-100 h-full hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex flex-col space-y-3 h-full">
                            <div className="h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                    src={data.cardImg} 
                                    alt={data.cardTitle} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x160/f0f0f0/333333?text=Content+Card"; }}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">{data.cardTitle}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{data.cardText}</p>
                            {data.cardBtn}
                        </div>
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

const Resources = () => {
    return (
        <div className="w-full py-3 px-3">
            <div className="flex bg-[#f4f5f6] border-2 border-teal-300 rounded-full items-center justify-center py-4 px-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by title or topic"
                    className="flex-grow bg-transparent outline-none px-2"
                />
                <Search className="w-6 h-6 text-teal-700" />
            </div>

            {/* Recommended articles */}
                
            <RecommendedContent />
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-start">Featured Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resourceItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.link}
                        className="flex items-center bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
                    >
                        
                        <div className="flex flex-col text-start text-sm antialiased ... h-24">
                            <div className="p-3 rounded-full bg-teal-100 text-teal-700 mr-4">
                                <item.icon size={18} />
                            </div>
                            <h3 className="font-semibold text-gray-800">{item.title}</h3>
                            {/* <p className="text-sm text-gray-600">{item.description}</p> */}
                            <span className="text-xs text-teal-600">{item.type}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Resources;

