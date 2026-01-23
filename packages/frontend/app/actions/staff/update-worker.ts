'use server';

import { db, eq, users } from 'database';

import { getToken, verifyToken } from '@/lib/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateWorker(previousState: any, formData: FormData) {
  const token = await getToken();
  if (!token) {
    return { error: 'Unauthorized' };
  }

  const decodedToken = await verifyToken(token);
  if (!decodedToken) {
    return { error: 'Unauthorized' };
  }

  if (decodedToken.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const workerId = formData.get('workerId');
  if (!workerId) {
    return { error: 'Worker ID is required' };
  }

  const worker = await db.query.users.findFirst({
    where: eq(users.id, workerId as string),
  });

  if (!worker) {
    return { error: 'Worker not found' };
  }

  const role = formData.get('role') as 'ADMIN' | 'USER';

  await db
    .update(users)
    .set({
      role: role,
    })
    .where(eq(users.id, workerId as string));

  return { success: 'Worker updated successfully' };
}
