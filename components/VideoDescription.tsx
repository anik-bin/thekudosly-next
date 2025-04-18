import { useState, useRef, useEffect } from 'react';

interface VideoDescriptionProps {
    description: string;
}

const VideoDescription = ({ description }: VideoDescriptionProps) => {
    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const contentRef = useRef<HTMLParagraphElement>(null);

    // If no description is provided
    if (!description || description.trim() === '') {
        return (
            <p className="text-gray-400 italic">No description available for this video.</p>
        );
    }

    // Check if content height exceeds the limit
    useEffect(() => {
        if (contentRef.current) {
            setShowToggle(contentRef.current.scrollHeight > 100);
        }
    }, [description]);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <div
                className={`overflow-hidden transition-all duration-300 ${expanded ? '' : 'max-h-[100px]'
                    } relative`}
            >
                <p
                    ref={contentRef}
                    className="text-gray-300 whitespace-pre-line"
                >
                    {description}
                </p>

                {/* Gradient fade effect when collapsed */}
                {!expanded && showToggle && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
                )}
            </div>

            {/* Show toggle button only if content is tall enough */}
            {showToggle && (
                <span
                    onClick={handleToggle}
                    className='mt-2 text-sm cursor-pointer text-gray-400 hover:text-gray-600 z-10'
                >
                    {expanded ? 'Show less' : 'Show more'}
                </span>
            )}
        </div>
    );
};

export default VideoDescription;