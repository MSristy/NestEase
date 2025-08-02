"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationsController = void 0;
const common_1 = require("@nestjs/common");
const recommendations_service_1 = require("./recommendations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RecommendationsController = class RecommendationsController {
    constructor(recommendationsService) {
        this.recommendationsService = recommendationsService;
    }
    /**
     * Get personalized property recommendations for the authenticated user
     */
    async getPropertyRecommendations(req, limit) {
        try {
            const user = req.user;
            if (!user)
                throw new Error('Unauthorized');
            const limitNumber = limit ? parseInt(limit, 10) : 10;
            const recommendations = await this.recommendationsService.getPropertyRecommendations(user.id, limitNumber);
            console.log(`Generated ${recommendations.length} recommendations for user ${user.id}`);
            return recommendations;
        }
        catch (error) {
            console.error('Error in getPropertyRecommendations:', error);
            return [];
        }
    }
    /**
     * Get trending properties (most popular recently)
     */
    async getTrendingProperties(limit) {
        try {
            const limitNumber = limit ? parseInt(limit, 10) : 10;
            const trending = await this.recommendationsService.getTrendingProperties(limitNumber);
            console.log(`Found ${trending.length} trending properties`);
            return trending;
        }
        catch (error) {
            console.error('Error in getTrendingProperties:', error);
            return [];
        }
    }
    /**
     * Get similar properties to a specific property
     */
    async getSimilarProperties(propertyId, limit) {
        try {
            const limitNumber = limit ? parseInt(limit, 10) : 5;
            const similar = await this.recommendationsService.getSimilarProperties(propertyId, limitNumber);
            console.log(`Found ${similar.length} similar properties for ${propertyId}`);
            return similar;
        }
        catch (error) {
            console.error('Error in getSimilarProperties:', error);
            return [];
        }
    }
    /**
     * Get recommendations for new users (based on popular properties)
     */
    async getNewUserRecommendations(limit) {
        try {
            const limitNumber = limit ? parseInt(limit, 10) : 10;
            // For new users, return trending properties
            const recommendations = await this.recommendationsService.getTrendingProperties(limitNumber);
            console.log(`Generated ${recommendations.length} recommendations for new user`);
            return recommendations;
        }
        catch (error) {
            console.error('Error in getNewUserRecommendations:', error);
            return [];
        }
    }
    /**
     * Test endpoint to verify recommendations system is working
     */
    async testRecommendations() {
        try {
            // Test trending properties
            const trending = await this.recommendationsService.getTrendingProperties(3);
            return {
                status: 'success',
                message: 'Recommendations system is working',
                trendingCount: trending.length,
                sample: trending.slice(0, 1).map(p => ({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    type: p.type,
                })),
            };
        }
        catch (error) {
            console.error('Test endpoint error:', error);
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
                trendingCount: 0,
                sample: [],
            };
        }
    }
};
exports.RecommendationsController = RecommendationsController;
__decorate([
    (0, common_1.Get)('properties'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "getPropertyRecommendations", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "getTrendingProperties", null);
__decorate([
    (0, common_1.Get)('similar/:propertyId'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "getSimilarProperties", null);
__decorate([
    (0, common_1.Get)('new-user'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "getNewUserRecommendations", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecommendationsController.prototype, "testRecommendations", null);
exports.RecommendationsController = RecommendationsController = __decorate([
    (0, common_1.Controller)('recommendations'),
    __metadata("design:paramtypes", [recommendations_service_1.RecommendationsService])
], RecommendationsController);
//# sourceMappingURL=recommendations.controller.js.map