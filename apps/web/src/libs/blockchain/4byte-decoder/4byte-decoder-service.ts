import type { FunctionInfo } from './types';
import memoize from 'memoizee';

export async function decodeFunction4Byte(sigHash: string): Promise<FunctionInfo | null> {
	const response = await fetch(
		`https://www.4byte.directory/api/v1/signatures/?hex_signature=${sigHash}`
	);

	const responseData = await response.json();
	if (responseData.results.length == 0) {
		return null;
	} else {
		return {
			contractName: null,
			signature: responseData.results[0].text_signature
		} as FunctionInfo;
	}
}

export const memoizedDecodeFunction4Byte = memoize(
	(sigHash: string) => {
		return decodeFunction4Byte(sigHash);
	},
	{ promise: true, max: 10000 }
);
