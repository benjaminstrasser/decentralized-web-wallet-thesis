import type { RequestEvent, RequestHandler } from './$types';
import { messages, state } from '../../../libs/state';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
  return new Response(JSON.stringify(messages));
};

export const POST: RequestHandler = async ({ params, request }: RequestEvent) => {
  const { message } = await request.json();
  console.log(`POST new message request:\n ${JSON.stringify(message)}`);
  const id = messages.push(message) - 1;
  return new Response(JSON.stringify({ id }), { status: 200 });
};
