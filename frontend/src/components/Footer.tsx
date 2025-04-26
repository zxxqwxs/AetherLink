import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              AetherLink
            </h3>
            <p className="text-gray-400 text-sm">
              Decentralized social trust protocol powered by zero-knowledge proofs.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/explore" className="text-gray-400 hover:text-white text-sm transition-colors">Explore</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white text-sm transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="text-gray-400 hover:text-white text-sm transition-colors">API</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="https://discord.gg/aetherlink" className="text-gray-400 hover:text-white text-sm transition-colors">Discord</a></li>
              <li><a href="https://twitter.com/aetherlinkdao" className="text-gray-400 hover:text-white text-sm transition-colors">Twitter</a></li>
              <li><a href="https://github.com/aetherlink" className="text-gray-400 hover:text-white text-sm transition-colors">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="text-gray-400 hover:text-white text-sm transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-purple-500/20">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} AetherLink. Built with ❤️ by the AetherLink team.
          </p>
        </div>
      </div>
    </footer>
  );
}
