import { Photo } from './photo';

export interface User {
    id: number;
    userName: string;
    knownAs: string;
    age: number;
    gender: string;
    created: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    // optional variables must come after required
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
    roles?: string[];
    totalLikes?: number;
    positions?: string[];
    fullName?: string;
    placeOfBirth?: string;
    height?: number;
    citizenship?: string;
    foot?: string;
    currentClub?: string;
    facebookUrl?: string;
    instagramUrl: string;
    twitterUrl?: string;
    role?: string;
}