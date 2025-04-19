import "next-auth";
import { DefaultSession} from "next-auth";

declare module "next-auth" {

    interface User {
        _id?: string;
        username?: string;
        kudos?: number;
        lastKudosRefresh?: number;
        about?: string;
    }
    
    interface Session {
        user: {
            _id?: string;
            username?: string;
            kudos?: number;
            lastKudosRefresh?: number;
            about?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    kudos?: number;
    lastKudosRefresh?: number;
    about?: string;
  }
}