// src/services/transcriptService.ts
import { YoutubeTranscript } from "youtube-transcript";
import { fetchTranscript as fetchUnofficial } from "youtube-transcript-plus";


async function fetchOfficialTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(t => t.text).join(" ");
  } catch {
    return "";
  }
}


async function fetchAutoTranscript(videoId: string): Promise<string> {
  try {
    const segments: any = await fetchUnofficial(videoId);
    return segments.map((s: any) => s.text).join(" ");
  } catch {
    return "";
  }
}


export async function getYoutubeTranscript(videoId: string): Promise<string> {
  let transcript = await fetchOfficialTranscript(videoId);

  if (!transcript || transcript.trim() === "") {
    transcript = await fetchAutoTranscript(videoId);
  }

  if (!transcript || transcript.trim() === "") {
    return "Transcript unavailable";
  }

  return transcript;
}