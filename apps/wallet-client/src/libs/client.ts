import { ethers } from 'ethers';
// import {TransactionRequest} from "@ethersproject/abstract-provider";

// https://docs.ethers.io/v5/api/providers/other/#Web3Provider--ExternalProvider
export class WalletProvider implements ethers.providers.ExternalProvider {
	isMetaMask = false;
	isStatus?: boolean;
	host?: string;
	path?: string;

	provider: ethers.providers.JsonRpcProvider;

	signer: ethers.Wallet;

	constructor() {
		this.host = 'http://127.0.0.1:8545';
		this.provider = new ethers.providers.JsonRpcProvider(this.host);
		this.signer = new ethers.Wallet(
			'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
			this.provider
		);
	}

	// sendAsync(request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void): void {
	//     this.provider.send(request.method, request.params ?? [])
	//         .then(value => {
	//             callback(undefined, value)
	//         })
	//         .catch(error => {
	//             callback(error, undefined)
	//         })
	// }
	//
	// send(request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void): void {
	//     this.provider.send(request.method, request.params ?? [])
	//         .then(value => {
	//             callback(undefined, value)
	//         })
	//         .catch(error => {
	//             callback(error, undefined)
	//         })
	// }

	//This follows the EIP-1193 API signature.
	async request(request: { method: string; params?: Array<unknown> }): Promise<unknown> {
		let response;
		switch (request.method) {
			case 'eth_accounts':
				return [this.signer.address];
			case 'eth_sendTransaction':
				// eslint-disable-next-line no-case-declarations
				const signature = await sendMessage(request.params);
				// eslint-disable-next-line no-case-declarations
				const sentTransaction = await this.provider.sendTransaction(signature);
				return sentTransaction.hash;

			default:
				// We just assume that our rpc node will handle all calls except accoutns and sending transactions
				response = await this.provider.send(request.method, request.params ?? []);
				console.log(`${request.method}: ${response}`);
				return response;
		}
	}
}

async function sendMessage(params: unknown): Promise<string> {
	const response = await fetch('http://localhost:9090/api/message', {
		method: 'POST',
		body: JSON.stringify({ message: params })
	});
	const json = await response.json();
	const id = json.id;

	return new Promise((resolve) => {
		const timer = setInterval(async () => {
			const response = await fetch(`http://localhost:9090/api/response/${id}`, {
				method: 'GET'
			});

			const json = await response.json();
			const responseMessage = json.response;
			if (responseMessage) {
				clearInterval(timer);
				resolve(responseMessage);
			}
		}, 1000);
	});
}
