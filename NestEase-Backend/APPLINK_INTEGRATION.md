# Applink SMS API Integration Guide

This document describes the integration of Applink SMS APIs into the NestEase platform for the Applink Hackathon.

## Overview

Applink SMS API has been integrated into NestEase to enable SMS notifications for various user activities and system events. The integration follows a modular architecture and respects user preferences for SMS notifications.

## API Documentation Reference

- **Applink API Documentation**: https://dev.applink.com.bd/API_Documentation/docs/hSenidMobile_tap_api.html#tag/smssend/operation/smsSendServices
- **Base URL**: `https://dev.applink.com.bd`
- **Primary Endpoint**: `POST /sms/send`

## Architecture

### Module Structure

```
src/applink/
├── applink.module.ts      # NestJS module for Applink integration
└── applink.service.ts     # Core SMS service with Applink API integration
```

### Service Features

The `ApplinkService` provides:
- **Single SMS sending**: `sendSMS(phoneNumber, message)`
- **Bulk SMS sending**: `sendBulkSMS(phoneNumbers[], message)`
- **OTP SMS**: `sendOTP(phoneNumber, otp)`
- **Phone number formatting**: Automatic formatting to Bangladesh format (880XXXXXXXXX)
- **Error handling**: Comprehensive error handling and logging
- **Configuration check**: `isConfigured()` method to verify setup

## Integration Points

### 1. User Authentication (`src/auth/auth.service.ts`)

**Integration Type**: Welcome SMS on user registration

**When Triggered**:
- When a new user successfully registers
- Only if user has provided phone number and SMS notifications are enabled

**SMS Content**:
```
Welcome to NestEase, {name}! Your account has been created successfully. 
Start exploring properties, services, and swaps now!
```

**Code Location**: `AuthService.signup()` method

---

### 2. Service Booking Notifications (`src/bookings/bookings.service.ts`)

**Integration Type**: Booking status SMS notifications

**When Triggered**:
- **Booking Created**: When a customer creates a service booking
  - Customer receives: Booking confirmation with booking ID
  - Service Provider receives: New booking request notification
  
- **Booking Approved**: When service provider approves a booking
  - Customer receives: Approval confirmation with service details
  
- **Booking Rejected**: When service provider rejects a booking
  - Customer receives: Rejection notification with reason (if provided)

**SMS Examples**:

*Customer - Booking Created*:
```
Your {serviceType} service booking request has been submitted. 
Booking ID: {bookingId}. Waiting for provider approval.
```

*Service Provider - New Booking*:
```
New booking request from {customerName} for {serviceType} on {date} at {time}. 
Booking ID: {bookingId}.
```

*Customer - Booking Approved*:
```
Great news! Your {serviceType} service booking (ID: {bookingId}) has been approved. 
Service scheduled for {date} at {time}.
```

**Code Location**: `BookingsService.sendBookingSMSNotifications()` method

---

### 3. Property Booking Notifications (`src/properties/properties.service.ts`)

**Integration Type**: Property rental booking SMS notifications

**When Triggered**:
- When a tenant submits a property booking request
  - Tenant receives: Booking confirmation
  - Property Owner receives: New booking request notification

**SMS Examples**:

*Tenant - Booking Submitted*:
```
Your property booking request for {propertyTitle} ({address}) has been submitted. 
Booking ID: {bookingId}. Waiting for landlord approval.
```

*Property Owner - New Booking*:
```
New booking request from {tenantName} for your property "{propertyTitle}" at {address}. 
Booking ID: {bookingId}. Please review in your dashboard.
```

**Code Location**: `PropertiesService.sendPropertyBookingSMS()` method

---

### 4. General Notifications (`src/users/notification.service.ts`)

**Integration Type**: SMS notifications for in-app notifications

**When Triggered**:
- When `createNotification()` is called with `sendSMS: true`
- Only if user has SMS notifications enabled and phone number provided

**Usage Example**:
```typescript
await notificationService.createNotification(
  userId,
  NotificationType.BOOKING,
  'Booking Confirmed',
  'Your booking has been confirmed',
  metadata,
  true // sendSMS flag
);
```

