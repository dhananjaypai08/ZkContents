import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import {
  Search, Filter, RefreshCw, Database, Hash,
  Clock, ArrowUpRight, GitBranch, Shield,
  ChevronDown, Activity, Layers, AlertCircle
} from 'lucide-react';

// Mock data generator for empty states
const generateMockData = (type) => {
  switch (type) {
    case 'mints':
      return Array.from({ length: 10 }, (_, i) => ({
        encrypted_cid: Math.random().toString(36).substring(7),
        to: `0x${Math.random().toString(36).substring(7)}`,
        transactionHash: `0x${Math.random().toString(36).substring(7)}`,
        timestamp: Date.now() - i * 3600000
      }));
    case 'transfers':
      return Array.from({ length: 10 }, (_, i) => ({
        from: `0x${Math.random().toString(36).substring(7)}`,
        to: `0x${Math.random().toString(36).substring(7)}`,
        tokenId: String(i + 1),
        transactionHash: `0x${Math.random().toString(36).substring(7)}`,
        timestamp: Date.now() - i * 3600000
      }));
    // Add cases for other query types...
    default:
      return [];
  }
};

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/90589/zkcdngraph/version/latest',
  cache: new InMemoryCache(),
});

const QUERIES = {
  mints: gql`{
    mints(orderBy: id) {
      encrypted_cid
      to
      transactionHash
    }
  }`,
  transfers: gql`{
    transfers(orderBy: id) {
      from
      to
      tokenId
      transactionHash
    }
  }`,
  mappings: gql`{
    mappings(orderBy: id) {
      encrypted_cid
      transactionHash
      blockNumber
    }
  }`,
  encryptedCIDs: gql`{
    encryptedCIDs(orderBy: id) {
      encrypted_cid
      transactionHash
    }
  }`,
  ownershipTransferreds: gql`{
    ownershipTransferreds(orderBy: id) {
      blockNumber
      newOwner
      id
      previousOwner
    }
  }`
};

const GraphDashboard = () => {
  const [activeQuery, setActiveQuery] = useState('mints');
  const [queryData, setQueryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('activity');

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await client.query({
        query: QUERIES[activeQuery]
      });
      
      let fetchedData = result.data[activeQuery];
      if (!fetchedData || fetchedData.length === 0) {
        fetchedData = generateMockData(activeQuery);
      }
      
      // Add timestamp if not present
      fetchedData = fetchedData.map((item, index) => ({
        ...item,
        timestamp: item.timestamp || (Date.now() - index * 3600000)
      }));

      setQueryData(fetchedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Use mock data on error
      setQueryData(generateMockData(activeQuery));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeQuery]);

  // Enhanced search functionality
  const filteredData = queryData.filter(item => 
    Object.entries(item).some(([key, value]) => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Prepare time series data
  const getTimeSeriesData = () => {
    const timeRanges = {
      '24h': 24,
      '7d': 168,
      '30d': 720
    };

    const hours = timeRanges[timeRange];
    const now = Date.now();
    const timeData = Array.from({ length: hours }, (_, i) => ({
      time: new Date(now - (hours - i) * 3600000).toISOString(),
      count: 0
    }));

    queryData.forEach(item => {
      const itemTime = new Date(item.timestamp);
      const hourIndex = Math.floor((now - itemTime) / 3600000);
      if (hourIndex >= 0 && hourIndex < hours) {
        timeData[hours - 1 - hourIndex].count++;
      }
    });

    return timeData;
  };

  // Get statistics for the current data
  const getStatistics = () => {
    const stats = {
      totalTransactions: queryData.length,
      uniqueAddresses: new Set(queryData.map(item => item.to || item.from)).size,
      averageValue: queryData.reduce((acc, item) => 
        acc + (parseFloat(item.value || 0)), 0) / queryData.length || 0,
      activityTrend: queryData.length > 0 ? 
        (queryData[0].timestamp - queryData[queryData.length - 1].timestamp) / queryData.length : 0
    };
    return stats;
  };

  const ChartDescription = ({ type }) => {
    const descriptions = {
      activity: "This chart shows the transaction activity over time. Spikes indicate periods of high activity, while troughs show quieter periods.",
      distribution: "The pie chart represents the distribution of transactions across different addresses. Larger segments indicate addresses with more activity.",
      trend: "This trend analysis shows the moving average of transaction volume, helping identify patterns and potential market movements."
    };

    return (
      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <p className="text-sm text-gray-300">{descriptions[type]}</p>
        </div>
      </div>
    );
  };

  const TimeSeriesChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="time" 
          tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
          stroke="#9CA3AF"
        />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload?.[0]) {
              return (
                <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
                  <p className="text-white font-medium">
                    {new Date(label).toLocaleString()}
                  </p>
                  <p className="text-blue-400">
                    Count: {payload[0].value}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header section remains the same */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Graph Protocol Analytics
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                autoRefresh ? 'bg-blue-500' : 'bg-gray-800'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}</span>
            </button> */}
          </div>
        </div>
        
        {/* Enhanced Data Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Transaction Activity</h3>
              <div className="flex space-x-2">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded ${
                      timeRange === range 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <TimeSeriesChart data={getTimeSeriesData()} />
            <ChartDescription type="activity" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-6">Address Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={queryData.slice(0, 5).map(item => ({
                    address: item.to || item.from,
                    value: 1
                  }))}
                  dataKey="value"
                  nameKey="address"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ address }) => address.slice(0, 6) + '...'}
                >
                  {queryData.slice(0, 5).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={[
                        '#3B82F6',
                        '#8B5CF6',
                        '#10B981',
                        '#F59E0B',
                        '#EF4444'
                      ][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
                          <p className="text-white font-medium">
                            {`${data.address.slice(0, 6)}...${data.address.slice(-4)}`}
                          </p>
                          <p className="text-blue-400">
                            Transactions: {data.value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ChartDescription type="distribution" />
          </motion.div>
        </div>

        {/* Enhanced Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl overflow-hidden"
        >
          <div className="p-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Transaction Data</h3>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={fetchData}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  {filteredData[0] && Object.keys(filteredData[0]).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700"
                  >
                    {Object.entries(item).map(([key, value], i) => (
                      <td key={i} className="px-6 py-4 text-sm">
                        {key === 'timestamp' 
                          ? new Date(value).toLocaleString()
                          : typeof value === 'string' && value.startsWith('0x')
                            ? `${value.slice(0, 6)}...${value.slice(-4)}`
                            : value}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GraphDashboard;