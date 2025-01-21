# worldtycoon

## Building

### Pre-requisite
```shell
 npm i -g @cartesi/cli
```

### Run backend
```shell
cd dapp
cartesi build
cartesi run
```

### Send input to start game 
```shell
cartesi send
Select send sub-command Send generic input to the application.
? Chain Foundry
? RPC URL http://127.0.0.1:8545
? Wallet Mnemonic
? Mnemonic test test test test test test test test test test test junk
? Account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 9993.476291596530017783 ETH
? Application address 0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e
? Input String encoding
? Input (as string) {"method" : "start", "seed" : 0}
```

### Run frontend
```shell 
cd frontend
pnpm run dev
```