**Code Location**: `NotificationService.sendSMSNotification()` method

---

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# Applink SMS API Configuration
APPLINK_API_URL=https://dev.applink.com.bd
APPLINK_APPLICATION_ID=your_application_id
APPLINK_PASSWORD=your_password
APPLINK_SOURCE_ADDRESS=NESTEASE
```

### Required Dependencies

The integration requires `@nestjs/axios` package:

```bash
npm install @nestjs/axios
```

This has been added to `package.json`.

---

## User Preferences

SMS notifications respect user preferences:

1. **Phone Number**: User must have a phone number in their profile
2. **SMS Notifications Enabled**: User's `smsNotifications` field must be `true`
3. **Service Configuration**: Applink service must be properly configured

The system gracefully handles:
- Missing phone numbers (skips SMS)
- SMS notifications disabled (skips SMS)
- Service not configured (logs warning, continues)
- API failures (logs error, doesn't break main flow)

---

## Phone Number Format

The service automatically formats phone numbers to Bangladesh format:

- **Input formats supported**:
  - `01712345678` → `8801712345678`
  - `8801712345678` → `8801712345678` (already formatted)
  - `1712345678` → `8801712345678`

- **Output format**: `880XXXXXXXXX` (13 digits with country code)

---

## Error Handling

The integration implements comprehensive error handling:

1. **Validation**: Phone number format validation
2. **Configuration Check**: Verifies Applink credentials before sending
3. **Graceful Degradation**: SMS failures don't break main application flow
4. **Logging**: All SMS operations are logged for debugging

**Error Logging**:
- Success: `SMS notification sent to user {userId} at {phone}`
- Failure: `Failed to send SMS notification to user {userId}: {error}`

---

## Testing

### Manual Testing

1. **Test SMS Sending**:
   ```typescript
   // In any service that has ApplinkService injected
   await this.applinkService.sendSMS('8801712345678', 'Test message');
   ```

2. **Test OTP**:
   ```typescript
   await this.applinkService.sendOTP('8801712345678', '123456');
   ```

3. **Test Configuration**:
   ```typescript
   if (this.applinkService.isConfigured()) {
     // Service is ready
   }
   ```

### Integration Testing

Test the following scenarios:

1. **User Registration**:
   - Register new user with phone number
   - Verify welcome SMS is sent

2. **Service Booking**:
   - Create a service booking
   - Verify SMS to customer and provider
   - Approve/reject booking
   - Verify status update SMS

3. **Property Booking**:
   - Submit property booking
   - Verify SMS to tenant and owner

---

## API Usage Statistics

For hackathon demonstration, track:

1. **Total SMS Sent**: Count of all SMS notifications sent
2. **SMS by Type**: Breakdown by notification type
3. **Success Rate**: Percentage of successful SMS deliveries
4. **User Engagement**: Users who have SMS notifications enabled

---

## Security Considerations

1. **Credentials**: Applink credentials stored in environment variables (never in code)
2. **Phone Numbers**: Validated and formatted before sending
3. **Rate Limiting**: Consider implementing rate limiting for bulk SMS
4. **User Consent**: SMS only sent to users who have opted in

---

## Future Enhancements

Potential improvements for production:

1. **SMS Templates**: Template-based SMS messages
2. **Delivery Status**: Track SMS delivery status
3. **SMS Queue**: Queue system for bulk SMS
4. **Analytics**: Detailed SMS analytics dashboard
5. **Two-Way SMS**: Handle incoming SMS messages
6. **SMS Campaigns**: Marketing SMS campaigns

---

## Support

For issues or questions:
- Check Applink API documentation
- Review application logs for error messages
- Verify environment variables are set correctly
- Ensure phone numbers are in correct format

---

## Hackathon Requirements Compliance

✅ **Mandatory API Integration**: Applink SMS API integrated
✅ **Effective Use**: SMS notifications for critical user actions
✅ **Technical Depth**: Modular architecture with error handling
✅ **Relevance**: SMS notifications enhance user experience

---

**Last Updated**: Integration completed for Applink Hackathon
**Version**: 1.0.0

