import { businesses, reviews, type Business, type InsertBusiness, type Review, type InsertReview, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Business methods
  getAllBusinesses(): Promise<Business[]>;
  getBusinessById(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  searchBusinesses(query: string): Promise<Business[]>;
  getBusinessesByCategory(category: string): Promise<Business[]>;
  
  // Review methods
  getReviewsByBusinessId(businessId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private businesses: Map<number, Business> = new Map();
  private reviews: Map<number, Review> = new Map();
  private users: Map<number, User> = new Map();
  private businessCurrentId = 1;
  private reviewCurrentId = 1;
  private userCurrentId = 1;

  constructor() {
    // Initialize with sample Pleasanton businesses
    this.initializeBusinesses();
  }

  private initializeBusinesses() {
    const sampleBusinesses: Omit<Business, 'id'>[] = [
      {
        name: "Blue Agave Club",
        category: "Restaurants",
        description: "Upscale Mexican cuisine in a historic building with a lovely patio. Known for their authentic flavors and craft margaritas.",
        phone: "(925) 555-0123",
        website: "https://blueagaveclub.com",
        address: "123 Main St, Pleasanton, CA 94566",
        latitude: 37.661871,
        longitude: -121.874397,
        hours: {
          "Monday": "11:00 AM - 10:00 PM",
          "Tuesday": "11:00 AM - 10:00 PM",
          "Wednesday": "11:00 AM - 10:00 PM",
          "Thursday": "11:00 AM - 10:00 PM",
          "Friday": "11:00 AM - 11:00 PM",
          "Saturday": "11:00 AM - 11:00 PM",
          "Sunday": "11:00 AM - 9:00 PM"
        },
        rating: 4.5,
        reviewCount: 127,
        isOpen: true,
        yelpId: "blue-agave-club-pleasanton",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
        ]
      },
      {
        name: "Inklings Coffee & Tea",
        category: "Cafés",
        description: "Charming coffee shop with rustic decor and a relaxed vibe. Perfect for remote work and studying.",
        phone: "(925) 555-0156",
        website: "https://inklingscoffee.com",
        address: "456 Main St, Pleasanton, CA 94566",
        latitude: 37.661491,
        longitude: -121.874916,
        hours: {
          "Monday": "6:00 AM - 8:00 PM",
          "Tuesday": "6:00 AM - 8:00 PM",
          "Wednesday": "6:00 AM - 8:00 PM",
          "Thursday": "6:00 AM - 8:00 PM",
          "Friday": "6:00 AM - 9:00 PM",
          "Saturday": "7:00 AM - 9:00 PM",
          "Sunday": "7:00 AM - 7:00 PM"
        },
        rating: 4.2,
        reviewCount: 89,
        isOpen: true,
        yelpId: "inklings-coffee-tea-pleasanton",
        imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop"
        ]
      },
      {
        name: "Prim Boutique",
        category: "Shopping",
        description: "Trendy women's clothing boutique with curated fashion collections and personal styling services.",
        phone: "(925) 555-0178",
        website: "https://primboutique.com",
        address: "789 Main St, Pleasanton, CA 94566",
        latitude: 37.661763,
        longitude: -121.875523,
        hours: {
          "Monday": "10:00 AM - 7:00 PM",
          "Tuesday": "10:00 AM - 7:00 PM",
          "Wednesday": "10:00 AM - 7:00 PM",
          "Thursday": "10:00 AM - 7:00 PM",
          "Friday": "10:00 AM - 8:00 PM",
          "Saturday": "10:00 AM - 8:00 PM",
          "Sunday": "11:00 AM - 6:00 PM"
        },
        rating: 4.8,
        reviewCount: 42,
        isOpen: false,
        yelpId: "prim-boutique-pleasanton",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=600&fit=crop"
        ]
      },
      {
        name: "Museum on Main",
        category: "Attractions",
        description: "Local history museum with educational exhibits and family programs showcasing Pleasanton's heritage.",
        phone: "(925) 555-0189",
        website: "https://museumonmain.org",
        address: "603 Main St, Pleasanton, CA 94566",
        latitude: 37.662096,
        longitude: -121.875302,
        hours: {
          "Monday": "Closed",
          "Tuesday": "10:00 AM - 4:00 PM",
          "Wednesday": "10:00 AM - 4:00 PM",
          "Thursday": "10:00 AM - 4:00 PM",
          "Friday": "10:00 AM - 4:00 PM",
          "Saturday": "10:00 AM - 4:00 PM",
          "Sunday": "1:00 PM - 4:00 PM"
        },
        rating: 4.1,
        reviewCount: 33,
        isOpen: true,
        yelpId: "museum-on-main-pleasanton",
        imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
        ]
      },
      {
        name: "Meadowlark Dairy",
        category: "Dessert",
        description: "Classic drive-thru dairy known for giant soft-serve cones and nostalgic charm.",
        phone: "(925) 555-0145",
        website: null,
        address: "301 Ray St, Pleasanton, CA 94566",
        latitude: 37.663014,
        longitude: -121.875919,
        hours: {
          "Monday": "11:00 AM - 9:00 PM",
          "Tuesday": "11:00 AM - 9:00 PM",
          "Wednesday": "11:00 AM - 9:00 PM",
          "Thursday": "11:00 AM - 9:00 PM",
          "Friday": "11:00 AM - 10:00 PM",
          "Saturday": "11:00 AM - 10:00 PM",
          "Sunday": "11:00 AM - 9:00 PM"
        },
        rating: 4.6,
        reviewCount: 156,
        isOpen: true,
        yelpId: "meadowlark-dairy-pleasanton",
        imageUrl: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop"
        ]
      },
      {
        name: "Beer Baron Bar & Kitchen",
        category: "Restaurants",
        description: "Craft cocktails, beer flights, and comfort food in a cool setting with live music.",
        phone: "(925) 555-0167",
        website: "https://beerbaronbar.com",
        address: "714 Main St, Pleasanton, CA 94566",
        latitude: 37.662188,
        longitude: -121.874796,
        hours: {
          "Monday": "4:00 PM - 12:00 AM",
          "Tuesday": "4:00 PM - 12:00 AM",
          "Wednesday": "4:00 PM - 12:00 AM",
          "Thursday": "4:00 PM - 1:00 AM",
          "Friday": "4:00 PM - 2:00 AM",
          "Saturday": "2:00 PM - 2:00 AM",
          "Sunday": "2:00 PM - 11:00 PM"
        },
        rating: 4.3,
        reviewCount: 98,
        isOpen: true,
        yelpId: "beer-baron-bar-kitchen-pleasanton",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
        ]
      }
    ];

    sampleBusinesses.forEach(business => {
      const id = this.businessCurrentId++;
      this.businesses.set(id, { 
        ...business, 
        id,
        phone: business.phone || null,
        website: business.website || null,
        hours: business.hours || null,
        rating: business.rating || null,
        reviewCount: business.reviewCount || null,
        isOpen: business.isOpen !== undefined ? business.isOpen : null,
        yelpId: business.yelpId || null,
        imageUrl: business.imageUrl || null,
        images: business.images || null
      });
    });

    // Add sample reviews
    const sampleReviews: Omit<Review, 'id'>[] = [
      {
        businessId: 1,
        author: "Sarah M.",
        rating: 5,
        text: "Amazing atmosphere and incredible food! The patio is perfect for dinner with friends.",
        date: "2024-01-15"
      },
      {
        businessId: 2,
        author: "Mike R.",
        rating: 4,
        text: "Great coffee and cozy atmosphere. WiFi is reliable for working remotely.",
        date: "2024-01-10"
      },
      {
        businessId: 3,
        author: "Emma L.",
        rating: 5,
        text: "Beautiful selection and amazing personal styling service. Highly recommend!",
        date: "2024-01-08"
      }
    ];

    sampleReviews.forEach(review => {
      const id = this.reviewCurrentId++;
      this.reviews.set(id, { ...review, id });
    });
  }

  async getAllBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values());
  }

  async getBusinessById(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const id = this.businessCurrentId++;
    const newBusiness: Business = { ...business, id };
    this.businesses.set(id, newBusiness);
    return newBusiness;
  }

  async updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined> {
    const existing = this.businesses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...business };
    this.businesses.set(id, updated);
    return updated;
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.businesses.values()).filter(business =>
      business.name.toLowerCase().includes(lowercaseQuery) ||
      business.description.toLowerCase().includes(lowercaseQuery) ||
      business.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    if (category === "All") {
      return this.getAllBusinesses();
    }
    return Array.from(this.businesses.values()).filter(business =>
      business.category === category
    );
  }

  async getReviewsByBusinessId(businessId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review =>
      review.businessId === businessId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const newReview: Review = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
