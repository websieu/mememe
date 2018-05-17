var Web3 = require('web3');
var Sanita = require('../../log/Sanita');
var Utility = require('../../utility/Utility');
const mainConfig = require('../config/main_config');

class Web3Info {
    constructor(host) {
        this.host = host || mainConfig.host;
        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider(this.host));
        }
        
        if (!this.web3.isConnected()) {
            Sanita.error('unable to connect to ethereum node at ' + this.host);
            throw new Error('unable to connect to ethereum node at ' + this.host);
        } else {
            this.web3.eth.defaultAccount = this.listAccounts[0];
        }
    }

    get listAccounts() {
        return this.web3.eth.accounts;
    }

    set defaultAccount(account) {
        if (account)
            this.web3.eth.defaultAccount = account;
    }

    async getBalance(address) {
        var balance = await this.web3.eth.getBalance(address);
        return balance;
    }

    toBigNumber(number) {
        return this.web3.toBigNumber(ethToFiatCurrency);
    }

    async getTransactionReceipt(transactionHash) {
        var receipt = await this.web3.eth.getTransactionReceipt(transactionHash);
        return receipt;
    }

    get blockNumber() {
        return this.web3.eth.blockNumber;
    }

    get defaultAccount() {
        return this.web3.eth.defaultAccount;
    }

    async createNewAccount(password) {
        try {
            var newAccount = await this.web3.personal.newAccount(password);
            Sanita.log('Create new account: ' + newAccount);
            return newAccount;
        } catch (error) {
            Sanita.error('Error create new account: ' + error.message);
            return null;
        }
    }

    unlockAccount(account, password) {
        this.web3.personal.unlockAccount(account, password);
        Sanita.log('unlockAccount: ' + account);
    }

    getContractDeployed(abi, addressContract) {
        var AbiContract = this.getContractFromAbi(abi);
        var contract = AbiContract.at(addressContract);
        return contract;
    }

    getContractFromAbi(abi) {
        var AbiContract = this.web3.eth.contract(abi);
        return AbiContract;
    }

    updateGas(data, additionalGas) {
        try {
            // Get the estimated gas required to deploy the code.
            // Add additional gas if the gasLimit is too low.
            let estimateGas = this.web3.eth.estimateGas({ 'data': data });
            let estimateGasBig = this.web3.toBigNumber(estimateGas);
            let additionalGasBig = this.web3.toBigNumber(additionalGas);

            var gas = estimateGasBig.add(additionalGasBig);

            Sanita.log("Estimate gas: " + estimateGas);
            Sanita.log("User added additionalGas: " + additionalGas);
            Sanita.log("Total estimate gas: " + gas);

            return gas;
        } catch (error) {
            //Return error
             Sanita.error(error);
            throw error;
        }
    }
}

module.exports = Web3Info;