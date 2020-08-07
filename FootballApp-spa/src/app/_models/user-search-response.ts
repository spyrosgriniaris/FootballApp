import { User } from './user';

export interface UserSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: User[];
}