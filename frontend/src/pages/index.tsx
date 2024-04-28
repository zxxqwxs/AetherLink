import { useState, useEffect } from 'react';
import Head from 'next/head';
import GraphVisualization from '@/components/GraphVisualization';
import ConnectWallet from '@/components/ConnectWallet';
import NodeRegistry from '@/components/NodeRegistry';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      <Head>
        <title>AetherLink - Decentralized Social Trust Protocol</title>
        <meta name="description" content="Privacy-preserving social relationship graph using zero-knowledge proofs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  AetherLink
                </h1>
              </div>
              <ConnectWallet onConnect={setIsConnected} />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!isConnected ? (
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to AetherLink
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                A decentralized social trust protocol powered by zero-knowledge proofs
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <FeatureCard
                  title="Privacy First"
                  description="Prove relationships without revealing sensitive connection paths"
                  icon="🔒"
                />
                <FeatureCard
                  title="Trust Scores"
                  description="Build verifiable reputation through network interactions"
                  icon="⭐"
                />
                <FeatureCard
                  title="Decentralized"
                  description="No central authority controls your social graph"
                  icon="🌐"
                />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Social Graph Visualization
                  </h3>
                  <GraphVisualization />
                </div>
              </div>
              <div className="space-y-6">
                <NodeRegistry />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6 hover:border-purple-500/40 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

