import type { UUID } from "crypto";

export interface Channel {
    id: UUID;
    name?: string;
    ytid: string;
}