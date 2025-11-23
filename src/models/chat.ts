import { UUID } from "crypto";

export interface Chat {
    id: UUID;
    project_id: UUID;
    title?: string;
    messages: string;
}