# Decentralized Content Distribution
#### A Dapp providing secure content distribution by leveraging Zero knowledge proofs and Soul Bound Tokens with high transaction throughput from the scroll sepolia network

### Deployments
- Deployed on the scroll sepolia testnetwork - [https://sepolia.scrollscan.com/address/0x3a92c403ccfd005c19b4a75e8ee178f3963db85c](https://sepolia.scrollscan.com/address/0x3a92c403ccfd005c19b4a75e8ee178f3963db85c)

### Setting up the project locally

First clone the project
1.) Frontend setup
```sh
cd zkcdn
npm i
npm run dev
```
2.) Off chain compute (wsl/linux based os)
```sh
cd off-chainPy
python -m venv env
source env/bin/activate
pip install -r requirements.txt
cd proofs
python main.py
```
Done! you're frontend is now running on [http://localhost:5173/](http://localhost:5173/)

### Tools
- Reactjs
- Zokrates(Circuit building and compilation)
- FastAPI (zkproofs compute off chain)
- Alchemy sdk ( NFT operations)

### Open for contributions
Open for contributions, please drop a fix/change with details in the PR
