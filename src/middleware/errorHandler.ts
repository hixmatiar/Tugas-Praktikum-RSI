import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ status: 'fail', message: 'Endpoint Tidak Ditemukan' });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ status: 'fail', message: 'Body Request Bukan JSON Yang Valid' });
    return;
  }

  if (err?.type === 'entity.too.large') {
    res.status(413).json({ status: 'fail', message: 'Body Request Terlalu Besar' });
    return;
  }

  console.error(err);
  res.status(500).json({ status: 'error', message: 'Terjadi Kesalahan Pada Server' });
};