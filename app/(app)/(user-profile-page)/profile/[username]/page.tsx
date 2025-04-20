"use client";

import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VideoCard from "@/components/VideoCard";
import axios from "axios";
import { Pencil, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    kudos: number;
    about: string;
    spentKudos: number;
    recommendedCount: number;
}

interface Video {
    _id: string;
    title: string;
    thumbnail: string;
    videoId: string;
    channelName: string;
    duration: string;
}

export default function ProfilePage() {
    const { username } = useParams();
    const { data: session} = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
    const [appreciatedVideos, setAppreciatedVideos] = useState<Video[]>([]);
    const [activeTab, setActiveTab] = useState<"recommended" | "appreciated">("recommended");
    const [isEditing, setIsEditing] = useState(false);
    const [about, setAbout] = useState("");

    const isOwnProfile = session?.user?.username === username;

    const fetchProfileData = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(`/api/profile/${username}`);

            if (response.data.success) {
                setProfileData(response.data.profile);
                setAbout(response.data.profile.about);
                setRecommendedVideos(response.data.recommendedVideos || []);
                setAppreciatedVideos(response.data.appreciatedVideos || []);
            } else {
                toast.error("Error", {
                    description: "Failed to load user profile data",
                });
            }
        } catch (error) {
            console.error("Error fetching user profile data: ", error);
            toast.error("Error", {
                description: "Failed to load user profile data",
            });
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchProfileData();
    }, [session, username, fetchProfileData]);

    const handleSaveAbout = async () => {
        if (!isOwnProfile) return;

        try {
            const response = await axios.post("/api/profile/update-about", { about });

            if (response.data.success) {
                setProfileData(prev => prev ? { ...prev, about } : null);
                setIsEditing(false);
                toast.success("Success", {
                    description: "Profile updated successfully",
                });
            } else {
                toast.error("Error", {
                    description: "Failed to update profile",
                });
            }
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast.error("Error", {
                description: "Failed to update user profile",
            });
        }
    };

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className="container mx-auto mt-8 p-4 flex justify-center">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-6">
                {profileData ? (
                    <>
                        {/* Profile Header */}
                        <div className="bg-[#1B1B1A] rounded-lg p-6 mb-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left Column - Profile Picture */}
                                <div className="flex items-center justify-center">
                                    <Avatar className="h-30 w-30 border-4 border-white">
                                        <AvatarImage src={profileData.profilePicture || "/default-avatar.png"} />
                                        <AvatarFallback className="text-4xl">{profileData.username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Right Column - User Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">{profileData.username}</h1>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-[#363634] p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-400">Current Kudos</p>
                                            <p className="text-2xl font-bold">{profileData.kudos}</p>
                                        </div>
                                        <div className="bg-[#363634] p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-400">Videos Recommended</p>
                                            <p className="text-2xl font-bold">{profileData.recommendedCount}</p>
                                        </div>
                                        <div className="bg-[#363634] p-3 rounded-lg text-center">
                                            <p className="text-sm text-gray-400">Kudos Spent</p>
                                            <p className="text-2xl font-bold">{profileData.spentKudos}</p>
                                        </div>
                                    </div>

                                    {/* About Section */}
                                    <div className="bg-[#363634] p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h2 className="text-xl font-semibold">About</h2>
                                            {isOwnProfile && !isEditing && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                            )}
                                            {isOwnProfile && isEditing && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleSaveAbout}
                                                    >
                                                        <Save className="h-4 w-4 mr-1" /> Save
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setAbout(profileData.about || "");
                                                        }}
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <textarea
                                                className="w-full bg-[#484846] rounded-md p-3 text-white"
                                                rows={3}
                                                value={about}
                                                onChange={(e) => setAbout(e.target.value)}
                                                placeholder="Write something about yourself..."
                                            />
                                        ) : (
                                            <p className="text-gray-300">
                                                {profileData.about || "No information provided."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-slate-700 mb-4">
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === "recommended"
                                    ? "text-white border-b-2 border-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                                onClick={() => setActiveTab("recommended")}
                            >
                                Recommended Videos
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${activeTab === "appreciated"
                                    ? "text-white border-b-2 border-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                                onClick={() => setActiveTab("appreciated")}
                            >
                                Appreciated Videos
                            </button>
                        </div>

                        {/* Videos Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeTab === "recommended" ? (
                                recommendedVideos.length > 0 ? (
                                    recommendedVideos.map((video) => (
                                        <div key={video._id} className="flex justify-center">
                                            <VideoCard
                                                title={video.title}
                                                thumbnail={video.thumbnail}
                                                channelName={video.channelName}
                                                duration={video.duration}
                                                videoId={video.videoId}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 col-span-full text-center py-10">
                                        No recommended videos yet.
                                    </p>
                                )
                            ) : appreciatedVideos.length > 0 ? (
                                appreciatedVideos.map((video) => (
                                    <div key={video._id} className="flex justify-center">
                                        <VideoCard
                                            title={video.title}
                                            thumbnail={video.thumbnail}
                                            channelName={video.channelName}
                                            duration={video.duration}
                                            videoId={video.videoId}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 col-span-full text-center py-10">
                                    No appreciated videos yet.
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-10">
                            <h2 className="text-2xl font-bold">Profile Not Found</h2>
                            <p className="text-gray-400 mt-2">This user profile doesn&apos;t exist or is unavailable.</p>
                            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                                Go to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}