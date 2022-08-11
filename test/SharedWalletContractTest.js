const SharedWalletContract = artifacts.require('SharedWalletContract');
const BN = require('big-number')

const chai = require("./chaisetup.js");
const expect = chai.expect;

contract("SharedWalletContract", (accounts) => {
    const [owner, anotherAccount] = accounts;

    // [x]  RF01 - Deve ser possível o cadastro dos endereços a serem beneficiados pela mesada. (Somente o admin poderá realizar essa ação)
    // [x]  RF03 - Deve ser possível estipular o valor que cada beneficiário poderá retirar. (Somente o admin poderá realizar essa ação)
    it("Should be possible register a new beneficiary and set the amount of allowance  just possible if caller is the owner", async () => {
        const contractInstance = await SharedWalletContract.deployed()
        const valueReturned = await contractInstance.setBeneficiary(anotherAccount, true, new BN(1000000000000000000))

        await expect(valueReturned).to.be.an('object').that.includes({ tx: valueReturned.tx }).to.containSubset({ receipt: { status: true } })
        await expect(contractInstance.setBeneficiary(anotherAccount, true, new BN(1000000000000000000), { from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")
    })

    //[x]  RF02 - Deve ser possível desabilitar o acesso de um beneficiário. (Somente o admin poderá realizar essa ação)
    it("should be possible disable beneficiary just possible if caller is the owner", async () => {
        const contractInstance = await SharedWalletContract.deployed()
        const valueReturned = await contractInstance.setBeneficiary(anotherAccount, false, new BN(1000000000000000000))

        await expect(valueReturned).to.be.an('object').that.includes({ tx: valueReturned.tx }).to.containSubset({ receipt: { status: true } })
        await expect(contractInstance.setBeneficiary(anotherAccount, false, new BN(1000000000000000000), { from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")
    })

    //[x]  RF04 - Deve ser possível adicionar moedas ao contrato. (Apenas administradores)
    it("should be possible add tokens in contract just possible if caller is the owner", async () => {
        const contractInstance = await SharedWalletContract.deployed()
        const valueReturned = await contractInstance.addTokens(owner, new BN(1000000000000000000))
        await expect(valueReturned).to.be.an('object').that.includes({ tx: valueReturned.tx }).to.containSubset({ receipt: { status: true } })
        await expect(contractInstance.addTokens(owner, new BN(1000000000000000000), { from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")
    })

    //[x]  RF05 - Deve ser possível estipular o máximo de moedas que o nosso contrato pode ter. (Somente o admin poderá realizar essa ação)
    it("should be possible set max tokens possible in contract just possible if caller is the owner", async () => {
        const contractInstance = await SharedWalletContract.deployed()
        const valueReturned = await contractInstance.setMaxTokensAllowed(new BN(10000000000000000000))
        await expect(valueReturned).to.be.an('object').that.includes({ tx: valueReturned.tx }).to.containSubset({ receipt: { status: true } })
        await expect(contractInstance.setMaxTokensAllowed(new BN(10000000000000000000), { from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")
    })

    //[x]  RF06 - Deve ser possível pausar todas as transferências.  (Somente o admin poderá realizar essa ação)
    it("Should be possible pause and unpause all transfers if caller is the owner", async () => {
        const contractInstance = await SharedWalletContract.deployed()

        const valueReturnedToPause = await contractInstance.pause()
        await expect(valueReturnedToPause).to.be.an('object').that.includes({ tx: valueReturnedToPause.tx }).to.containSubset({ receipt: { status: true } })
        await expect(contractInstance.pause({ from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")

        await expect(contractInstance.withdrawAllowance({ from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert ERC20Pausable: token transfer while paused")

        const valueReturnedToUnpause = await contractInstance.unpause()
        await expect(valueReturnedToUnpause).to.be.an('object').that.includes({ tx: valueReturnedToUnpause.tx }).to.containSubset({ receipt: { status: true } })
        await expect(contractInstance.unpause({ from: anotherAccount })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")
    })
})