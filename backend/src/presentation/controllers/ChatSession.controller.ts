import { Request, Response } from 'express';
import { ChatSessionService } from '../../services/ChatSession.service';
import { CreateMessageDTO } from '../../dto/Message.dto';

export class ChatSessionController {
  private chatSessionService: ChatSessionService;

  constructor() {
    this.chatSessionService = new ChatSessionService();
  }

  createSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.chatSessionService.createSession();
      res.status(201).json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const session = await this.chatSessionService.getSession(sessionId);

      if (!session) {
        res.status(404).json({ error: 'Chat session not found' });
        return;
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await this.chatSessionService.getAllSessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const { status } = req.body;

      if (!status || !['Pending', 'Confirmed', 'Completed'].includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const session = await this.chatSessionService.updateStatus(sessionId, { status });

      if (!session) {
        res.status(404).json({ error: 'Chat session not found' });
        return;
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const { content } = req.body;

      if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'Message content is required' });
        return;
      }

      const messageData: CreateMessageDTO = {
        content,
        sender: 'customer',
      };

      const message = await this.chatSessionService.createMessage(sessionId, messageData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const messages = await this.chatSessionService.getMessages(sessionId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createAdminMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      const { content } = req.body;

      if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'Message content is required' });
        return;
      }

      const messageData: CreateMessageDTO = {
        content,
        sender: 'admin',
      };

      const message = await this.chatSessionService.createMessage(sessionId, messageData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

