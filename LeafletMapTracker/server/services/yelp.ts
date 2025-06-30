interface YelpBusiness {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  categories: Array<{ title: string }>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  phone: string;
  display_phone: string;
  is_closed: boolean;
  url: string;
  hours?: Array<{
    open: Array<{
      is_overnight: boolean;
      start: string;
      end: string;
      day: number;
    }>;
  }>;
}

interface YelpReview {
  id: string;
  rating: number;
  user: {
    name: string;
  };
  text: string;
  time_created: string;
}

export class YelpService {
  private apiKey: string;
  private baseUrl = 'https://api.yelp.com/v3';

  constructor() {
    this.apiKey = process.env.YELP_API_KEY || process.env.YELP_FUSION_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Yelp API key not found. Yelp integration will not work.');
    }
  }

  async searchBusinesses(location: string, categories?: string, limit = 20): Promise<YelpBusiness[]> {
    if (!this.apiKey) {
      throw new Error('Yelp API key not configured');
    }

    try {
      const params = new URLSearchParams({
        location,
        limit: limit.toString(),
        sort_by: 'rating',
        ...(categories && { categories })
      });

      const response = await fetch(`${this.baseUrl}/businesses/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Yelp API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.businesses || [];
    } catch (error) {
      console.error('Error fetching Yelp businesses:', error);
      throw error;
    }
  }

  async getBusinessDetails(businessId: string): Promise<YelpBusiness> {
    if (!this.apiKey) {
      throw new Error('Yelp API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Yelp API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Yelp business details:', error);
      throw error;
    }
  }

  async getBusinessReviews(businessId: string): Promise<YelpReview[]> {
    if (!this.apiKey) {
      throw new Error('Yelp API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/businesses/${businessId}/reviews`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Yelp API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Error fetching Yelp reviews:', error);
      throw error;
    }
  }
}

export const yelpService = new YelpService();
