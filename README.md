# Decentralized Content Distribution
#### A Dapp providing secure content distribution by leveraging Zero knowledge proofs and Soul Bound Tokens. We provide a dynamic indexing dashboard and use generative AI to query your subgraph data using asynchronous subgrounds 

### Deployments
- zkcdnGraph Subgraph : [https://thegraph.com/studio/subgraph/zkcdngraph/](https://thegraph.com/studio/subgraph/zkcdngraph/)
- Demo Video : [https://www.loom.com/share/1ac71e714d2043b8b07a31f37745fa95?sid=429779b4-aaca-4524-82c1-76b6d8daf91f](https://www.loom.com/share/1ac71e714d2043b8b07a31f37745fa95?sid=429779b4-aaca-4524-82c1-76b6d8daf91f)
- Deployed on the scroll sepolia testnetwork - [https://sepolia.scrollscan.com/address/0xE5220548856b1872c3207baaeE317de4714D2EfF](https://sepolia.scrollscan.com/address/0xE5220548856b1872c3207baaeE317de4714D2EfF)

### Setting up the project locally

First clone the project
1.) Frontend setup
```sh
cd zkcdn
npm i
npm run dev
```
2.) Off chain compute (wsl/linux based os) and 1 offchain Generative AI model
```sh
cd off-chainPy
python -m venv env
source env/bin/activate
pip install -r requirements.txt
cd proofs
python main.py
```
3.) Running the 2nd offchain ( The graph protocol's python subground package)
```sh
cd off-chainPy
python -m venv env
source env/bin/activate
pip install -r requirements.txt
cd subgrounds
python main.py
```
Done! you're frontend is now running on [http://localhost:5173/](http://localhost:5173/)

### Tools
- Reactjs
- Zokrates(Circuit building and compilation)
- FastAPI (zkproofs compute off chain)
- Subgrounds
- The graph protocol sdk

### Open for contributions
Open for contributions, please drop a fix/change with details in the PR
