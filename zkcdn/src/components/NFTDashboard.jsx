import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Alchemy, Network } from 'alchemy-sdk';
import { Loader2, TrendingUp, Wallet, Hexagon, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

const config = {
  apiKey: "YrcRBtPyzQZxWtNt-Cd8sYXh46GSSczW",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

const NFTDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [uniqueSenders, setUniqueSenders] = useState(0);
  const [topSenders, setTopSenders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const toAddress = "0x5d37431b1356D8CC54f3dd77657e566830D73186";
      const res = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: "0x0000000000000000000000000000000000000000",
        toAddress: toAddress,
        excludeZeroValue: true,
        category: ["erc721", "erc1155"],
      });

      setTransfers(res.transfers);
      processData(res.transfers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const processData = (data) => {
    const total = data.reduce((sum, transfer) => sum + parseFloat(transfer.value || 0), 0);
    setTotalValue(total.toFixed(4));

    const senders = new Set(data.map(transfer => transfer.from));
    setUniqueSenders(senders.size);

    const senderCounts = data.reduce((acc, transfer) => {
      acc[transfer.from] = (acc[transfer.from] || 0) + 1;
      return acc;
    }, {});

    const sortedSenders = Object.entries(senderCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([address, count]) => ({ address, count }));

    setTopSenders(sortedSenders);
  };

  const MetricCard = ({ title, value, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="p-3 bg-blue-500 rounded-full">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const BarChartComponent = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="address" tick={false} />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-gray-800 p-2 rounded shadow-lg">
                  <p className="text-sm text-gray-300">{`Address: ${payload[0].payload.address.slice(0, 6)}...${payload[0].payload.address.slice(-4)}`}</p>
                  <p className="text-sm font-bold text-white">{`Count: ${payload[0].value}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="count" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );

  const PieChartComponent = ({ data }) => {
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-800 p-2 rounded shadow-lg">
                    <p className="text-sm text-gray-300">{`Address: ${payload[0].payload.address.slice(0, 6)}...${payload[0].payload.address.slice(-4)}`}</p>
                    <p className="text-sm font-bold text-white">{`Count: ${payload[0].value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          NFT Transactions Dashboard
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard title="Total Transactions" value={transfers.length} icon={TrendingUp} />
              <MetricCard title="Total Value (ETH)" value={totalValue} icon={Wallet} />
              <MetricCard title="Unique Senders" value={uniqueSenders} icon={Hexagon} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BarChartIcon className="w-6 h-6 mr-2 text-blue-400" />
                Top Senders
              </h2>
              <BarChartComponent data={topSenders} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <PieChartIcon className="w-6 h-6 mr-2 text-purple-400" />
                Transaction Distribution
              </h2>
              <PieChartComponent data={topSenders} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asset</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {transfers.slice(0, 5).map((transfer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{`${transfer.from.slice(0, 6)}...${transfer.from.slice(-4)}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{`${transfer.to.slice(0, 6)}...${transfer.to.slice(-4)}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transfer.value || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transfer.asset}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDashboard;