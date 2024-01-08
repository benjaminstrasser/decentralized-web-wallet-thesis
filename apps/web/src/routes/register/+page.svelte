<script lang="ts">
	import { ethers } from 'ethers';
	import { getShare, postShare } from '../../libs/nodes';
	import { generateShares, toHexString } from '../../libs/crypto/shamir-secret-sharing';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { waitForMessageBuilder } from '../../libs/auth';

	let mnemonic: string;
	let shares: Array<Uint8Array>;

	let serverShares: (Uint8Array | undefined)[] = [];

	const waitForMessage = waitForMessageBuilder(window);

	async function generateMnemonic() {
		//mnemonic = ethers.Wallet.createRandom().mnemonic.phrase
		// for now not random to make development easier. Its always the same hardcoded mnemomic
		mnemonic = 'test test test test test test test test test test test junk';
		shares = generateShares(mnemonic);
	}

	async function register(id: number) {
		const share = shares[id - 1];
		const response = await postShare(id, share);
		serverShares[id - 1] = share;
	}

	async function registerGoogle() {
		const newWindow = window.open('/auth', 'popup', 'popup=true');

		let message = await waitForMessage();
		if (message.type != 'REQUEST_STATE') {
			console.log('error wrong message');
		}
		newWindow?.postMessage({ type: 'STATE', state: 'REGISTER', target: 'webwallet' });

		message = await waitForMessage();
		if (message.type != 'REQUEST_SHARD') {
			console.log('error wrong message');
		}
		newWindow?.postMessage({ type: 'SHARD', shard: toHexString(shares[2]), target: 'webwallet' });

		message = await waitForMessage();
		if (message.type != 'SUCCESS') {
			console.log('error wrong message');
		}

		serverShares[2] = message.shard;

		newWindow?.close();
	}

	let allRegistered = false;
	$: allRegistered =
		serverShares[0] != undefined && serverShares[1] != undefined && serverShares[2] != undefined;
</script>

<h1 style="">Wallet Registration</h1>

<button on:click={generateMnemonic}>Generate Mnemonic</button>
<input style="text-align:center;" type="text" disabled bind:value={mnemonic} />

{#if mnemonic}
	<div class="grid">
		{#if !serverShares[0]}
			<button on:click={() => register(1)}>Register Node 1</button>
		{:else}
			<button disabled>Already Registered Node 1</button>
		{/if}

		{#if !serverShares[1]}
			<button on:click={() => register(2)}>Register Node 2</button>
		{:else}
			<button disabled>Already Registered Node 2</button>
		{/if}

		{#if !serverShares[2]}
			<button class="contrast" on:click={() => registerGoogle()}>
				<img
					class="google-icon-svg"
					src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
				/>
				Signup with Google
			</button>
		{:else}
			<button class="contrast" disabled>
				<img
					class="google-icon-svg"
					src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
				/>
				Signed up</button
			>
		{/if}
	</div>
{/if}

{#if allRegistered == true}
	<button on:click={() => goto('/')}>Continue to Wallet</button>
{/if}
