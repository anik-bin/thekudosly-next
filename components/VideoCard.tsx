import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  videoId: string;
}

const VideoCard = ({ title, thumbnail, channelName, duration, videoId }: VideoCardProps) => {
  return (
    <div className="block rounded-lg shadow-md overflow-hidden w-80 mt-6 transition-transform hover:scale-105">
      <Link href={`/video/yt/${videoId}`} className="block h-full">
        {/* Thumbnail Container with Fixed Aspect Ratio */}
        <div className="relative aspect-video w-full">
          {/* Next.js Image for better optimization */}
          <img
            src={thumbnail}
            alt={title}
            className="object-contain w-full h-full"
            loading="lazy"
          />
          {/* Video Duration */}
          <span className="absolute bottom-2 right-2 bg-black text-white text-xs py-0.5 px-2 rounded">
            {duration}
          </span>
        </div>

        {/* Video Details */}
        <div className="p-3">
          <h3 className="text-lg font-semibold line-clamp-2 mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">Channel: {channelName}</p>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;