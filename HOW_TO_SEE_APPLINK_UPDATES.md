# How to See Applink API Updates in Your System

## 📱 Understanding Applink SMS vs In-App Notifications

### **Applink SMS API** (What You Just Integrated)
- **What it does**: Sends SMS text messages to users' **PHONES** (not in the app)
- **Where you see it**: On your **actual phone** as a text message
- **Not visible in**: The web app UI (it's a phone SMS, not an in-app notification)

### **In-App Notifications** (Socket.IO)
- **What it does**: Shows notifications **inside the web app**
- **Where you see it**: 
  - Bell icon in navbar (notification dropdown)
  - `/notifications` page
  - Toast notifications (pop-up messages)

---

## 🎯 How to See Applink SMS Updates

### Step 1: Configure Applink Credentials

1. Get credentials from: https://dev.applink.com.bd
2. Add to `.env` file in `NestEase-Backend`:
   ```env
   APPLINK_API_URL=https://dev.applink.com.bd
   APPLINK_APPLICATION_ID=your_application_id
   APPLINK_PASSWORD=your_password
   APPLINK_SOURCE_ADDRESS=NESTEASE
   ```

### Step 2: Test SMS Notifications

#### **Test 1: User Registration (Welcome SMS)**
1. Register a new user with a **phone number** (format: `01712345678` or `8801712345678`)
2. Enable SMS notifications in user profile (or it's enabled by default)
3. **Check your phone** - you should receive a welcome SMS

#### **Test 2: Service Booking SMS**
1. Log in as a user with phone number
2. Create a service booking (e.g., book a cleaning service)
3. **Check your phone** - you should receive SMS:
   - Customer: "Your AC Repair service booking request has been submitted..."
   - Service Provider: "New booking request from [Customer Name]..."

#### **Test 3: Property Booking SMS**
1. Submit a property booking request
2. **Check your phone** - you should receive SMS notifications

### Step 3: Verify SMS is Working

**Check Backend Logs**:
```
[Nest] LOG [ApplinkService] Sending SMS to 8801712345678
[Nest] LOG [ApplinkService] SMS sent successfully. Response: {...}
```

**Check Your Phone**:
- You should receive actual SMS text messages
- Messages will be from "NESTEASE" (or your configured source address)

---

## 🔔 Fixing In-App Notifications (Socket.IO)

### The Problem: "Dummy Data" in Notifications

The issue is likely:
1. **API endpoint mismatch** - Frontend calls wrong endpoint
2. **Notification structure mismatch** - Backend sends different format than frontend expects
3. **No real notifications being created** - Only test/dummy data exists

### Solution: Fix Notification Endpoints

Let me check and fix the endpoints...

