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
var ApplinkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplinkService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let ApplinkService = ApplinkService_1 = class ApplinkService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(ApplinkService_1.name);
        // Load configuration from environment variables
        this.baseUrl = this.configService.get('APPLINK_API_URL') || 'https://dev.applink.com.bd';
        this.applicationId = this.configService.get('APPLINK_APPLICATION_ID') || '';
        this.password = this.configService.get('APPLINK_PASSWORD') || '';
        this.sourceAddress = this.configService.get('APPLINK_SOURCE_ADDRESS') || 'NESTEASE';
    }
    /**
     * Send SMS using Applink API
     * @param phoneNumber - Recipient phone number (with country code, e.g., 8801712345678)
     * @param message - SMS message content
     * @param sourceAddress - Optional sender address (defaults to configured source)
     * @returns Promise<SMSResponse>
     */
    async sendSMS(phoneNumber, message, sourceAddress) {
        try {
            // Validate phone number format
            const formattedPhone = this.formatPhoneNumber(phoneNumber);
            if (!formattedPhone) {
                throw new Error('Invalid phone number format');
            }
            // Prepare SMS request
            const smsRequest = {
                applicationId: this.applicationId,
                password: this.password,
                message: message,
                destinationAddresses: [formattedPhone],
                sourceAddress: sourceAddress || this.sourceAddress,
                deliveryStatusRequest: '0', // Set to '1' if you want delivery status
                version: '1.0',
                encoding: '0', // 0 for text, 1 for binary
            };
            this.logger.log(`Sending SMS to ${formattedPhone}`);
            // Make API call to Applink
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/sms/send`, smsRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            this.logger.log(`SMS sent successfully. Response: ${JSON.stringify(response.data)}`);
            return response.data;
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
            const errorStack = (error === null || error === void 0 ? void 0 : error.stack) || '';
            this.logger.error(`Failed to send SMS: ${errorMessage}`, errorStack);
            throw new Error(`SMS sending failed: ${errorMessage}`);
        }
    }
    /**
     * Send SMS to multiple recipients
     * @param phoneNumbers - Array of recipient phone numbers
     * @param message - SMS message content
     * @returns Promise<SMSResponse>
     */
    async sendBulkSMS(phoneNumbers, message) {
        try {
            // Format all phone numbers
            const formattedPhones = phoneNumbers
                .map((phone) => this.formatPhoneNumber(phone))
                .filter((phone) => phone !== null);
            if (formattedPhones.length === 0) {
                throw new Error('No valid phone numbers provided');
            }
            const smsRequest = {
                applicationId: this.applicationId,
                password: this.password,
                message: message,
                destinationAddresses: formattedPhones,
                sourceAddress: this.sourceAddress,
                deliveryStatusRequest: '0',
                version: '1.0',
                encoding: '0',
            };
            this.logger.log(`Sending bulk SMS to ${formattedPhones.length} recipients`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/sms/send`, smsRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            }));
            this.logger.log(`Bulk SMS sent. Response: ${JSON.stringify(response.data)}`);
            return response.data;
        }
        catch (error) {
            const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
            const errorStack = (error === null || error === void 0 ? void 0 : error.stack) || '';
            this.logger.error(`Failed to send bulk SMS: ${errorMessage}`, errorStack);
            throw new Error(`Bulk SMS sending failed: ${errorMessage}`);
        }
    }
    /**
     * Send OTP SMS
     * @param phoneNumber - Recipient phone number
     * @param otp - OTP code
     * @returns Promise<SMSResponse>
     */
    async sendOTP(phoneNumber, otp) {
        const message = `Your NestEase verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;
        return this.sendSMS(phoneNumber, message);
    }
    /**
     * Format phone number to Applink format (880XXXXXXXXX)
     * @param phoneNumber - Phone number in any format
     * @returns Formatted phone number or null if invalid
     */
    formatPhoneNumber(phoneNumber) {
        if (!phoneNumber)
            return null;
        // Remove all non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');
        // If starts with 880 (Bangladesh country code), return as is
        if (cleaned.startsWith('880') && cleaned.length === 13) {
            return cleaned;
        }
        // If starts with 0, replace with 880
        if (cleaned.startsWith('0') && cleaned.length === 11) {
            return '880' + cleaned.substring(1);
        }
        // If 10 digits, assume it's a local number and add 880
        if (cleaned.length === 10) {
            return '880' + cleaned;
        }
        // If 11 digits and doesn't start with 0, add 880
        if (cleaned.length === 11 && !cleaned.startsWith('0')) {
            return '880' + cleaned;
        }
        this.logger.warn(`Invalid phone number format: ${phoneNumber}`);
        return null;
    }
    /**
     * Check if SMS service is configured
     * @returns boolean
     */
    isConfigured() {
        return !!(this.applicationId && this.password);
    }
};
exports.ApplinkService = ApplinkService;
exports.ApplinkService = ApplinkService = ApplinkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ApplinkService);
//# sourceMappingURL=applink.service.js.map