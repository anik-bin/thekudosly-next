import React from 'react';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
}

const VideoCard = ({ title, thumbnail, channelName, duration }: VideoCardProps) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden w-80 mt-6">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-48"
        />
        {/* Video Duration */}
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs py-0.5 px-2 rounded">
          {duration}
        </span>
      </div>

      {/* Video Details */}
      <div className="mt-2 p-2">
        <p className="text-lg font-semibold line-clamp-2">{title}</p>
        <p className="text-gray-500 text-sm mt-1">Channel: {channelName}</p>
      </div>
    </div>
  );
};

export default VideoCard;