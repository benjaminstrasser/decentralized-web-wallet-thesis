<script lang="ts">
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import { provider } from '../libs/blockchain';
	import { recoverSeceret, generateShares } from '../libs/crypto/shamir-secret-sharing';
	import { getShare } from '../libs/nodes';
	import { decodeFunction } from '../libs/blockchain/4byte-decoder';
	import type { FunctionInfo } from '../libs/blockchain/4byte-decoder';
	import { goto } from '$app/navigation';
	import { waitForMessageBuilder } from '../libs/auth';

	const waitForMessage = waitForMessageBuilder(window);

	let serverShares: { [key: number]: string } = {};
	let mnemonic: string;
	let wallet: ethers.Wallet;

	async function load(id: number) {
		serverShares[id - 1] = (await getShare(id)).share;
		await update();
	}

	async function update() {
		try {
			let uint8shares = Object.values(serverShares) as string[];
			let interMmnemonic = recoverSeceret(uint8shares);
			wallet = ethers.Wallet.fromMnemonic(interMmnemonic.toString());
			mnemonic = wallet.mnemonic.phrase;
		} catch (e) {
			console.log(e);
		}
	}

	let messages: any[] = [];
	let responses: any[] = [];
	let decodedFunctions: FunctionInfo[] = [];

	setInterval(() => {
		loadMessages();
	}, 1000);

	async function loadMessages() {
		let messageResponse = await fetch('http://localhost:9090/api/message', { method: 'GET' });
		messages = await messageResponse.json();

		// Here we could add custom known funtions to decode, which might not be known by the 4byte decoder or if we want to overwrite a specific funtion
		let customFunctions = new Map();

		messages.map(async (item, index) => {
			let decoded = await decodeFunction(item[0].data, customFunctions);
			decodedFunctions[index] = decoded;
		});

		let responseresponse = await fetch('http://localhost:9090/api/response', { method: 'GET' });
		responses = await responseresponse.json();
	}

	$: address = wallet?.address;
	$: balance = address ? provider.getBalance(address) : 0;

	async function sign(item, index) {
		const nonce = await provider.getTransactionCount(address);
		const gasPrice = await provider.getGasPrice();

		const modifiedItem = {
			from: item.from,
			to: item.to,
			data: item.data,
			gasLimit: item.gas,
			nonce: nonce,
			gasPrice
		};
		const signedMesssage = await wallet.signTransaction(modifiedItem);
		fetch(`http://localhost:9090/api/response/${index}`, {
			method: 'POST',
			body: JSON.stringify({ message: signedMesssage })
		});
	}

	async function loadFromGoogle(): any {
		const newWindow = window.open('/auth', 'popup', 'popup=true');

		let message = await waitForMessage();
		if (message.type != 'REQUEST_STATE') {
			console.log('error wrong message');
		}
		newWindow?.postMessage({ type: 'STATE', state: 'LOAD', target: 'webwallet' });

		message = await waitForMessage();
		if (message.type != 'SUCCESS') {
			console.log('error wrong message');
		}

		debugger;
		serverShares[2] = message.shard;

		newWindow?.close();
	}
</script>

<h1>Your Wallet</h1>

<button
	on:click={() => {
		goto('/register');
	}}>Register</button
>

{#if !mnemonic}
	<div class="grid">
		{#if !serverShares[0]}
			<button on:click={() => load(1)}>Load Node 1</button>
		{:else}
			<button disabled>Already Loaded Node 1</button>
		{/if}

		{#if !serverShares[1]}
			<button on:click={() => load(2)}>Load Node 2</button>
		{:else}
			<button disabled>Already Loaded Node 2</button>
		{/if}

		{#if !serverShares[2]}
			<button class="contrast" on:click={() => loadFromGoogle()}>
				<img
					class="google-icon-svg"
					src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
				/>Load from Google</button
			>
		{:else}
			<button class="contrast" disabled>
				<img
					class="google-icon-svg"
					src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
				/>Loaded From Google</button
			>
		{/if}
	</div>
{/if}

{#if mnemonic}
	<div class="grid">
		<div>Address: {address}</div>
		{#await balance}
			Balance: Loading
		{:then value}
			Balance: {ethers.utils.formatEther(value)} Ether
		{/await}
	</div>

	<article>
		<header>Pending Transactions</header>
		<table>
			<thead>
				<th>from</th>
				<th>to</th>
				<th>gas</th>
				<th>transaction</th>
				<th>signature</th>
				<th />
			</thead>
			<tbody>
				<!-- {#each messages as item, index}
					<tr>
						<details open>
							<summary>Accordion 2</summary>
							<ul>
								<li>…</li>
								<li>…</li>
							</ul>
						</details>
					</tr>
				{/each} -->
				{#each messages as item, index}
					<tr>
						<td>{item[0].from}</td>
						<td>{item[0].to}</td>
						<td>{item[0].gas}</td>
						<td>{decodedFunctions[index].signature}</td>
						<td>
							{#if responses[index]}
								Signed
							{:else}
								<button on:click={() => sign(item[0], index)}>Sign</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</article>
{/if}

<style lang="css">
	table {
		width: 100%;
	}
	td {
		min-width: 150px;
		overflow-wrap: anywhere;
	}
</style>
