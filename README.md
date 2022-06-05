# MugWump

Install the required node modules by running:
```shell
npm install
```

Compile the curcuit:

```shell
. scripts/compile-mugwump-groth16.sh
```

Test:

```shell
node scripts/bump-solidity.js && npx hardhat test
```
