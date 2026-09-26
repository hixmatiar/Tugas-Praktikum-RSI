import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(auditLogService: AuditLogService = new AuditLogService()) {
    this.auditLogService = auditLogService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'AUDIT_LOG_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Audit log tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getLogs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const action = typeof req.query.action === 'string' ? req.query.action : undefined;
      const targetTable = typeof req.query.targetTable === 'string' ? req.query.targetTable : undefined;

      const { data, total } = await this.auditLogService.getAllLogs({ userId, action, targetTable, page, limit });

      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createLog = async (req: Request, res: Response): Promise<Response> => {
    try {
      const log = await this.auditLogService.createLog(req.body);
      return res.status(201).json({ status: 'success', data: log });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}