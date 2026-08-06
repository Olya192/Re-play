import { Request, Response } from 'express';

export type SseEventType = 'comment' | 'reaction';

export interface SseEvent {
  type: SseEventType;
  topicId: number;
  author: string;
  timestamp: number;
}

const HEARTBEAT_INTERVAL_MS = 25000;

const RECONNECT_TIMEOUT_MS = 3000;

export class SseService {
  private static clients = new Set<Response>();

  public static attach = (req: Request, res: Response): void => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    res.write(`retry: ${RECONNECT_TIMEOUT_MS}\n\n`);

    SseService.clients.add(res);

    const heartbeat = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch (error) {
        console.error('SSE: не удалось отправить heartbeat', error);
        SseService.removeClient(res, heartbeat);
      }
    }, HEARTBEAT_INTERVAL_MS);

    req.on('close', () => {
      SseService.removeClient(res, heartbeat);
    });
  };

  public static broadcast = (event: SseEvent): void => {
    const payload = `data: ${JSON.stringify(event)}\n\n`;

    SseService.clients.forEach((client) => {
      try {
        client.write(payload);
      } catch (error) {
        console.error('SSE: не удалось отправить событие клиенту', error);
        SseService.clients.delete(client);
      }
    });
  };

  private static removeClient = (
    res: Response,
    heartbeat: ReturnType<typeof setInterval>
  ): void => {
    clearInterval(heartbeat);
    SseService.clients.delete(res);
  };
}
