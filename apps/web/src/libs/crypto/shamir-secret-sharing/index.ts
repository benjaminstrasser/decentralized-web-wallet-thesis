import { combine } from './sss/combine'; // cloned from // https://github.com/Shamirs-Wallet/shamirs-secret-sharing-ts
import { split } from './sss/split'; // cloned from // https://github.com/Shamirs-Wallet/shamirs-secret-sharing-ts

export function generateShares(secret: string): Array<Uint8Array> {
	const secretBuffer = Buffer.from(secret);
	// TODO remove deterministic randomness
	const shares = split(secretBuffer, {
		shares: 3,
		threshold: 2,
		random: (size: number) => {
			let array = new Uint8Array(size);
			array = array.map((val, index) => 10);
			return array;
		}
	});
	return shares;
}

export function recoverSeceret(shares: Array<string>): Uint8Array {
	return combine(shares);
}

export function toHexString(byteArray: Uint8Array) {
	return Array.from(byteArray)
		.map(function (byte) {
			return ('0' + (byte & 0xff).toString(16)).slice(-2);
		})
		.join('');
}
