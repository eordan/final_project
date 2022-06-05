#!/bin/bash

cd contracts/circuits

mkdir nMugwumps

if [ -f ./powersOfTau28_hez_final_11.ptau ]; then
    echo "powersOfTau28_hez_final_11.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_11.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_11.ptau
fi

echo "Compiling nMugwumps.circom..."

# compile circuit

circom nMugwumps.circom --r1cs --wasm --sym -o nMugwumps
snarkjs r1cs info nMugwumps/nMugwumps.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup nMugwumps/nMugwumps.r1cs powersOfTau28_hez_final_11.ptau nMugwumps/circuit_0000.zkey
snarkjs zkey contribute nMugwumps/circuit_0000.zkey nMugwumps/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey nMugwumps/circuit_final.zkey nMugwumps/verification_key.json

# generate solidity contract

snarkjs zkey export solidityverifier nMugwumps/circuit_final.zkey ../nMugwumpsVerifier.sol

cd ../..