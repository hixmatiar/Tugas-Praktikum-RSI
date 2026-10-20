import { z } from 'zod';

export const requiredString = (field: string) =>
  z.string({
    error: (issue) =>
      issue.input === undefined ? `${field} wajib diisi` : `${field} harus berupa teks`,
  });

export const optionalString = (field: string) =>
  z.string({ error: `${field} harus berupa teks` });

export const requiredInt = (field: string) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined ? `${field} wajib diisi` : `${field} harus berupa angka`,
    })
    .int(`${field} harus berupa bilangan bulat`);

export const coercedInt = (field: string) =>
  z.coerce
    .number({ error: `${field} harus berupa angka` })
    .int(`${field} harus berupa bilangan bulat`);

export const emailField = (maxLength?: number) => {
  let base = requiredString('email').trim().toLowerCase();
  if (maxLength) base = base.max(maxLength, `email maksimal ${maxLength} karakter`);
  return base.pipe(z.email('format email tidak valid'));
};

export const idParamSchema = z.object({
  id: coercedInt('id').positive('id harus lebih dari 0'),
});