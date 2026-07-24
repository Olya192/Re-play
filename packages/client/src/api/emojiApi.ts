import { HTTPTransport } from '@/api/httpTransport';
import { Emoji } from '@/types/forum';

export const EMOJI_API_URL = '/emoji';

const apiInstance = new HTTPTransport();

class EmojiApi {
  async getAll(): Promise<Emoji[]> {
    const response = await apiInstance.get(EMOJI_API_URL, { isAppHost: true });

    return (response as Emoji[]) ?? [];
  }
}

export const emojiApi = new EmojiApi();
