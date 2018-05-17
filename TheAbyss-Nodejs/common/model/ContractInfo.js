var solc = require('solc');
var fs = require("fs");
var Sanita = require('../../log/Sanita');
var ContractPresenter = require('../../dbpresenter/ContractPresenter');
var Utility = require('../../utility/Utility');
var clientPool = require('../../database/clientPool');
const DataTypeModel = require('../../common/model/DataTypeModel');
var Contract = require('../../common/model/Contract');
var Web3Info = require('./Web3Info');

class ContractInfo {
    constructor(contractName) {
        this.from = null;                               //sender address
        this.data = null;                               //bytecode
        this.gas = 0;                                   //total Estimate Gas Big
        this.value = 20000000000;                       //transfer value (wei)
        this.additionalGas = 50000;                     //If estimated gas does not match the actual gas usage, add additionalGas
        this.contractName = contractName;               //Name of contract
        this.web3Info = new Web3Info();
        this.from = this.web3Info.defaultAccount;

        //Init
        Sanita.log('Address: ' + this.from);
        let password = "khuyenthuvn@gmail.com";

        // Unlock account.
        this.web3Info.unlockAccount(this.from, password);
    }

    async convertFromWei() {
        try {
            var self = this;
            var web3 = self.web3Info.web3;

            // 1 Eth = 173 euro
            let ethToFiatCurrency = 173;
            let currencyUnit = "Euro";

            //
            let ethToFiatCurrencyBig = self.web3Info.toBigNumber(ethToFiatCurrency);
            Sanita.log("1 Ether: " + ethToFiatCurrencyBig.toString() + " " + currencyUnit + " (roughly)");

            // Show account balance
            let balanceWei = await self.web3Info.getBalance(self.from);
            let balanceEther = web3.fromWei(balanceWei, "ether");

            let balanceEtherBig = self.web3Info.toBigNumber(balanceEther);


            let balanceInFiatCurrencyBig = balanceEtherBig.times(ethToFiatCurrencyBig);
            Sanita.log("Account: " + self.from);
            Sanita.log("Account balance (Wei): " + balanceWei);
            Sanita.log("Account balance (Ether): " + balanceEther);
            Sanita.log("Account balance (" + currencyUnit + "): " + balanceInFiatCurrencyBig);

            // Get the gasPrice. Default value set in the Geth node.
            // The gas price is based per unit gas.
            let gasPriceWei = web3.eth.gasPrice;
            let gasPriceEther = web3.fromWei(gasPriceWei, "ether");
            let gasPriceEtherBig = web3.toBigNumber(gasPriceEther);
            let gasPriceInFiatCurrencyBig = gasPriceEtherBig.times(ethToFiatCurrencyBig);
            Sanita.log("GasPrice (Wei/gas unit): " + gasPriceWei);
            Sanita.log("GasPrice (Ether/gas unit): " + gasPriceEther.toString(10));
            Sanita.log("GasPrice (" + currencyUnit + "/gas unit): " + gasPriceInFiatCurrencyBig);

            // Calculate the total price
            // https://github.com/ethereum/wiki/blob/master/JavaScript-API.md
            // http://mikemcl.github.io/bignumber.js/
            let gasPriceWeiBig = web3.toBigNumber(gasPriceWei);
            let priceWeiBig = self.gas.times(gasPriceWeiBig);
            let priceEtherBig = web3.fromWei(priceWeiBig, "ether")
            let priceInFiatCurrencyBig = priceEtherBig.times(ethToFiatCurrencyBig);
            Sanita.log("Estimated price = total estimate gas * gasPrice");
            Sanita.log("Estimated price (Wei): " + priceWeiBig);
            Sanita.log("Estimated price (Ether): " + priceEtherBig);
            Sanita.log("Estimated price (" + currencyUnit + "): " + priceInFiatCurrencyBig);

            // Convert transfer value (wei) in different units
            let transferValueEther = web3.fromWei(self.value, "ether");
            let transferValueEtherBig = web3.toBigNumber(transferValueEther);
            let transferValueInFiatCurrencyBig = transferValueEtherBig.times(ethToFiatCurrencyBig);
            Sanita.log("TransferValue (Wei): " + self.value);
            Sanita.log("TransferValue (Ether): " + transferValueEther);
            Sanita.log("TransferValue (" + currencyUnit + "): " + transferValueInFiatCurrencyBig);

            //Return success
            return Utility.success('Convert wei to ether success', transferValueEther);
        } catch (error) {
            Sanita.error(error);
            //Return error
            //return Utility.error(error.message, null);
            throw error;
        }
    }

    writeLogContract(fileName, body) {
        fs.writeFileSync(fileName, body);
    }

