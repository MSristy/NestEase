import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Property, PropertyStatus } from '../properties/property.entity';
import { PropertyBooking } from '../properties/property-booking.entity';
import { PropertyPurchase } from '../properties/entities/property-purchase.entity';
import { User } from '../users/entities/user.entity';

interface UserPreferences {
  preferredLocations: string[];
  priceRange: { min: number; max: number };
  preferredAmenities: string[];
  propertyType: 'RENT' | 'SALE';
  bedrooms?: number;
  bathrooms?: number;
}

interface RecommendationScore {
  propertyId: string;
  score: number;
  reasons: string[];
  property: Property;
}

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(PropertyBooking)
    private bookingRepository: Repository<PropertyBooking>,
    @InjectRepository(PropertyPurchase)
    private purchaseRepository: Repository<PropertyPurchase>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Get personalized property recommendations for a user
   */
  async getPropertyRecommendations(userId: number, limit: number = 10): Promise<RecommendationScore[]> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Get user preferences based on their role and history
      const userPreferences = await this.extractUserPreferences(userId, user.role);
      
      // Get available properties
      const availableProperties = await this.propertyRepository.find({
        where: { status: PropertyStatus.AVAILABLE },
        relations: ['owner'],
      });

      if (availableProperties.length === 0) {
        return [];
      }

      // Calculate recommendation scores
      const recommendations = await Promise.all(
        availableProperties.map(async (property) => {
          const score = await this.calculatePropertyScore(property, userPreferences, userId);
          return {
            propertyId: property.id,
            score,
            reasons: this.generateRecommendationReasons(property, userPreferences),
            property,
          };
        })
      );

      // Sort by score and return top recommendations
      return recommendations
        .filter(rec => rec.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error in getPropertyRecommendations:', error);
      return [];
    }
  }

  /**
   * Extract user preferences from their history and profile
   */
  private async extractUserPreferences(userId: number, userRole: string): Promise<UserPreferences> {
    const preferences: UserPreferences = {
      preferredLocations: [],
      priceRange: { min: 0, max: 1000000 },
      preferredAmenities: [],
      propertyType: userRole === 'TENANT' ? 'RENT' : 'SALE',
    };

    try {
      // Get user's booking/purchase history
      let history: any[] = [];
      if (userRole === 'TENANT') {
        history = await this.bookingRepository.find({
          where: { tenant: { id: userId } },
          relations: ['property'],
        });
      } else if (userRole === 'BUYER') {
        history = await this.purchaseRepository.find({
          where: { buyer: { id: userId } },
          relations: ['property'],
        });
      }

      // Extract preferences from history
      if (history.length > 0) {
        const prices = history.map(item => item.property?.price || 0).filter(p => p > 0);
        if (prices.length > 0) {
          preferences.priceRange = {
            min: Math.min(...prices) * 0.7, // 30% below minimum
            max: Math.max(...prices) * 1.3, // 30% above maximum
          };
        }

        // Extract locations
        const locations = history
          .map(item => item.property?.city)
          .filter(loc => loc)
          .reduce((acc, loc) => {
            acc[loc] = (acc[loc] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

        preferences.preferredLocations = Object.keys(locations)
          .sort((a, b) => locations[b] - locations[a])
          .slice(0, 3);

        // Extract amenities
        const allAmenities = history
          .flatMap(item => item.property?.amenities || [])
          .filter(amenity => amenity);

        const amenityCounts = allAmenities.reduce((acc, amenity) => {
          acc[amenity] = (acc[amenity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        preferences.preferredAmenities = Object.keys(amenityCounts)
          .sort((a, b) => amenityCounts[b] - amenityCounts[a])
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Error extracting user preferences:', error);
    }

    return preferences;
  }

  /**
   * Calculate recommendation score for a property
   */
  private async calculatePropertyScore(
    property: Property,
    preferences: UserPreferences,
    userId: number,
  ): Promise<number> {
    let score = 0;

    try {
      // 1. Price matching (40% weight)
      const priceScore = this.calculatePriceScore(property.price, preferences.priceRange);
      score += priceScore * 0.4;

      // 2. Location matching (25% weight)
      const locationScore = this.calculateLocationScore(property.city, preferences.preferredLocations);
      score += locationScore * 0.25;

      // 3. Amenity matching (20% weight)
      const amenityScore = this.calculateAmenityScore(property.amenities || [], preferences.preferredAmenities);
      score += amenityScore * 0.2;

      // 4. Property type matching (10% weight)
      const typeScore = property.type === preferences.propertyType ? 1 : 0;
      score += typeScore * 0.1;

      // 5. Similar user behavior (5% weight)
      const similarityScore = await this.calculateSimilarityScore(property, userId);
      score += similarityScore * 0.05;
    } catch (error) {
      console.error('Error calculating property score:', error);
      score = 0.5; // Default score
    }

    return score;
  }

  private calculatePriceScore(price: number, range: { min: number; max: number }): number {
    if (price >= range.min && price <= range.max) {
      return 1.0; // Perfect match
    } else if (price < range.min) {
      return Math.max(0, 1 - (range.min - price) / range.min); // Below range
    } else {
      return Math.max(0, 1 - (price - range.max) / range.max); // Above range
    }
  }

  private calculateLocationScore(propertyCity: string, preferredCities: string[]): number {
    if (preferredCities.length === 0) return 0.5; // Neutral if no preferences
    if (preferredCities.includes(propertyCity)) {
      return 1.0; // Exact match
    }
    return 0.3; // Partial match for other cities
  }

  private calculateAmenityScore(propertyAmenities: string[], preferredAmenities: string[]): number {
    if (preferredAmenities.length === 0) return 0.5;
    if (propertyAmenities.length === 0) return 0;

    const matchingAmenities = propertyAmenities.filter(amenity => 
      preferredAmenities.includes(amenity)
    );

    return matchingAmenities.length / preferredAmenities.length;
  }

  private async calculateSimilarityScore(property: Property, userId: number): Promise<number> {
    try {
      // Find users who have booked/purchased similar properties
      const similarUsers = await this.bookingRepository.find({
        where: { property: { city: property.city, type: property.type } },
        relations: ['tenant'],
      });

      if (similarUsers.length === 0) return 0.5;

      // Check if current user has similar behavior
      const userBookings = await this.bookingRepository.find({
        where: { tenant: { id: userId } },
        relations: ['property'],
      });

      const userCities = userBookings.map(b => b.property?.city).filter(Boolean);
      const hasSimilarBehavior = userCities.includes(property.city);

      return hasSimilarBehavior ? 1.0 : 0.3;
    } catch (error) {
      console.error('Error calculating similarity score:', error);
      return 0.5;
    }
  }

  private generateRecommendationReasons(property: Property, preferences: UserPreferences): string[] {
    const reasons: string[] = [];

    try {
      // Price reason
      if (property.price >= preferences.priceRange.min && property.price <= preferences.priceRange.max) {
        reasons.push('Matches your budget');
      }

      // Location reason
      if (preferences.preferredLocations.includes(property.city)) {
        reasons.push('In your preferred location');
      }

      // Amenity reasons
      const matchingAmenities = (property.amenities || []).filter(amenity => 
        preferences.preferredAmenities.includes(amenity)
      );
      if (matchingAmenities.length > 0) {
        reasons.push(`Has ${matchingAmenities.length} amenities you prefer`);
      }

      // Type reason
      if (property.type === preferences.propertyType) {
        reasons.push(`Perfect for ${preferences.propertyType.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error generating recommendation reasons:', error);
    }

    return reasons;
  }

  /**
   * Get trending properties (most viewed/booked recently)
   */
  async getTrendingProperties(limit: number = 10): Promise<any[]> {
    try {
      // Get recent bookings (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentBookings = await this.bookingRepository.find({
        where: { createdAt: sevenDaysAgo },
        relations: ['property'],
      });

      // Count property views/bookings
      const propertyViews = recentBookings.reduce((acc, booking) => {
        const propertyId = booking.property?.id;
        if (propertyId) {
          acc[propertyId] = (acc[propertyId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // If no recent activity, return recent available properties
      if (Object.keys(propertyViews).length === 0) {
        console.log('No recent bookings found, returning recent available properties');
        const properties = await this.propertyRepository.find({
          where: { status: PropertyStatus.AVAILABLE },
          take: limit,
          order: { createdAt: 'DESC' },
        });
        
        // Convert to recommendation format
        return properties.map(property => ({
          propertyId: property.id,
          property,
          score: 0.7, // Default score for trending
          reasons: ['Recently added', 'Popular area']
        }));
      }

      const trendingPropertyIds = Object.keys(propertyViews)
        .sort((a, b) => propertyViews[b] - propertyViews[a])
        .slice(0, limit);

      // Get the actual properties using IN clause
      const trendingProperties = await this.propertyRepository
        .createQueryBuilder('property')
        .where('property.id IN (:...ids)', { ids: trendingPropertyIds })
        .andWhere('property.status = :status', { status: PropertyStatus.AVAILABLE })
        .orderBy(`FIELD(property.id, '${trendingPropertyIds.join("','")}')`)
        .take(limit)
        .getMany();

      // If we don't have enough trending properties, fill with recent available ones
      if (trendingProperties.length < limit) {
        const remainingLimit = limit - trendingProperties.length;
        const existingIds = trendingProperties.map(p => p.id);
        
        const additionalProperties = await this.propertyRepository.find({
          where: { 
            status: PropertyStatus.AVAILABLE,
            id: existingIds.length > 0 ? In(existingIds) : undefined // Exclude already selected properties
          },
          take: remainingLimit,
          order: { createdAt: 'DESC' },
        });

        trendingProperties.push(...additionalProperties);
      }

      console.log(`Returning ${trendingProperties.length} trending properties`);
      
      // Convert to recommendation format
      return trendingProperties.map(property => {
        const viewCount = propertyViews[property.id] || 0;
        const score = Math.min(0.9, 0.5 + (viewCount * 0.1)); // Score based on popularity
        
        return {
          propertyId: property.id,
          property,
          score,
          reasons: viewCount > 0 
            ? [`${viewCount} recent bookings`, 'Trending property']
            : ['Recently added', 'Popular area']
        };
      });
    } catch (error) {
      console.error('Error getting trending properties:', error);
      // Fallback: return recent available properties
      const properties = await this.propertyRepository.find({
        where: { status: PropertyStatus.AVAILABLE },
        take: limit,
        order: { createdAt: 'DESC' },
      });
      
      return properties.map(property => ({
        propertyId: property.id,
        property,
        score: 0.6,
        reasons: ['Recently added', 'Available now']
      }));
    }
  }

  /**
   * Get similar properties to a given property
   */
  async getSimilarProperties(propertyId: string, limit: number = 5): Promise<any[]> {
    try {
      const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
      if (!property) {
        throw new Error('Property not found');
      }

      const similarProperties = await this.propertyRepository.find({
        where: {
          city: property.city,
          type: property.type,
          status: PropertyStatus.AVAILABLE,
        },
        take: limit + 1, // +1 to account for the current property
      });

      // Filter out the current property and convert to recommendation format
      return similarProperties
        .filter(p => p.id !== propertyId)
        .slice(0, limit)
        .map(similarProperty => {
          const score = this.calculateSimilarityScoreForProperty(property, similarProperty);
          return {
            propertyId: similarProperty.id,
            property: similarProperty,
            score,
            reasons: this.generateSimilarityReasons(property, similarProperty)
          };
        });
    } catch (error) {
      console.error('Error getting similar properties:', error);
      return [];
    }
  }

  private calculateSimilarityScoreForProperty(original: Property, similar: Property): number {
    let score = 0.5; // Base score

    // Same city (+0.3)
    if (original.city === similar.city) {
      score += 0.3;
    }

    // Same type (+0.2)
    if (original.type === similar.type) {
      score += 0.2;
    }

    // Similar price range (+0.2)
    const priceDiff = Math.abs(original.price - similar.price) / original.price;
    if (priceDiff < 0.2) {
      score += 0.2;
    } else if (priceDiff < 0.5) {
      score += 0.1;
    }

    // Similar amenities (+0.1)
    const originalAmenities = original.amenities || [];
    const similarAmenities = similar.amenities || [];
    const commonAmenities = originalAmenities.filter(a => similarAmenities.includes(a));
    if (commonAmenities.length > 0) {
      score += Math.min(0.1, commonAmenities.length * 0.02);
    }

    return Math.min(1.0, score);
  }

  private generateSimilarityReasons(original: Property, similar: Property): string[] {
    const reasons: string[] = [];

    if (original.city === similar.city) {
      reasons.push('Same location');
    }

    if (original.type === similar.type) {
      reasons.push(`Similar ${original.type.toLowerCase()} property`);
    }

    const priceDiff = Math.abs(original.price - similar.price) / original.price;
    if (priceDiff < 0.2) {
      reasons.push('Similar price range');
    }

    const originalAmenities = original.amenities || [];
    const similarAmenities = similar.amenities || [];
    const commonAmenities = originalAmenities.filter(a => similarAmenities.includes(a));
    if (commonAmenities.length > 0) {
      reasons.push(`Shared ${commonAmenities.length} amenities`);
    }

    return reasons.length > 0 ? reasons : ['Similar property type'];
  }
} 