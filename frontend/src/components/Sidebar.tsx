import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const router = useRouter();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Explore', href: '/explore', icon: '🔍' },
    { name: 'My Network', href: '/network', icon: '🌐' },
    { name: 'Reputation', href: '/reputation', icon: '⭐' },
    { name: 'Proofs', href: '/proofs', icon: '🔒' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <aside
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed md:relative inset-y-0 left-0 w-64 bg-black/40 backdrop-blur-sm border-r border-purple-500/20 transition-transform duration-300 z-40`}
    >
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:bg-purple-600/10 hover:text-white'
            }`}
            onClick={onClose}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
