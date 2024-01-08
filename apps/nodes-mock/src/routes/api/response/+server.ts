import type { RequestEvent, RequestHandler } from './$types';
import { responses } from '../../../libs/state';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
  return new Response(JSON.stringify(responses));
};
