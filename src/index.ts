import 'dotenv/config';
import express, { type Request, type Response, type Application } from 'express';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };
import { getDb } from './db/index.ts';
import { authRouter } from './routes/authRouter.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { userRouter } from './routes/userRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditLogRouter } from './routes/auditLogRouter.ts';
import { authMiddleware, roleMiddleware } from './middleware/auth.ts';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.ts';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stalls', stallRouter);
app.use('/api/v1/users', authMiddleware, roleMiddleware('admin'), userRouter);
app.use('/api/v1/menu-items', authMiddleware, roleMiddleware('customer'), menuItemRouter);
app.use('/api/v1/reviews', authMiddleware, roleMiddleware('customer'), reviewRouter);
app.use('/api/v1/likes', authMiddleware, roleMiddleware('customer'), likeRouter);
app.use('/api/v1/flags', authMiddleware, roleMiddleware('customer'), flagRouter);
app.use('/api/v1/audit-logs', authMiddleware, roleMiddleware('admin'), auditLogRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.execute(sql`SELECT 1 AS mantap`);
    res.status(200).json({ status: 'success', message: 'Server dan database terhubung' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});