import { memoizedDecodeFunction4Byte } from './4byte-decoder-service';
import type { FunctionInfo } from './types';
import { ethers } from 'ethers';

export async function decodeFunction(
	data: string,
	functions: Map<string, FunctionInfo>
): Promise<FunctionInfo> {
	const sigHash = getSigHash(data);

	if (data === '0x') {
		return {
			contractName: 'Transfer',
			signature: 'Transfer'
		};
	}

	let fnInfo = functions[sigHash] ?? (await memoizedDecodeFunction4Byte(sigHash));
	//const iface = new ethers.utils.Interface(fnInfo.signature);
	//const result = iface.decodeFunctionData(fnInfo.signature, data);

	const abiCoder = new ethers.utils.AbiCoder();
	const types = getFuntionTypesFromSignature(fnInfo.signature);
	const values = abiCoder.decode(types, getRawParams(data));
	console.log(null);

	return fnInfo;
}

// This function gets the types of the parameters of a function from the signature.
// example setGreeting(string) => [string]
// example setGreeting(string, uint256) => [string, uint256]
function getFuntionTypesFromSignature(signature: string) {
	const types = signature.substring(signature.indexOf('(') + 1, signature.indexOf(')'));
	return types.split(',');
}

export function getSigHash(data: string): string {
	if (data.length < 10) return '';
	return data.substring(0, 10);
}

export function getSigBytes(data: string): string {
	if (data.length < 10) return '';
	return data.substring(2, 9);
}

export function getRawParams(data: string): string {
	return '0x' + data.substring(10);
}
