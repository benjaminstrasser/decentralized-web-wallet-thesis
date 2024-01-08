<script lang="ts">
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { waitForMessageBuilder } from '../../libs/auth';

	const fileName = 'webwallet_shard.txt';

	const code = '4/0AfJohXkkg6pd5crlVov60lGXffroJEVxdj7WAr4qRWOlzM7nXkKGWhfUMrx0XzGboQMViw';
	const waitForMessage = waitForMessageBuilder(window);

	async function register(bearerToken: string) {
		await window.opener.postMessage({ type: 'REQUEST_SHARD', target: 'webwallet' });
		const keyShard = (await waitForMessage()).shard;
		await writeFile(bearerToken, keyShard);
		await window.opener.postMessage({ type: 'SUCCESS', shard: keyShard, target: 'webwallet' });
	}

	async function writeFile(bearerToken: string, content: string): Promise<void> {
		const existingFilesResponse = await fetch(
			'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(`name='${fileName}'`),
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`
				}
			}
		);
		const existingFilesData = await existingFilesResponse.json();

		const files = existingFilesData.files;

		debugger;
		if (files && files.length > 0) {
			// File exists, overwrite its content
			const fileId = files[0].id;

			await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					'Content-Type': 'text/plain'
				},
				body: content
			});
			return;
		} else {
			// File doesn't exist, create it
			const fileMetadata = {
				name: fileName,
				mimeType: 'text/plain'
			};

			const fileContentBlob = new Blob([content], { type: 'text/plain' });
			const form = new FormData();
			form.append(
				'metadata',
				new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' })
			);
			form.append('file', fileContentBlob);

			await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${bearerToken}`
				},
				body: form
			});
		}
	}

	async function getContent(bearerToken: string): Promise<string> {
		const existingFilesResponse = await fetch(
			'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(`name='${fileName}'`),
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`
				}
			}
		);
		const existingFilesData = await existingFilesResponse.json();

		const files = existingFilesData.files;

		if (files && files.length > 0) {
			// File exists, fetch its content
			const fileId = files[0].id;
			const fileResponse = await fetch(
				`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
				{
					headers: {
						Authorization: `Bearer ${bearerToken}`
					}
				}
			);

			const text = await fileResponse.text();
			await window.opener.postMessage({ type: 'SUCCESS', shard: text, target: 'webwallet' });
		}
		throw new Error(`File "${fileName}" does not exist.`);
	}

	async function sendError(reason: string) {
		// TODO
	}

	function parseFragment() {
		const fragment = window.location.hash.substring(1); // Remove the '#'
		const pairs = fragment.split('&');
		const result: { [key: string]: string } = {};

		pairs.forEach((pair) => {
			const [key, value] = pair.split('=');
			result[decodeURIComponent(key)] = decodeURIComponent(value);
		});

		return result;
	}

	onMount(async () => {
		const params = parseFragment();
		if (!params.access_token) {
			sendError('error authenticating user');
			return;
		}

		await window.opener.postMessage({ type: 'REQUEST_STATE', target: 'webwallet' });
		const state = (await waitForMessage()).state;

		switch (state) {
			case 'REGISTER':
				await register(params.access_token);
				break;
			case 'LOAD':
				await getContent(params.access_token);
				break;
			default:
				// error uknown state
				break;
		}
	});
</script>

{code}
