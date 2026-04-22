import { storage, StorageKeys } from '../../storage/storageHelper';
import { FALLBACK_QUOTES } from './fallback';
import { Quote, QuoteProvider } from './types';
import i18n from '../../i18n';

class ApiQuoteProvider implements QuoteProvider {
    // Using a stable random movie quote API
    private readonly apiUrl = 'https://movie-quote-api.herokuapp.com/v1/quote/';

    async getRandomQuote(): Promise<Quote> {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            // Map API response to our Quote interface
            // Expected API response: { "quote": "...", "role": "...", "show": "...", "contain_adult_content": false }
            if (data && data.quote) {
                return {
                    id: Date.now().toString(),
                    quote: data.quote,
                    movie: data.show || i18n.t('common.unknown_source'),
                    type: 'movie', // Defaulting to movie
                };
            }

            throw new Error('Invalid API response structure');
        } catch (error) {
            console.warn('ApiQuoteProvider failed, using fallback:', error);
            throw error;
        }
    }
}

class QuoteService {
    private apiProvider = new ApiQuoteProvider();

    private getFallbackQuote(): Quote {
        const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        return FALLBACK_QUOTES[randomIndex];
    }

    private getTodayDateString(): string {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }

    async getDailyQuote(): Promise<Quote> {
        const today = this.getTodayDateString();
        const lastFetchedDate = await storage.get<string>(StorageKeys.LAST_FETCHED_DATE);
        const storedQuote = await storage.get<Quote>(StorageKeys.QUOTE_OF_THE_DAY);
        const useOfflineOnly = await storage.get<boolean>(StorageKeys.USE_OFFLINE_ONLY);

        // If it's still today and we have a stored quote, return it
        if (lastFetchedDate === today && storedQuote) {
            return storedQuote;
        }

        // Otherwise, fetch a new one
        let newQuote: Quote;

        if (useOfflineOnly) {
            newQuote = this.getFallbackQuote();
        } else {
            try {
                newQuote = await this.apiProvider.getRandomQuote();
            } catch (error) {
                newQuote = this.getFallbackQuote();
            }
        }

        // Save for today
        await storage.save(StorageKeys.LAST_FETCHED_DATE, today);
        await storage.save(StorageKeys.QUOTE_OF_THE_DAY, newQuote);

        return newQuote;
    }

    async toggleFavorite(quote: Quote): Promise<boolean> {
        const favorites = await storage.get<Quote[]>(StorageKeys.FAVORITES) || [];
        const index = favorites.findIndex(f => f.quote === quote.quote);

        let newFavorites: Quote[];
        let isFavorite: boolean;

        if (index > -1) {
            newFavorites = favorites.filter(f => f.quote !== quote.quote);
            isFavorite = false;
        } else {
            newFavorites = [...favorites, quote];
            isFavorite = true;
        }

        await storage.save(StorageKeys.FAVORITES, newFavorites);
        return isFavorite;
    }

    async isFavorite(quote: Quote): Promise<boolean> {
        const favorites = await storage.get<Quote[]>(StorageKeys.FAVORITES) || [];
        return favorites.some(f => f.quote === quote.quote);
    }

    async getFavorites(): Promise<Quote[]> {
        return await storage.get<Quote[]>(StorageKeys.FAVORITES) || [];
    }
}

export const quoteService = new QuoteService();
export { Quote };
