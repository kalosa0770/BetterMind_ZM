import { Search } from "lucide-react";

const Resources = () => {
    return (
        <div className="flex w-100 bg-">
            <input type="text" placeholder="Title, topic" className="border-2 border-teal-300 rounded-full w-100 items-center justify-center py-4 px-4"/>
            <Search  className="w-6 h-6"/>
            <p>Hello</p>
            
        </div>
    )
}

export default Resources;

