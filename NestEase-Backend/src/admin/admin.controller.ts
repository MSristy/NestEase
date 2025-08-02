import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: number) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/status')
  updateUserStatus(
    @Param('id') id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.updateUserStatus(id, isActive);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  // Property Management
  @Get('properties')
  getAllProperties() {
    return this.adminService.getAllProperties();
  }

  @Get('property/:id')
  getPropertyById(@Param('id') id: string) {
    return this.adminService.getPropertyById(id);
  }

  @Post('property/:id/verify')
  verifyProperty(@Param('id') id: string) {
    return this.adminService.verifyProperty(id);
  }

  @Delete('property/:id')
  deleteProperty(@Param('id') id: string) {
    return this.adminService.deleteProperty(id);
  }

  // Service Provider Management
  @Get('service-providers')
  getAllServiceProviders() {
    return this.adminService.getAllServiceProviders();
  }

  @Get('service-providers/:id')
  getServiceProviderById(@Param('id') id: number) {
    return this.adminService.getServiceProviderById(id);
  }

  @Put('service-providers/:id/verify')
  verifyServiceProvider(@Param('id') id: number) {
    return this.adminService.verifyServiceProvider(id);
  }

  @Delete('service-providers/:id')
  deleteServiceProvider(@Param('id') id: number) {
    return this.adminService.deleteServiceProvider(id);
  }

  // Save & Swap Management
  @Get('save-and-swaps')
  getAllSaveAndSwaps() {
    return this.adminService.getAllSaveAndSwaps();
  }

  @Get('save-and-swaps/:id')
  getSaveAndSwapById(@Param('id') id: number) {
    return this.adminService.getSaveAndSwapById(id);
  }

  @Put('save-and-swaps/:id/complete')
  completeSaveAndSwap(@Param('id') id: number) {
    return this.adminService.completeSaveAndSwap(id);
  }

  @Delete('save-and-swaps/:id')
  deleteSaveAndSwap(@Param('id') id: number) {
    return this.adminService.deleteSaveAndSwap(id);
  }

  // Add Swap Items Management
  @Get('add-swap-items')
  getAllAddSwapItems() {
    return this.adminService.getAllAddSwapItems();
  }

  @Get('add-swap-items/:id')
  getAddSwapItemById(@Param('id') id: number) {
    return this.adminService.getAddSwapItemById(id);
  }

  @Delete('add-swap-items/:id')
  deleteAddSwapItem(@Param('id') id: number) {
    return this.adminService.deleteAddSwapItem(id);
  }

  // Sell Products Management
  @Get('sell-products')
  getAllSellProducts() {
    return this.adminService.getAllSellProducts();
  }

  @Get('sell-products/:id')
  getSellProductById(@Param('id') id: number) {
    return this.adminService.getSellProductById(id);
  }

  @Delete('sell-products/:id')
  deleteSellProduct(@Param('id') id: number) {
    return this.adminService.deleteSellProduct(id);
  }

  // Item Offers Management
  @Get('item-offers')
  getAllItemOffers() {
    return this.adminService.getAllItemOffers();
  }

  @Get('item-offers/:id')
  getItemOfferById(@Param('id') id: number) {
    return this.adminService.getItemOfferById(id);
  }

  @Delete('item-offers/:id')
  deleteItemOffer(@Param('id') id: number) {
    return this.adminService.deleteItemOffer(id);
  }

  // Test endpoint to check barter items data
  @Get('barter-stats')
  getBarterStats() {
    return this.adminService.getBarterStats();
  }

  // Test endpoint to check user role
  @Get('test-role')
  testRole(@Request() req: any) {
    return {
      user: req.user,
      role: req.user?.role,
      message: 'Role test endpoint'
    };
  }

  // Promote user to admin (only accessible by existing admins)
  @Post('promote-user')
  async promoteUserToAdmin(
    @Request() req: any,
    @Body() body: { userId: number }
  ) {
    return this.adminService.promoteUserToAdmin(body.userId);
  }

  // Get all admin users
  @Get('admins')
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }
} 