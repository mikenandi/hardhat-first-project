// imports
const { ethers, run, network } = require("hardhat");
require("dotenv").config();

// main function declaration.
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );

    console.log("Deploying contract ...");

    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`deployed contract to: ${simpleStorage.address}`);

    // checking if the chainId is of rinkeby testnet and there is etherscan api key.
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6);

        await verify(simpleStorage.address, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is ${currentValue}`);

    // update the current value.
    const transactionResponse = await simpleStorage.store(7);
    await simpleStorage.deployTransaction.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`the updated value: ${updatedValue}`);

    return;
}

// verfying
async function verify(contractAddress, args) {
    try {
        console.log("Verifying contracts...");

        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });

        return;
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already verified.");
            return;
        } else {
            console.log(error);

            return;
        }
    }
}

// calling main function.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
