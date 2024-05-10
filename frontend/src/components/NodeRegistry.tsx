import { useState } from 'react';

export default function NodeRegistry() {
  const [metadata, setMetadata] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    if (!metadata.trim()) {
      alert('Please enter metadata');
      return;
    }

    setIsRegistering(true);
    try {
      // Placeholder for actual contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Node registered successfully!');
      setMetadata('');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register node');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Node Registry</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Node Metadata (IPFS Hash or JSON)
          </label>
          <textarea
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder="Enter your node metadata..."
            className="w-full px-3 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all font-medium disabled:opacity-50"
        >
          {isRegistering ? 'Registering...' : 'Register Node'}
        </button>

        <div className="mt-6 pt-6 border-t border-purple-500/20">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Your Stats</h4>
          <div className="space-y-2">
            <StatItem label="Reputation Score" value="850/1000" />
            <StatItem label="Connections" value="12" />
            <StatItem label="Verified Proofs" value="8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-purple-300 font-semibold">{value}</span>
    </div>
  );
}

