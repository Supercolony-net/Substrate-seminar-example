import {RedspotUserConfig} from 'redspot/types'
import '@redspot/patract'
import '@redspot/chai'
import '@redspot/gas-reporter'

export default {
    defaultNetwork: 'development',
    contract: {
        ink: {
            toolchain: 'nightly',
            sources: ['contracts/**']
        }
    },
    networks: {
        development: {
            endpoint: 'ws://127.0.0.1:9944',
            gasLimit: '400000000000',
            explorerUrl: 'https://polkadot.js.org/apps/#/explorer/query/?rpc=ws://127.0.0.1:9944/',
            types: {
                ContractsErrorsPsp22Psp22Error: {
                    _enum: { Custom: 'String', InsufficientBalance: null, InsufficientAllowance: null, ZeroRecipientAddress: null, ZeroSenderAddress: null, SafeTransferCheckFailed: 'String' }
                },
            },
        },
        substrate: {
            endpoint: 'ws://127.0.0.1:9944',
            gasLimit: '400000000000',
            accounts: ['//Alice'],
            types: {}
        }
    },
    mocha: {
        timeout: 60000
    }
} as RedspotUserConfig
