// src/services/youtube/channelService.ts
import { youtube } from "../clients/youtube";

export async function getChannelById(channelId: string) {
  const res = await youtube.channels.list({
    part: ["snippet"],
    id: [channelId],
  });

  const channel = res.data.items?.[0];
  if (!channel) return null;

  return {
    ytChannelId: channel.id!,
    name: channel.snippet?.title ?? null,
  };
}