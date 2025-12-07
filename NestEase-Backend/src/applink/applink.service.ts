import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

export interface SMSRequest {
  applicationId: string;
  password: string;
  message: string;
  destinationAddresses: string[];
  sourceAddress?: string;
  deliveryStatusRequest?: string;
  binaryHeader?: string;
  version?: string;
  encoding?: string;
}

export interface SMSResponse {
  statusCode: string;
  statusDetail: string;
  requestId?: string;
  destinationResponses?: Array<{
    address: string;
    statusCode: string;
    statusDetail: string;
  }>;
}

@Injectable()
export class ApplinkService {
  private readonly logger = new Logger(ApplinkService.name);
  private readonly baseUrl: string;
  private readonly applicationId: string;
  private readonly password: string;
  private readonly sourceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Load configuration from environment variables
    this.baseUrl = this.configService.get<string>('APPLINK_API_URL') || 'https://dev.applink.com.bd';
    this.applicationId = this.configService.get<string>('APPLINK_APPLICATION_ID') || '';
    this.password = this.configService.get<string>('APPLINK_PASSWORD') || '';
    this.sourceAddress = this.configService.get<string>('APPLINK_SOURCE_ADDRESS') || 'NESTEASE';
  }

  /**
   * Send SMS using Applink API
   * @param phoneNumber - Recipient phone number (with country code, e.g., 8801712345678)
   * @param message - SMS message content
   * @param sourceAddress - Optional sender address (defaults to configured source)
   * @returns Promise<SMSResponse>
   */
  async sendSMS(
    phoneNumber: string,
    message: string,
    sourceAddress?: string,
  ): Promise<SMSResponse> {
    try {
      // Validate phone number format
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      if (!formattedPhone) {
        throw new Error('Invalid phone number format');
      }

      // Prepare SMS request
      const smsRequest: SMSRequest = {
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
      const response: AxiosResponse<SMSResponse> = await firstValueFrom(
        this.httpService.post<SMSResponse>(
          `${this.baseUrl}/sms/send`,
          smsRequest,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(`SMS sent successfully. Response: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      const errorStack = error?.stack || '';
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
  async sendBulkSMS(
    phoneNumbers: string[],
    message: string,
  ): Promise<SMSResponse> {
    try {
      // Format all phone numbers
      const formattedPhones = phoneNumbers
        .map((phone) => this.formatPhoneNumber(phone))
        .filter((phone) => phone !== null) as string[];

      if (formattedPhones.length === 0) {
        throw new Error('No valid phone numbers provided');
      }

      const smsRequest: SMSRequest = {
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

      const response: AxiosResponse<SMSResponse> = await firstValueFrom(
        this.httpService.post<SMSResponse>(
          `${this.baseUrl}/sms/send`,
          smsRequest,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(`Bulk SMS sent. Response: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      const errorStack = error?.stack || '';
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
  async sendOTP(phoneNumber: string, otp: string): Promise<SMSResponse> {
    const message = `Your NestEase verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Format phone number to Applink format (880XXXXXXXXX)
   * @param phoneNumber - Phone number in any format
   * @returns Formatted phone number or null if invalid
   */
  private formatPhoneNumber(phoneNumber: string): string | null {
    if (!phoneNumber) return null;

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
  isConfigured(): boolean {
    return !!(this.applicationId && this.password);
  }
}

