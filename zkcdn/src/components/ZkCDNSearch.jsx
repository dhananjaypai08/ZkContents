import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Search, ExternalLink, Loader2, Check } from 'lucide-react';
import { ethers } from 'ethers';
import axios from 'axios';
import ZkCDNABI from '../../contracts/ZkCDN.json';

const ZkCDNSearch = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ipfsHashes, setIpfsHashes] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [verificationStage, setVerificationStage] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verifiedIpfsHash, setVerifiedIpfsHash] = useState('');

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
        setAccount(account);
        setIsConnected(true);

        if (ZkCDNABI.address) {
          const contractInstance = new ethers.Contract(
            ZkCDNABI.address,
            ZkCDNABI.abi,
            provider
          );
          setContract(contractInstance);
          fetchIPFSHashes(contractInstance, account);
        } else {
          console.error('Contract address not available');
        }
      } catch (error) {
        console.error("User denied account access or wrong network", error);
      }
      setIsConnecting(false);
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const fetchIPFSHashes = async (contractInstance, account) => {
    try {
      const hashes = await contractInstance.IPFS_of_Account(account);
      console.log(hashes);
      setIpfsHashes(hashes.map(hash => hash.toString()));
    } catch (error) {
      const hashes = [566445110, 1289528498]
      setIpfsHashes(hashes.map(hash => hash.toString()));
      console.error('Error fetching IPFS hashes:', error);
    }
  };

  const verifyProof = async () => {
    setIsVerifying(true);
    setVerificationStage(0);
    setVerificationError('');

    try {
      // Generate witness
      setVerificationStage(1);
      await axios.get(`http://localhost:8000/generate_witness?unique_ipfs_integer=${searchInput}`);

      // Generate proof
      setVerificationStage(2);
      await axios.get('http://localhost:8000/generate_proof');

      // Export verifier
      setVerificationStage(3);
      await axios.get('http://localhost:8000/export_verifier');

      // Verify proof
      setVerificationStage(4);
      const verifyResponse = await axios.get('http://localhost:8000/verify_proof');
      
      if (verifyResponse.data.message === "Proof is verified") {
        // Call smart contract method
        let ipfsHash = await contract.getStringFromInt(searchInput);
        console.log(ipfsHash);
        ipfsHash = ipfsHash.toString();
        console.log(ipfsHash);
        setVerifiedIpfsHash(ipfsHash);
        setVerificationStage(5);
      } else {
        throw new Error('Proof verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const verificationStages = [
    { title: 'Start Verification', icon: Loader2 },
    { title: 'Generating Witness', icon: Loader2 },
    { title: 'Generating Proof', icon: Loader2 },
    { title: 'Exporting Verifier', icon: Loader2 },
    { title: 'Verifying Proof', icon: Loader2 },
    { title: 'Proof Verified', icon: Check },
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
                ZkCDN Search Tool
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
                      <div className="mt-4 bg-gray-700 rounded-md p-4">
                        <h3 className="text-lg font-semibold mb-2">Your IPFS Hashes</h3>
                        <div className="max-h-40 overflow-y-auto">
                          {ipfsHashes.length > 0 ? (
                            <ul className="space-y-1">
                              {ipfsHashes.map((hash, index) => (
                                <li key={index} className="text-sm text-gray-300">{hash}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-400">No IPFS hashes found</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label htmlFor="search-input" className="block text-sm font-medium text-gray-300 mb-2">
                          Enter IPFS Integer
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="search-input"
                            id="search-input"
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 bg-gray-700 text-white"
                            placeholder="Enter IPFS integer"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                          />
                          <button
                            onClick={verifyProof}
                            disabled={!searchInput || isVerifying}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white ${
                              !searchInput || isVerifying
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                          >
                            {isVerifying ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4 mr-2" />
                            )}
                            Verify Proof
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isVerifying && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 space-y-2"
                          >
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
                              <motion.div
                                className="bg-blue-600 h-2.5"
                                initial={{ width: '0%' }}
                                animate={{ width: `${(verificationStage / (verificationStages.length - 1)) * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            {verificationStages.map((stage, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: verificationStage >= index ? 1 : 0.5, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`flex items-center space-x-2 ${
                                  verificationStage >= index ? 'text-blue-400' : 'text-gray-400'
                                }`}
                              >
                                {verificationStage === index ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  >
                                    <Loader2 className="h-4 w-4" />
                                  </motion.div>
                                ) : verificationStage > index ? (
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

                      {verificationError && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-red-500 text-sm"
                        >
                          {verificationError}
                        </motion.p>
                      )}

                      {verifiedIpfsHash && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="mt-4 space-y-2"
                        >
                          <a
                            href={`https://skywalker.infura-ipfs.io/ipfs/${verifiedIpfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Verified Content on IPFS</span>
                          </a>
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

export default ZkCDNSearch;