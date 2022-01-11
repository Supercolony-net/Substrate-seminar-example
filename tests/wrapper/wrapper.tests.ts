import {expect, expectRevert, fromSigner, setupContract} from '../helpers'

describe('WRAPPER_TOKEN', () => {
    async function setup() {
        const usdToken = await setupContract('usd_token', 'new', '1000')

        const wrapperUsd = await setupContract('wrapped_usd', 'new', usdToken.contract.address)

        return {usdToken, wrapperUsd}
    }

    it('Should deposit to signer', async () => {
        const {usdToken, wrapperUsd} = await setup()

        // Allow wrappedUst to spend token on behalf of signer
        await expect(fromSigner(usdToken.contract, usdToken.contract.signer).tx.psp22Approve(wrapperUsd.contract.address, 100)).to.eventually.be.fulfilled

        // Deposit wrapped for usdToken signer
        await expect(fromSigner(wrapperUsd.contract, usdToken.contract.signer).tx.wrappedPSP22DepositFor(usdToken.contract.signer, 100)).to.eventually.be.fulfilled

        // Check wrapped amount of usdToken it is holding
        await expect(usdToken.query.psp22BalanceOf(wrapperUsd.contract.address)).to.have.output(100)

        // Check signer amount of wrapped
        await expect(wrapperUsd.query.psp22BalanceOf(usdToken.contract.signer)).to.have.output(100)
    })

    it('Should withdraw to signer', async () => {
        const {usdToken, wrapperUsd} = await setup()

        // Allow wrappedUst to spend token on behalf of signer
        await expect(fromSigner(usdToken.contract, usdToken.contract.signer).tx.psp22Approve(wrapperUsd.contract.address, 100)).to.eventually.be.fulfilled

        // Deposit wrapped for usdToken signer
        await expect(fromSigner(wrapperUsd.contract, usdToken.contract.signer).tx.wrappedPSP22DepositFor(usdToken.contract.signer, 100)).to.eventually.be.fulfilled

        // Withdraw usd Token
        await expect(fromSigner(wrapperUsd.contract, usdToken.contract.signer).tx.wrappedPSP22WithdrawTo(usdToken.contract.signer, 100)).to.eventually.be.fulfilled

        // Check wrapped amount of usdToken it is holding
        await expect(usdToken.query.psp22BalanceOf(wrapperUsd.contract.address)).to.have.output(0)

        // Check signer amount of wrapped
        await expect(wrapperUsd.query.psp22BalanceOf(usdToken.contract.signer)).to.have.output(0)

        // Check signer balance of usd Token
        await expect(usdToken.query.psp22BalanceOf(usdToken.contract.signer)).to.have.output(1000)
    })
})
