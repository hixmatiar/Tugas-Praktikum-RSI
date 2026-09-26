import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get('/', (req, res) => {
  // #swagger.parameters['userId']      = { in: 'query', type: 'integer' }
  // #swagger.parameters['action']      = { in: 'query', type: 'string' }
  // #swagger.parameters['targetTable'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']        = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']       = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar audit log' }
  return auditLogController.getLogs(req, res);
});

auditLogRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditLogInput' } }
  // #swagger.responses[201] = { description: 'Audit log dibuat' }
  return auditLogController.createLog(req, res);
});

export { auditLogRouter };