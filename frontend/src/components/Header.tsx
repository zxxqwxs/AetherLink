import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              AetherLink
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="text-gray-300 hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
