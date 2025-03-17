import { Loader2 } from "lucide-react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin" size={24} />
            <span className="ml-2">Loading...</span>
        </div>
    );
};

export default Loader;