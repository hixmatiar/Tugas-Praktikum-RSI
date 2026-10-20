import 'dotenv/config';
import bcrypt from 'bcrypt';

const readEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} belum diatur di .env`);
  return value;
};

export const BCRYPT_COST = Number(readEnv('BCRYPT_COST'));
export const BCRYPT_PREFIX = readEnv('BCRYPT_PREFIX');

if (!Number.isInteger(BCRYPT_COST) || BCRYPT_COST < 4 || BCRYPT_COST > 31) {
  throw new Error('BCRYPT_COST harus bilangan bulat 4 sampai 31');
}

const expectedPrefix = `$2b$${String(BCRYPT_COST).padStart(2, '0')}$`;
if (BCRYPT_PREFIX !== expectedPrefix) {
  throw new Error(
    `BCRYPT_PREFIX (${BCRYPT_PREFIX}) tidak cocok dengan BCRYPT_COST (${BCRYPT_COST}). Seharusnya ${expectedPrefix}`,
  );
}

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PASSWORD_HASH_REGEX = new RegExp(`^${escapeRegex(BCRYPT_PREFIX)}[./A-Za-z0-9]{53}$`);

export const isValidPasswordHash = (value: unknown): value is string =>
  typeof value === 'string' && PASSWORD_HASH_REGEX.test(value);


export const assertValidPasswordHash = (value: unknown): void => {
  if (!isValidPasswordHash(value)) {
    throw new Error(`INVALID_PASSWORD_HASH: password_hash harus berawalan ${BCRYPT_PREFIX}`);
  }
};

export const hashPassword = async (plain: string): Promise<string> => {
  const hash = await bcrypt.hash(plain, BCRYPT_COST);
  assertValidPasswordHash(hash);
  return hash;
};