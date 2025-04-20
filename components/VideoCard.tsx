import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  videoId: string;
  kudosCount?: number;
}

const VideoCard = ({ title, thumbnail, channelName, duration, videoId, kudosCount }: VideoCardProps) => {
  return (
    <div className="block rounded-lg shadow-md overflow-hidden w-full max-w-[320px] mt-4 sm:mt-6 transition-transform hover:scale-105">
      <Link href={`/video/yt/${videoId}`} className="block h-full">
        {/* Thumbnail Container with Fixed Aspect Ratio */}
        <div className="relative aspect-video w-full">
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
          <h3 className="text-base sm:text-lg font-semibold line-clamp-2 mb-1">{title}</h3>
          <div className='flex flex-row items-center gap-2 sm:gap-4 pt-2'>
            {/* Kudos count badge (if available) */}
            {kudosCount !== undefined && kudosCount >= 0 && (
              <div className="bg-black bg-opacity-70 text-white text-xs rounded-full flex items-center px-2 py-1">
                <Image src="/icon.png" alt="kudos" width={16} height={16} className="mr-1" />
                <span>{kudosCount}</span>
              </div>
            )}
            <p className="text-gray-500 text-xs sm:text-sm truncate">Channel: {channelName}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;