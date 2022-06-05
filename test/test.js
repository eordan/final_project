const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");
const { plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("nMugwumps with Groth16", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("nMugwumpsVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        const { proof, publicSignals } = await groth16.fullProve({"guessX": "7", "guessY": "8", "soltnX": [5, 3, 2, 9], "soltnY": [3, 8, 4, 5]}, "contracts/circuits/nMugwumps/nMugwumps_js/nMugwumps.wasm","contracts/circuits/nMugwumps/circuit_final.zkey");
        console.log('Power of distance from MugWump 1 is',publicSignals[0],'units');
        console.log('Power of distance from MugWump 2 is',publicSignals[1],'units');
        console.log('Power of distance from MugWump 3 is',publicSignals[2],'units');
        console.log('Power of distance from MugWump 4 is',publicSignals[3],'units');
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());  
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0, 0, 0, 0, 0, 0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});

describe("nMugwumps with Groth16", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("nMugwumpsVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        const { proof, publicSignals } = await groth16.fullProve({"guessX": "7", "guessY": "8", "soltnX": [5, 3, 2, 9], "soltnY": [3, 8, 4, 5]}, "contracts/circuits/nMugwumps/nMugwumps_js/nMugwumps.wasm","contracts/circuits/nMugwumps/circuit_final.zkey");
        console.log('Distance from MugWump 1 is',Math.sqrt(publicSignals[0]).toFixed(2),'units');
        console.log('Distance from MugWump 2 is',Math.sqrt(publicSignals[1]).toFixed(2),'units');
        console.log('Distance from MugWump 3 is',Math.sqrt(publicSignals[2]).toFixed(2),'units');
        console.log('Distance from MugWump 4 is',Math.sqrt(publicSignals[3]).toFixed(2),'units');
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());  
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0, 0, 0, 0, 0, 0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});