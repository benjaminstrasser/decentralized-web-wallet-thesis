export const waitForMessageBuilder: (window: Window) => () => Promise<any> = (window: Window) => {
	return () => {
		return new Promise((resolve, reject) => {
			function handler(event: MessageEvent) {
				if (event.data.target == 'webwallet') {
					window.removeEventListener('message', handler);
					const data = event.data;
					resolve(data);
				}
			}

			window.addEventListener('message', handler);

			//set a timeout to reject the promise if no message is received in a certain time
			setTimeout(() => {
				window.removeEventListener('message', handler);
				reject(new Error('Timeout waiting for message'));
			}, 200000);
		});
	};
};

type BaseAuthMessage = {
	type: string;
};

type ReadyForDataMessage = BaseAuthMessage;

type SuccessMessage = BaseAuthMessage & {
	shard: string;
};
