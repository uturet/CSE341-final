import type { UUID } from "crypto";

export interface Video {
    id: UUID;
    project_id: UUID;
    title?: string;
    channel_id?: string;
    yt_id: string;
    description?: string;
    captions?: string
    length?: number;
    views?: number;
  }