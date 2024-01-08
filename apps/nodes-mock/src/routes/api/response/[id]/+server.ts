import type { RequestEvent, RequestHandler } from './$types';
import { responses } from '../../../../libs/state';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
  const id = params.id;
  return new Response(JSON.stringify({ response: responses[id] }));
};

export const POST: RequestHandler = async ({ params, request }: RequestEvent) => {
  const id = params.id;
  const { message } = await request.json();
  responses[id] = message;
  return new Response(null, { status: 200 });
};
