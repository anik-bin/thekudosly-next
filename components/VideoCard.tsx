import React from 'react'

interface VideoCardProps {
  title: string;
  thumbnail: string;
  channelName: string;
}

const VideoCard = ({title, thumbnail, channelName}: VideoCardProps) => {
  return (
    <div className="rounded-lg shadow-md overflow-hidden w-80 mt-6">
      {/* Thumbnail */}
      <div>
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-48"
        />
      </div>

      {/* Video Details */}
      <div className="mt-2">
        <p className="text-lg font-semibold line-clamp-2">{title}</p>
        <p className="text-gray-500 text-sm mt-1">Channel: {channelName}</p>
      </div>
    </div>
  );
}

export default VideoCard