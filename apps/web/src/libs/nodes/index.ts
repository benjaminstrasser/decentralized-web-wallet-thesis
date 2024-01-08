import {toHexString } from '../crypto/shamir-secret-sharing';

export async function postShare(id: number, share: Uint8Array) {
  return (
    await fetch(`http://localhost:9090/api/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        share: toHexString(share)
      })
    })
  ).json();
}

export async function getShare(id: number) {
  const result = await fetch(`http://localhost:9090/api/${id}`, {
    method: 'GET'
  });

  const json = await result.json();
  return json;
}
