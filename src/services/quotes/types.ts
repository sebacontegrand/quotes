export interface Quote {
  id: string;
  quote: string;
  movie: string;
  type?: 'movie' | 'show';
}

export interface QuoteProvider {
  getRandomQuote(): Promise<Quote>;
}
