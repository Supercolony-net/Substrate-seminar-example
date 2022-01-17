import {expect, fromSigner, setupContract} from '../helpers'

describe('WRAPPER_TOKEN', () => {
    async function setup() {
        const usdToken = await setupContract('usd_token', 'new', '1000')

        const wrapperUsd = await setupContract('wrapped_usd', 'new', usdToken.contract.address)

        return { usdToken, wrapperUsd, alice: usdToken.defaultSigner, bob: wrapperUsd.defaultSigner }
    }

    it('Should deposit to signer', async () => {
        const {usdToken, wrapperUsd, alice} = await setup()

        // The balance of Alice account should be 1000
        await expect(fromSigner(usdToken.contract, alice.address).query.psp22BalanceOf(alice.address)).to.have.output(1000)

        // Allow wrappedUst contract to spend token on behalf of Alice
        await expect(fromSigner(usdToken.contract, alice.address).tx.psp22Approve(wrapperUsd.contract.address, 100)).to.eventually.be.fulfilled

        // Deposit Alice's tokens to wrapped contract
        await expect(fromSigner(wrapperUsd.contract, alice.address).tx.wrappedPSP22DepositFor(alice.address, 100)).to.eventually.be.fulfilled

        // After transferring of 100 tokens the balance of Alice account should be 900
        await expect(fromSigner(usdToken.contract, alice.address).query.psp22BalanceOf(alice.address)).to.have.output(900)

        // Check the amount of usd tokens of wrapped contract
        await expect(usdToken.query.psp22BalanceOf(wrapperUsd.contract.address)).to.have.output(100)

        // Check Alice's amount of wrapped
        await expect(wrapperUsd.query.psp22BalanceOf(alice.address)).to.have.output(100)
    })

    it('Should withdraw to signer', async () => {
        const {usdToken, wrapperUsd, alice} = await setup()

        // Check Alice balance of usd Token
        await expect(usdToken.query.psp22BalanceOf(usdToken.contract.signer)).to.have.output(1000)

        // Allow wrappedUst to spend token on behalf of Alice
        await expect(fromSigner(usdToken.contract, alice.address).tx.psp22Approve(wrapperUsd.contract.address, 100)).to.eventually.be.fulfilled

        // Deposit wrapped for Alice
        await expect(fromSigner(wrapperUsd.contract, alice.address).tx.wrappedPSP22DepositFor(usdToken.contract.signer, 100)).to.eventually.be.fulfilled

        // Alice withdraws usd token
        await expect(fromSigner(wrapperUsd.contract, alice.address).tx.wrappedPSP22WithdrawTo(usdToken.contract.signer, 100)).to.eventually.be.fulfilled

        // Check the amount of usd tokens of wrapped contract
        await expect(usdToken.query.psp22BalanceOf(wrapperUsd.contract.address)).to.have.output(0)

        // Check Alice's amount of wrapped token
        await expect(wrapperUsd.query.psp22BalanceOf(alice.address)).to.have.output(0)

        // Check Alice's balance of usd token
        await expect(usdToken.query.psp22BalanceOf(alice.address)).to.have.output(1000)
    })

    it('Bob can withdraw deposited tokens', async () => {
        const {usdToken, wrapperUsd, alice, bob} = await setup()

        // Check Alice balance of usd Token
        await expect(usdToken.query.psp22BalanceOf(usdToken.contract.signer)).to.have.output(1000)

        // Allow wrappedUst to spend token on behalf of Alice
        await expect(fromSigner(usdToken.contract, alice.address).tx.psp22Approve(wrapperUsd.contract.address, 100)).to.eventually.be.fulfilled

        // Deposit wrapped for Alice
        await expect(fromSigner(wrapperUsd.contract, alice.address).tx.wrappedPSP22DepositFor(usdToken.contract.signer, 100)).to.eventually.be.fulfilled

        // Alice transfers wrapped tokens to Bob
        await expect(fromSigner(wrapperUsd.contract, alice.address).tx.psp22Transfer(bob.address, 100, [])).to.eventually.be.fulfilled

        // Check Alice amount of wrapped tokens after transfer
        await expect(wrapperUsd.query.psp22BalanceOf(alice.address)).to.have.output(0)

        // Check Bob amount of wrapped tokens after transfer
        await expect(wrapperUsd.query.psp22BalanceOf(bob.address)).to.have.output(100)

        // Bob withdraws usd token
        await expect(fromSigner(wrapperUsd.contract, bob.address).tx.wrappedPSP22WithdrawTo(bob.address, 100)).to.eventually.be.fulfilled

        // Check Bob amount of wrapped
        await expect(wrapperUsd.query.psp22BalanceOf(bob.address)).to.have.output(0)

        // Check Bob balance of usd Token
        await expect(usdToken.query.psp22BalanceOf(bob.address)).to.have.output(100)
    })
})
