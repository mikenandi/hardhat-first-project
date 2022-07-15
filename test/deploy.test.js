const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const {
    isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("SimpleStorage", function () {
    // declaring variables.
    let simpleStorage, SimpleStorageFactory;
    beforeEach(async function () {
        // getting the contract from the contracts folder.
        SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
        // deploying contract.
        simpleStorage = await SimpleStorageFactory.deploy();
    });

    it("should start with favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve();
        const expectedValue = "0";

        assert.equal(currentValue.toString(), expectedValue);
    });

    it("should update when we call store", async function () {
        const expectedValue = "7";

        const transactionResponse = await simpleStorage.store(expectedValue);
        await transactionResponse.wait(1);

        const currentValue = await simpleStorage.retrieve();

        assert.equal(currentValue.toString(), expectedValue);
    });
});
