export interface PolymarketMarket {
  id: string;
  question: string;
  description?: string;
  image?: string;
  end_date_iso: string;
  created_at: string;
  volume: number;
  liquidity: number;
  fee: number;
  outcomes: PolymarketOutcome[];
  market_maker: string;
  condition_id: string;
  resolution_source?: string;
  end_date: number;
  created_at_timestamp: number;
  closed: boolean;
  archived: boolean;
  winner_outcome_id?: string;
  resolution?: string;
}

export interface PolymarketOutcome {
  id: string;
  name: string;
  price: number;
  volume: number;
  liquidity: number;
  last_price: number;
  last_price_change: number;
  last_price_change_percent: number;
}

export interface PolymarketSearchResult {
  markets: PolymarketMarket[];
  total: number;
  page: number;
  limit: number;
}

export interface PolymarketPriceHistory {
  timestamp: number;
  price: number;
  volume: number;
}

export interface PolymarketMarketDetails extends PolymarketMarket {
  price_history: PolymarketPriceHistory[];
  statistics: {
    total_volume: number;
    total_liquidity: number;
    total_fees: number;
    unique_traders: number;
    last_trade_at: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}
