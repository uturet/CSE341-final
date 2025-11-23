import type { UUID } from "crypto";

export interface User {
    id: UUID;
    email: string;
    password: string;
}