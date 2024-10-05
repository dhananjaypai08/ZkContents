import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Database, Cloud, Lock, Menu, UploadCloudIcon, FileDownIcon, MessageCircleIcon, ChartAreaIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-gray-100 min-h-screen font-inter overflow-hidden">

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-blue-900 opacity-10 transform -skew-y-6"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Decentralized Content Delivery
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            zkCDN leverages zero-knowledge proofs for a privacy-preserving content delivery network, ensuring authenticity without compromising data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/contentprovider"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
            >
              Content Provider
              <UploadCloudIcon className="ml-2 h-5 w-5" />
            </motion.a>
            <motion.a
              href="/search"
              className="bg-gradient-to-r from-blue-500 to-indigo-800 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
            >
              Get Content
              <FileDownIcon className="ml-2 h-5 w-5" />
            </motion.a>
            <motion.a
              href="/dashboard"
              className="bg-gradient-to-r from-blue-500 to-indigo-800 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
            >
              Graph Dashboard
              <ChartAreaIcon className="ml-2 h-5 w-5" />
            </motion.a>
            <motion.a
              href="/graphchatbot"
              className="bg-gradient-to-r from-blue-500 to-indigo-800 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
            >
              Chat with Subgraph Data
              <MessageCircleIcon className="ml-2 h-5 w-5" />
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-blue-400" />}
              title="Privacy-Preserving"
              description="Protect your content and user data with cutting-edge zero-knowledge proofs."
            />
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-purple-400" />}
              title="Lightning-Fast"
              description="Experience blazing-fast content delivery across our global network."
            />
            <FeatureCard
              icon={<Globe className="h-12 w-12 text-green-400" />}
              title="Global Reach"
              description="Deliver your content seamlessly to users worldwide with our distributed infrastructure."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Use Cases
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <UseCaseCard
              icon={<Database className="h-12 w-12 text-blue-400" />}
              title="Private Data Hosting"
              description="Securely host and distribute your sensitive data without exposing it to unauthorized parties."
            />
            <UseCaseCard
              icon={<Cloud className="h-12 w-12 text-purple-400" />}
              title="Decentralized Apps"
              description="Build and deploy decentralized applications with confidence in content integrity and delivery."
            />
            <UseCaseCard
              icon={<Lock className="h-12 w-12 text-green-400" />}
              title="Secure Content Distribution"
              description="Distribute copyrighted or sensitive content with enhanced protection and access control."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-5xl mx-auto text-white text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Join the zkCDN Revolution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl mb-8"
          >
            Experience the future of content delivery with uncompromising privacy and performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
            <motion.a
              href="#"
              className="bg-transparent hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 border border-white hover:border-transparent shadow-lg"
              whileHover={{ boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)" }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 zkCDN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-100">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const UseCaseCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-100">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

export default LandingPage;