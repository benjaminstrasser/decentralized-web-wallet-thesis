<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	function createUri(
		baseUrl: string,
		params: {
			clientId: string;
			responseType: string;
			redirectUri: string;
			state: string;
			scope: string;
		}
	): string {
		const queryParams = new URLSearchParams({
			client_id: params.clientId,
			response_type: params.responseType,
			redirect_uri: params.redirectUri,
			state: params.state,
			scope: params.scope
		});

		return `${baseUrl}?${queryParams.toString()}`;
	}

	const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
	const params = {
		clientId: '304425139442-s4tn37f5qalrc0esi5git4n17clthddg.apps.googleusercontent.com',
		responseType: 'token',
		redirectUri: 'http://localhost:5173/authresponse',
		state: 'google-auth',
		scope: 'https://www.googleapis.com/auth/drive.file'
	};

	const uri = createUri(baseUrl, params);

	onMount(async () => {
		window.location.href = uri;
	});
</script>

{uri}
