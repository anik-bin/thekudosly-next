import mongoose, { Schema, model, models, Document } from "mongoose";

export interface Video extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    thumbnail: string;
    videoUrl: string;
    videoId: string;
    channelName: string;
    description: string;
    duration: string;
    submittedBy: mongoose.Types.ObjectId;
    kudosCount: number;
    appreciatedBy: mongoose.Types.ObjectId[];
}

const videoSchema: Schema<Video> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        thumbnail: {
            type: String,
            required: [true, "Thumbnail is required"],
        },
        videoUrl: {
            type: String,
            unique: true,
            required: [true, "Video URL is required"],
            match: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
        },
        videoId: {
            type: String,
            required: [true, "Video ID is required"],
            unique: true,
            index: true,
        },
        channelName: {
            type: String,
            required: [true, "Channel name is required"],
        },
        description: {
            type: String,
            default: "",
        },
        duration: {
            type: String,
            default: "0:00",
        },
        submittedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Submitted By is required"],
        },
        kudosCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        appreciatedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
)

const VideoModel = models?.Video as mongoose.Model<Video> || model<Video>("Video", videoSchema);

export default VideoModel;