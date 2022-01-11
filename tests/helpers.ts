import BN from 'bn.js'
import { expect } from 'chai'
import { artifacts, network, patract } from 'redspot'
import camelCase from 'lodash/camelCase'
import Contract from '@redspot/patract/contract'
import {TransactionParams} from "@redspot/patract/types";

const { getContractFactory, getRandomSigner } = patract
const { api, getSigners, getAddresses } = network
export { expect } from './setup/chai'

export const setupContract = async (name, constructor, ...args) => {
    const one = new BN(10).pow(new BN(api.registry.chainDecimals[0]))
    const signers = await getSigners()
    const defaultSigner = await getRandomSigner(signers[0], one.muln(10000))
    const alice = await getRandomSigner(signers[1], one.muln(10000))

    const contractFactory = await getContractFactory(name, defaultSigner)
    const contract = await contractFactory.deploy(constructor, ...args)
    const abi = artifacts.readArtifact(name)
    patchContractMethods(contract)

    return {
        defaultSigner,
        alice,
        accounts: [alice, await getRandomSigner(), await getRandomSigner()],
        contractFactory,
        contract,
        abi,
        one,
        query: contract.query,
        tx: contract.tx
    }
}

export const patchContractMethods = (contract: Contract): Contract => {
    // @ts-ignore
    contract['tx'] = new Proxy(contract.tx, {
        get(target, prop: string) {
            return async function (...args: TransactionParams) {
                if (!contract.query[prop]) {
                    throw Error(`No property: ${prop} in contract ABI`)
                }
                const result = await contract.query[prop](...args)
                const output = result.output?.toJSON()

                if ((output && output['ok'] !== undefined) || output === undefined) {
                    return await target[prop](...args)
                } else {
                    const errorMessage = output ? output['err'] : 'Unknown Error'
                    const error = Error(`Transaction returned Result::Err: ${JSON.stringify(errorMessage)}`)
                    error['errorMessage'] = errorMessage
                    throw error
                }
            }
        }
    })
    return contract
}

export const expectRevert = <T>(promise: Promise<T>, errorMessage: string | Record<string, any> = '') => {
    return promise
        .then(() => expect.fail('Should be reverted.'))
        .catch((e) => {
            if (!e.errorMessage) {
                throw e
            } else if (!errorMessage) {
                console.warn('Error checking was skipped. Please specify errorMessing during `expectRevert`.')
                expect(true)
            } else if (typeof errorMessage === 'object') {
                expect(e.errorMessage).to.deep.equal(errorMessage)
            } else {
                if (typeof e.errorMessage === 'object') {
                    expect(e.errorMessage).to.deep.equal({ [camelCase(errorMessage)]: null })
                } else {
                    expect(e.errorMessage).to.equal(errorMessage)
                }
            }
        })
}

export const fromSigner = (contract: Contract, address: string): Contract => {
    return patchContractMethods(contract.connect(address))
}
