const SharedWalletContract = artifacts.require('SharedWalletContract');
const BN = require('big-number')

const chai = require("./chaisetup.js");
const expect = chai.expect;

//https://www.npmjs.com/package//eth-gas-reporter

/**
    * [x]  RF01 - Deve ser possível o cadastro dos endereços a serem beneficiados pela mesada. (Somente o admin poderá realizar essa ação)
    * [x]  RF02 - Deve ser possível desabilitar o acesso de um beneficiário. (Somente o admin poderá realizar essa ação)
    * [x]  RF03 - Deve ser possível estipular o valor que cada beneficiário poderá retirar. (Somente o admin poderá realizar essa ação)
    * [x]  RF04 - Deve ser possível adicionar moedas ao contrato. (Apenas administradores)
    * [x]  RF05 - Deve ser possível estipular o máximo de moedas que o nosso contrato pode ter. (Somente o admin poderá realizar essa ação)
    * [x]  RF06 - Deve ser possível pausar todas as transferências.  (Somente o admin poderá realizar essa ação)
 */
contract("SharedWalletContract", (accounts) => {
    // [x]  RF01 - Deve ser possível o cadastro dos endereços a serem beneficiados pela mesada. (Somente o admin poderá realizar essa ação)
    it("Should be possible register a new beneficiary", async () => {
        const contractInstance = await SharedWalletContract.deployed()

        const valueReturned = await contractInstance.setBeneficiary(accounts[1], true, new BN(1000000000000000000))

        await expect(valueReturned).to.be.an('object').that.includes({ tx: valueReturned.tx })
    })

    // [x]  RF01 - Deve ser possível o cadastro dos endereços a serem beneficiados pela mesada. (Somente o admin poderá realizar essa ação)
    it("shouldn't be possible register a new beneficiary if caller is not the owner", async () => {
        const contractInstance = await SharedWalletContract.deployed()


        await expect(contractInstance.setBeneficiary(accounts[1], true, new BN(1000000000000000000), { from: accounts[1] })).to.be.rejectedWith("VM Exception while processing transaction: revert Ownable: caller is not the owner")
    })
})