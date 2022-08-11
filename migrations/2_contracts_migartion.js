const SharedWalletContract = artifacts.require("SharedWalletContract");

module.exports = function (deployer) {
    deployer.deploy(SharedWalletContract);
};
