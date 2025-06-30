import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { yelpService } from "./services/yelp";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all businesses
  app.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Search businesses
  app.get("/api/businesses/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const businesses = await storage.searchBusinesses(q);
      res.json(businesses);
    } catch (error) {
      console.error("Error searching businesses:", error);
      res.status(500).json({ message: "Failed to search businesses" });
    }
  });

  // Get businesses by category
  app.get("/api/businesses/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const businesses = await storage.getBusinessesByCategory(category);
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses by category:", error);
      res.status(500).json({ message: "Failed to fetch businesses by category" });
    }
  });

  // Get business by ID
  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }

      const business = await storage.getBusinessById(id);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  // Get reviews for a business
  app.get("/api/businesses/:id/reviews", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      if (isNaN(businessId)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }

      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      // Get local reviews
      const localReviews = await storage.getReviewsByBusinessId(businessId);
      
      // Try to get Yelp reviews if Yelp ID exists
      let yelpReviews: any[] = [];
      if (business.yelpId) {
        try {
          yelpReviews = await yelpService.getBusinessReviews(business.yelpId);
        } catch (error) {
          console.warn("Could not fetch Yelp reviews:", error);
        }
      }

      // Combine and format reviews
      const allReviews = [
        ...localReviews,
        ...yelpReviews.map(review => ({
          id: `yelp-${review.id}`,
          businessId,
          author: review.user.name,
          rating: review.rating,
          text: review.text,
          date: review.time_created.split(' ')[0]
        }))
      ];

      res.json(allReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get business categories
  app.get("/api/categories", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      const categories = Array.from(new Set(businesses.map(b => b.category)));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Sync with Yelp (update business data from Yelp)
  app.post("/api/businesses/:id/sync-yelp", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      if (isNaN(businessId)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }

      const business = await storage.getBusinessById(businessId);
      if (!business || !business.yelpId) {
        return res.status(404).json({ message: "Business not found or no Yelp ID" });
      }

      try {
        const yelpBusiness = await yelpService.getBusinessDetails(business.yelpId);
        
        // Update business with latest Yelp data
        const updatedBusiness = await storage.updateBusiness(businessId, {
          rating: yelpBusiness.rating,
          reviewCount: yelpBusiness.review_count,
          isOpen: !yelpBusiness.is_closed,
          phone: yelpBusiness.display_phone || business.phone,
        });

        res.json(updatedBusiness);
      } catch (yelpError) {
        console.error("Yelp sync error:", yelpError);
        res.status(500).json({ message: "Failed to sync with Yelp" });
      }
    } catch (error) {
      console.error("Error syncing with Yelp:", error);
      res.status(500).json({ message: "Failed to sync business data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
