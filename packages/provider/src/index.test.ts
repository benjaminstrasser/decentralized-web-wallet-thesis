import { expect, it, test, describe } from 'vitest';

let ethereum: any = {};

describe('ERC1193 examples', () => {
  test('Get chainID', () => {
    ethereum
      .request({ method: 'eth_chainId' })
      .then((chainId) => {
        console.log(`hexadecimal string: ${chainId}`);
        console.log(`decimal number: ${parseInt(chainId, 16)}`);
      })
      .catch((error) => {
        console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
        throw error;
      });
  });

  test('Log last block', () => {
    ethereum
      .request({
        method: 'eth_getBlockByNumber',
        params: ['latest', true]
      })
      .then((block) => {
        console.log(`Block ${block.number}:`, block);
      })
      .catch((error) => {
        console.error(
          `Error fetching last block: ${error.message}.
         Code: ${error.code}. Data: ${error.data}`
        );
      });
  });

  test('Log available accounts', () => {
    ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        console.log(`Accounts:\n${accounts.join('\n')}`);
      })
      .catch((error) => {
        console.error(
          `Error fetching accounts: ${error.message}.
         Code: ${error.code}. Data: ${error.data}`
        );
      });
  });

  test('Log new blocks', () => {
    ethereum
      .request({
        method: 'eth_subscribe',
        params: ['newHeads']
      })
      .then((subscriptionId) => {
        ethereum.on('message', (message) => {
          if (message.type === 'eth_subscription') {
            const { data } = message;
            if (data.subscription === subscriptionId) {
              if ('result' in data && typeof data.result === 'object') {
                const block = data.result;
                console.log(`New block ${block.number}:`, block);
              } else {
                console.error(`Something went wrong: ${data.result}`);
              }
            }
          }
        });
      })
      .catch((error) => {
        console.error(
          `Error making newHeads subscription: ${error.message}.
         Code: ${error.code}. Data: ${error.data}`
        );
      });
  });

  test('accounts', () => {
    ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        console.log(`Accounts:\n${accounts.join('\n')}`);
      })
      .catch((error) => {
        console.error(
          `Error fetching accounts: ${error.message}.
         Code: ${error.code}. Data: ${error.data}`
        );
      });
  });

  test('Example 5: Log when accounts change', () => {
    const logAccounts = (accounts) => {
      console.log(`Accounts:\n${accounts.join('\n')}`);
    };
    ethereum.on('accountsChanged', logAccounts);
    // to unsubscribe
    ethereum.removeListener('accountsChanged', logAccounts);

    // Example 6: Log if connection ends
    ethereum.on('disconnect', (code, reason) => {
      console.log(`Ethereum Provider connection closed: ${reason}. Code: ${code}`);
    });
  });
});