    async compileContract(fileName) {
        try {
            var self = this;

            // inputFilesContent is an assiociative array inputFilesContent['Filename.sol'] = FileContent
            let inputFilesContent = {};

            var isFile = await fs.lstatSync(fileName).isFile();
            var isFolder = await fs.lstatSync(fileName).isDirectory();
            var listFiles = [];
            if (isFile) {
                listFiles.push(fileName);
            } else if (isFolder) {
                listFiles = await Utility.readFilesInFolder(fileName);
            }

            for (var i = 0; i < listFiles.length; ++i) {
                var name = listFiles[i];
                // Read the solidity file and store the content in source
                let source = await fs.readFileSync(name, 'utf8');
                //utf8 with BOM => utf8
                inputFilesContent[name] = source.replace(/^\uFEFF/, '');
            }

            // Setting 1 as second parameter activates the optimiser
            let compiledContract = await solc.compile({ sources: inputFilesContent }, 1);

            if (compiledContract.errors)
                compiledContract.errors.map(error => Sanita.error(error))

            Sanita.log("Contract is compiled, see file " + this.contractName + "compiled_output.json");
            this.writeLogContract(global.appRoot + '/smart_contracts/bin/' + this.contractName + "compiled_output.json", JSON.stringify(compiledContract, null, 4));

            //listContract
            var keys = Object.keys(compiledContract.contracts);
            let theContracts = keys.map(function (x) {
                let nameContract = x.split(':')[1];
                var theContract = compiledContract.contracts[x];
                // Extracts all data from the javascript object after contracts.fileName:contractName.interface
                // Store to content in file compiled_output.abi
                self.writeLogContract(global.appRoot + '/smart_contracts/bin/' + nameContract + ".abi", theContract.interface);
                self.writeLogContract(global.appRoot + '/smart_contracts/bin/' + nameContract + ".bin", theContract.bytecode);
                return theContract;
            });

            //return array
            return theContracts;
        } catch (error) {
            Sanita.error(error.message);
            throw error;
        }
    }

    /**
     * @param  bool minner: allow minner true/false
     */
    async createNewContract(minner = true) {
        try {
            var self = this;
            let fileName = global.appRoot + '/smart_contracts/' + self.contractName;

            // Extracts all data from the javascript object after contracts.fileName:contractName
            let theContract = await self.compileContract(fileName);
            theContract = theContract[0];

            if (!theContract) {
                Sanita.error('Error compile contract');
                throw new Error();
            }

            // Extracts all data from the javascript object after contracts.fileName:contractName.bytecode
            // and prepend with "0x". Bytecode should always start with 0x.
            self.data = "0x" + theContract.bytecode;
            self.gas = self.web3Info.updateGas(self.data, self.additionalGas);

            //var MyContract = self.web3Info.getContractFromAbi(JSON.parse(theContract.interface));
            var MyContract = self.web3Info.web3.eth.contract(JSON.parse(theContract.interface));

            var contract = await MyContract.new({
                data: self.data,
                from: self.from,
                gas: self.gas
            });

            // Transaction has entered to geth memory pool
            Sanita.log("Contract is being deployed, please wait...");
            Sanita.log("TransactionHash: " + contract.transactionHash);

            if (minner)
                await self.waitBlock(contract.transactionHash);

            //Return contract
            return contract;
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async getContract() {
        try {
            var self = this;
            var contract = null;

            //Get client
            var client = await clientPool();

            //Get list of contract in database
            var listContract = await ContractPresenter.findByName(client, self.contractName, null, 1, null);

            if (listContract.length === 0) {
                contract = await self.createNewContract();

                //Insert new contract into database
                let mContract = new Contract();
                mContract.id = Utility.guid();
                mContract.name = self.contractName;
                mContract.address = contract.address;
                mContract.active = DataTypeModel.ACTIVE;
                mContract.abi = JSON.stringify(contract.abi);
                mContract.bytecode = String(self.data);

                let result = await ContractPresenter.insert(client, mContract);
                if (!result) {
                    throw new Error('Error insert new smart contract.');
                }
            } else {
                let mContract = listContract[0];
                contract = self.web3Info.getContractDeployed(JSON.parse(mContract.abi), mContract.address);
            }

            //Release client
            client.release();

            //Return contract
            return contract;

        } catch (error) {
            //Release client
            client.release();
            Sanita.error(error);
            throw error;
        }
    }

    async getTheContract() {
        try {
            var self = this;
            let fileName = global.appRoot + '/smart_contracts/' + self.contractName;

            self.from = self.web3Info.defaultAccount;
            Sanita.log('Address: ' + self.from);
            let password = "khuyenthuvn@gmail.com";

            // Unlock account.
            self.web3Info.unlockAccount(self.from, password);

            // Extracts all data from the javascript object after contracts.fileName:contractName
            let theContract = await self.compileContract(fileName);

            if (!theContract) {
                Sanita.error('Error compile contract');
                throw new Error();
            }

            return theContract;
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    // Wait for a miner to include the transaction in a block.
    // Only when the transaction is included in a block the contract address in available.
    waitBlock(transactionHash) {
        try {
            var self = this;
            return new Promise(async (resolve, reject) => {
                while (true) {
                    let receipt = await self.web3Info.getTransactionReceipt(transactionHash);
                    if (receipt && receipt.contractAddress) {
                        Sanita.log("Contract is deployed at contract address: " + receipt.contractAddress);
                        Sanita.log("It might take 30-90 seconds for the block to propagate before it's visible in etherscan.io");
                        resolve(true);
                        break;
                    }
                    Sanita.log("Waiting for a miner to include the transaction in a block. Current block: " + self.web3Info.blockNumber);
                    await Utility.sleep(4000);
                }
            });
        } catch (error) {
            throw error;
        }
    }

    waitMinner(transactionHash) {
        try {
            var self = this;
            return new Promise(async (resolve, reject) => {
                while (true) {
                    var txR = await self.web3Info.getTransactionReceipt(transactionHash);
                    if (txR && txR.blockNumber) {
                        resolve(true);
                        break;
                    }
                    Sanita.log("Waiting for a miner to include the transaction in a block. Current block: " + self.web3Info.blockNumber);
                    await Utility.sleep(4000);
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
module.exports = ContractInfo;