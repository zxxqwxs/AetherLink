export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers: {
    default: { name: string; url: string };
  };
}

export const polygonMumbai: ChainConfig = {
  id: 80001,
  name: 'Polygon Mumbai',
  network: 'maticmum',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-mumbai.maticvigil.com'] },
    public: { http: ['https://rpc-mumbai.maticvigil.com'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com' },
  },
};

export const polygonZkEVM: ChainConfig = {
  id: 1101,
  name: 'Polygon zkEVM',
  network: 'polygon-zkevm',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://zkevm-rpc.com'] },
    public: { http: ['https://zkevm-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://zkevm.polygonscan.com' },
  },
};

export const chains = [polygonMumbai, polygonZkEVM];
