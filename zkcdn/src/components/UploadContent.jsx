import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Wallet, Check, ExternalLink, Loader2, ShieldEllipsis } from 'lucide-react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import ZkCDNABI from '../../contracts/ZkCDN.json';

// IPFS configuration (unchanged)
const projectId = '2WCbZ8YpmuPxUtM6PzbFOfY5k4B';
const projectSecretKey = 'c8b676d8bfe769b19d88d8c77a9bd1e2';
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);
const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization: authorization
  },
});

const ZkCDNMinting = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [uniqueInteger, setUniqueInteger] = useState(null);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mintingStage, setMintingStage] = useState(0);
  const [txHash, setTxHash] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      setIsConnecting(true);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const signer = await provider.getSigner();
        setSigner(signer);
        console.log(account, provider, signer);
        setAccount(account);
        setIsConnected(true);

        // Assuming ZkCDNABI.address is available
        if (ZkCDNABI.address) {
          const contractInstance = new ethers.Contract(
            ZkCDNABI.address,
            ZkCDNABI.abi,
            provider
          );
          setContract(contractInstance);
        } else {
          console.error('Contract address not available');
        }
      } catch (error) {
        console.log(error);
        console.error("User denied account access or wrong network");
      }
      setIsConnecting(false);
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadToIPFS = async () => {
    if (!file) return;
    try {
      const added = await ipfs.add(file);
      console.log(added);
      setIpfsHash(added.path);
      return added.path;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
    }
  };

  const djb2Hash = (str) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash >>> 0; // Convert to unsigned 32-bit integer
  };

  const mintToken = async () => {
    if (!file || !contract || !account) return;
    setMinting(true);
    setMintingStage(1);
    try {
      const hash = await uploadToIPFS();
      setMintingStage(2);
      const uniqueInt = djb2Hash(hash);
      setUniqueInteger(uniqueInt);
      console.log(account, hash, uniqueInt);
      const connected_contract = contract.connect(signer);
      setMintingStage(3);
      const tx = await connected_contract.safeMint(account, hash, uniqueInt);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      console.log(tx);
      setMinted(true);
      setMintingStage(4);
    } catch (error) {
      console.error('Error minting token:', error);
    }
    setMinting(false);
  };

  const mintingStages = [
    { title: 'Start Minting', icon: Loader2 },
    { title: 'Uploading to IPFS', icon: Loader2 },
    { title: 'Uploaded to IPFS', icon: Check },
    { title: 'Minting Soul Bound Token', icon: Loader2 },
    { title: 'Content Uploaded and Token Minted', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 shadow-xl rounded-lg overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Tokenize your content on ZkCDN
              </h2>
              <div className="space-y-6">
                <motion.button
                  onClick={connectWallet}
                  disabled={isConnected || isConnecting}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isConnected || isConnecting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnecting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="h-5 w-5 mr-2" />
                    </motion.div>
                  ) : isConnected ? (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </motion.button>
                <AnimatePresence>
                  {isConnected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
                          Upload Your Content
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-400">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span className="px-2 py-1">Choose a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-400">
                              Any file up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                      {file && (
                        <p className="text-sm text-gray-300 mt-2">
                          Selected file: {file.name}
                        </p>
                      )}
                      <div className="mt-4">
                        <motion.button
                          onClick={mintToken}
                          disabled={!file || minting}
                          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            !file || minting
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {minting ? 'Minting in Progress' : 'Mint Token'}
                        </motion.button>
                      </div>
                      <AnimatePresence>
                        {minting && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 space-y-2"
                          >
                            {mintingStages.map((stage, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: mintingStage >= index ? 1 : 0.5, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`flex items-center space-x-2 ${
                                  mintingStage >= index ? 'text-blue-400' : 'text-gray-400'
                                }`}
                              >
                                {mintingStage === index ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  >
                                    <Loader2 className="h-4 w-4" />
                                  </motion.div>
                                ) : mintingStage > index ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <div className="h-4 w-4" />
                                )}
                                <span>{stage.title}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {minted && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="mt-4 space-y-2"
                        >
                          <a
                            href={`https://skywalker.infura-ipfs.io/ipfs/${ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View on IPFS</span>
                          </a>
                          <a
                            href={`https://cardona-zkevm.polygonscan.com/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Transaction</span>
                          </a>
                          <span className="flex text-sm space-x-2 y-2 text-black-100">Encrypted IPFS Hash: {uniqueInteger}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ZkCDNMinting;