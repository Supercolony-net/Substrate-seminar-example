import {expect, expectRevert, setupContract} from '../helpers'

describe('USD_TOKEN', () => {
    async function setup() {
        return setupContract('usd_token', 'new', '1000')
    }

    it('Should assigns initial balance', async () => {
        const { query, defaultSigner: sender } = await setup()

        await expect(query.psp22BalanceOf(sender.address)).to.have.output(1000)
    })

    it('Should transfer when not paused', async () => {
        const { contract: pausable, query, defaultSigner: sender, accounts: [receiver] } = await setup()

        // sender has 1000 tokens
        await expect(query.psp22BalanceOf(sender.address)).to.have.output(1000)
        // receiver has 0 tokens
        await expect(query.psp22BalanceOf(receiver.address)).to.have.output(0)

        // sender sends tokens to the receiver
        await expect(pausable.tx.psp22Transfer(receiver.address, 100, [])).to.eventually.be.fulfilled

        // sender has 900 tokens
        await expect(query.psp22BalanceOf(sender.address)).to.have.output(900)
        // receiver has 100 tokens
        await expect(query.psp22BalanceOf(receiver.address)).to.have.output(100)
    })

    it('Should not transfer when paused', async () => {
        const { contract: pausable, query, defaultSigner: sender, accounts: [receiver] } = await setup()

        // sender has 1000 tokens
        await expect(query.psp22BalanceOf(sender.address)).to.have.output(1000)
        // receiver has 0 tokens
        await expect(query.psp22BalanceOf(receiver.address)).to.have.output(0)
        // we pause the contract
        await expect(pausable.tx.changeState()).to.eventually.be.fulfilled

        // sender sends tokens to the receiver
        await expectRevert(pausable.tx.psp22Transfer(receiver.address, 100, []),  { custom: 'P::Paused' } )

        // sender has 1000 tokens
        await expect(query.psp22BalanceOf(sender.address)).to.have.output(1000)
        // receiver has 0 tokens
        await expect(query.psp22BalanceOf(receiver.address)).to.have.output(0)
    })
})
