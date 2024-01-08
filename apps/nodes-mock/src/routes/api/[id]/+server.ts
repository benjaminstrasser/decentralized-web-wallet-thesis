import type { RequestEvent, RequestHandler } from './$types';
import { state } from '../../../libs/state';

export const GET: RequestHandler = async ({ params }: RequestEvent) => {
  const id = params.id;
  console.log(id);
  return new Response(
    JSON.stringify({
      share: state[id]
    })
  );
};

export const POST: RequestHandler = async ({ params, request }: RequestEvent) => {
  const id = params.id;
  const { share } = await request.json();
  console.log(share);
  state[id] = share;
  return new Response(
    JSON.stringify({
      share: state[id]
    })
  );
};
