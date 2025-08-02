-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2025 at 01:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nestease`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zipCode` varchar(255) NOT NULL,
  `isDefault` tinyint(4) NOT NULL DEFAULT 0,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `add_swap`
--

CREATE TABLE `add_swap` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `owner_phone` varchar(20) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `item_condition` varchar(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` text NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `add_swap`
--

INSERT INTO `add_swap` (`id`, `owner_name`, `owner_phone`, `owner_email`, `product_name`, `category`, `item_condition`, `location`, `description`, `images`, `createdAt`) VALUES
(1, 'Rent Home', '01764968722', 'renthome@gmail.com', 'Mobile', 'electronics', 'New', 'Dhaka', 'Good Quality', '/uploads/swaps/1632d7fa-6d4b-4f24-9c1a-5b52998dd422.jpg', '2025-06-24 04:17:06.022531'),
(2, 'Parvez Hosen', '01521782400', 'parvezhosen@gmail.com', 'Sofa', 'furniture', 'New', 'Dhaka', 'Good', '/uploads/swaps/f9ac5951-1909-4483-89ae-b456eb2c5ad2.jpg', '2025-06-24 17:36:19.677140'),
(3, 'Parvez Hosen', '01764968722', 'parvezhosen@gmail.com', 'Chair', 'tools', 'New', 'Chittagong', 'Good', '/uploads/swaps/ef2b8880-97f3-423a-b7c8-d1767f7b2164.jpg', '2025-06-24 17:37:11.492233'),
(4, 'Abdul Bari', '01521782400', 'renthome@gmail.com', 'Car', 'vehicles', 'New', 'Chittagong', 'Good', '/uploads/swaps/bb327bb8-e1bc-4d0c-b746-ee5ada5e9cc2.jpg', '2025-06-24 17:56:58.936088');

-- --------------------------------------------------------

--
-- Table structure for table `add_yours`
--

CREATE TABLE `add_yours` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `transaction_type` varchar(20) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `item_condition` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `swap_value` decimal(10,2) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `serviceProviderId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `serviceType` varchar(255) NOT NULL,
  `serviceDate` varchar(255) NOT NULL,
  `serviceTime` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending_approval','approved','rejected','completed','cancelled') NOT NULL DEFAULT 'pending_approval',
  `totalAmount` decimal(10,2) NOT NULL,
  `rejectionReason` text DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `paymentStatus` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  `paymentMethod` enum('cash','online','pending') NOT NULL DEFAULT 'pending',
  `billId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `serviceProviderId`, `customerId`, `serviceType`, `serviceDate`, `serviceTime`, `duration`, `address`, `notes`, `status`, `totalAmount`, `rejectionReason`, `createdAt`, `updatedAt`, `paymentStatus`, `paymentMethod`, `billId`) VALUES
(1, 1, 4, 'AC Repair', '2025-06-24', '16:27', 1, 'Dhaka', 'Good', 'approved', 80.00, NULL, '2025-06-24 04:27:40.271067', '2025-06-27 00:19:07.000000', 'pending', 'pending', NULL),
(2, 2, 1, 'Cleaning Services', '2025-06-27', '12:17', 1, 'Dhaka', 'Clean good', 'pending_approval', 50.00, NULL, '2025-06-27 00:17:49.542069', '2025-06-27 00:17:49.542069', 'pending', 'pending', NULL),
(3, 12, 1, 'Electrical', '2025-06-27', '16:26', 1, 'Dhaka', 'Good', 'pending_approval', 70.00, NULL, '2025-06-27 01:27:16.302390', '2025-06-27 01:27:16.302390', 'pending', 'pending', NULL),
(4, 2, 7, 'Cleaning Services', '2025-07-01', '14:36', 1, 'Dhaka', 'Good', 'pending_approval', 600.00, NULL, '2025-07-01 02:38:49.328726', '2025-07-01 02:38:49.328726', 'pending', 'pending', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `connected_account`
--

CREATE TABLE `connected_account` (
  `id` int(11) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `connectedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL,
  `providerData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`providerData`))
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_form_messages`
--

CREATE TABLE `contact_form_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('pending','read','replied','closed') NOT NULL DEFAULT 'pending',
  `adminReply` text DEFAULT NULL,
  `repliedBy` varchar(255) DEFAULT NULL,
  `repliedAt` timestamp NULL DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exchange_product`
--

CREATE TABLE `exchange_product` (
  `id` int(11) NOT NULL,
  `your_name` varchar(255) NOT NULL,
  `your_phone` varchar(20) DEFAULT NULL,
  `your_email` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `item_condition` varchar(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `status` varchar(20) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exchange_product`
--

INSERT INTO `exchange_product` (`id`, `your_name`, `your_phone`, `your_email`, `product_name`, `category`, `item_condition`, `location`, `description`, `images`, `created_at`, `status`) VALUES
(1, 'Rent Home', '01764968722', 'renthome@gmail.com', 'Phone', 'electronics', 'Like New', 'Dhaka', 'Good', '/uploads/products/8e3cd114-5345-4a94-971c-e95a0b4c995a.jpg', '2025-06-24 04:17:54.908000', 'pending'),
(2, 'Tareq Monour', '01764968722', 'renthome@gmail.com', 'Phone', 'electronics', 'New', 'Dhaka', 'Good', '/uploads/products/797d5703-ea7d-4363-a716-490e1b294f7a.jpg', '2025-06-24 04:19:00.750000', 'pending'),
(3, 'Tareq Monour', '01403851619', 'renthome@gmail.com', 'Mobile', 'electronics', 'New', 'Dhaka', 'Good', '/uploads/products/701abc57-fe0c-432c-97a4-d7f5a14cab59.jpg', '2025-06-27 04:00:30.818000', 'pending'),
(4, 'Tareq Monour', '01403851619', 'renthome@gmaail.com', 'Phone', 'electronics', 'Good', 'Dhaka', 'Good', '/uploads/products/d8986cfa-08fd-4014-900c-8b5ff45b441d.jpg', '2025-06-27 04:26:21.320000', 'pending'),
(5, 'Tareq Monour', '01403851620', 'parvezhosen@gmail.com', 'Sofa', 'furniture', 'Like New', 'Dhaka', 'Good', '/uploads/products/4dab3f98-855c-4a58-8b97-81a4f09bc479.jpg', '2025-06-27 05:10:05.059000', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `item_offer`
--

CREATE TABLE `item_offer` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `owner_phone` varchar(255) DEFAULT NULL,
  `owner_email` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `product_condition` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_offer`
--

INSERT INTO `item_offer` (`id`, `owner_name`, `owner_phone`, `owner_email`, `product_name`, `price`, `discount`, `category`, `product_condition`, `location`, `description`, `images`, `created_at`) VALUES
(2, 'Parvez Hosen', '01764968722', 'parvezhosen@gmail.com', 'Furniture', 10000.00, 5.00, 'cleaning', 'New', 'Rangpur', 'Good', 'http://localhost:3001/uploads/products/ef2b8880-97f3-423a-b7c8-d1767f7b2164.jpg', '2025-06-24 17:39:26.174360'),
(3, 'Tareq Monour', '01764968722', 'mmonour221519@bscse.uiu.ac.bd', 'Car', 200000.00, 10.00, 'transport', 'New', 'Chittagong', 'Good', 'http://localhost:3001/uploads/products/5b974942-d2e1-49bb-9d40-590bf81faeff.jpg', '2025-06-24 17:40:46.165225'),
(4, 'Parvez Hosen', '01764968722', 'parvezhosen@gmail.com', 'phone', 20000.00, 5.00, 'services', 'New', 'Dhaka', 'Good', 'http://localhost:3001/uploads/products/35738da6-98f7-41a4-a31d-1a2b7f44a7d9.jpg', '2025-06-24 22:30:19.175649');

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `coverLetter` text NOT NULL,
  `resumeUrl` varchar(255) DEFAULT NULL,
  `portfolioUrl` varchar(255) DEFAULT NULL,
  `linkedinUrl` varchar(255) DEFAULT NULL,
  `githubUrl` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `skills` varchar(255) DEFAULT NULL,
  `expectedSalary` varchar(255) DEFAULT NULL,
  `noticePeriod` varchar(255) DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `status` enum('pending','reviewing','interview','hired','rejected') NOT NULL DEFAULT 'pending',
  `adminNotes` varchar(255) DEFAULT NULL,
  `rejectionReason` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1683234567890, 'CreateAddressAndConnectedAccount1683234567890'),
(2, 1710000000000, 'UpdateAmenitiesColumn1710000000000'),
(3, 1710000000000, 'AddUserRole1710000000000'),
(4, 1710000000000, 'AddPropertyType1710000000000'),
(5, 1710000000001, 'AddPaymentFieldsToBooking1710000000001'),
(6, 1711036800000, 'CreateAddYoursTable1711036800000'),
(7, 1717000000000, 'CreateAddSwapTable1717000000000'),
(8, 1748547046391, 'RemoveImageUrlFromAddSwap1748547046391'),
(9, 1748547046392, 'FixAmenitiesAndAddBachelorFriendly1748547046392');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` enum('interview','property','service','swap','system') NOT NULL DEFAULT 'system',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `id` varchar(36) NOT NULL,
  `yourName` varchar(255) DEFAULT NULL,
  `yourPhone` varchar(255) DEFAULT NULL,
  `yourEmail` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zipCode` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `bedrooms` int(11) NOT NULL,
  `bathrooms` int(11) NOT NULL,
  `squareFeet` int(11) NOT NULL,
  `type` enum('RENT','SALE') NOT NULL DEFAULT 'RENT',
  `status` enum('AVAILABLE','PENDING','BOOKED','SOLD') NOT NULL DEFAULT 'AVAILABLE',
  `images` text DEFAULT NULL,
  `isAvailable` tinyint(4) NOT NULL DEFAULT 1,
  `isVerified` tinyint(4) NOT NULL DEFAULT 0,
  `category` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `bachelorFriendly` tinyint(4) NOT NULL DEFAULT 0,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`id`, `yourName`, `yourPhone`, `yourEmail`, `title`, `description`, `address`, `city`, `state`, `zipCode`, `price`, `bedrooms`, `bathrooms`, `squareFeet`, `type`, `status`, `images`, `isAvailable`, `isVerified`, `category`, `ownerId`, `createdAt`, `updatedAt`, `bachelorFriendly`, `amenities`) VALUES
('06039826-6bbd-4c9a-a648-36094f6081ba', 'Landlord Home', '01764968800', 'landlord@gmail.com', '', 'Good', 'Rangpur', 'Rangpur', 'Rangpur', '5000', 30000.00, 3, 3, 2000, 'RENT', 'PENDING', '/uploads/properties/81be0e14-dc53-48c3-b82a-ea6d4b7cb17a.jpg', 1, 0, 'house', 7, '2025-06-24 18:40:09.291592', '2025-06-24 18:54:22.000000', 0, NULL),
('117ac6d5-6765-47b6-9426-e88f8393c928', 'Landlord Home', '01764968800', 'landlord@gmail.com', '', 'Good ', 'Chittagong', 'Chittagong', 'Chittagong', '5555', 20000.00, 3, 3, 1500, 'RENT', 'PENDING', '/uploads/properties/3bd3be42-74a3-4a6d-b0ab-7e625547d82f.jpg', 1, 0, 'house', 7, '2025-06-24 16:26:46.716256', '2025-07-01 02:54:32.000000', 0, NULL),
('30259eb6-a69c-4fb0-9b87-a3786dbcd599', 'Sell Home', '01764968811', 'sellhome@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '2500', 200000.00, 2, 2, 1200, 'SALE', 'PENDING', '/uploads/properties/0426830f-bd56-439b-b856-8e39bb8067d1.jpg', 1, 0, 'villa', 6, '2025-06-24 20:39:11.568402', '2025-06-30 09:37:46.743911', 0, NULL),
('459fdc58-ba14-411b-bf7b-85bba2472bbb', 'Landlord Home', '01764968722', 'landlord@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5000', 25000.00, 3, 3, 1800, 'RENT', 'AVAILABLE', '/uploads/properties/7553454b-483c-4230-94d7-73c32c55f48a.jpg', 1, 0, 'house', 7, '2025-06-24 16:32:54.157748', '2025-06-30 09:38:21.635900', 0, NULL),
('48b15282-07e1-4417-995c-86c75ca4253f', 'Landlord Home', '01861666884', 'landlord@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5555', 15500.00, 3, 2, 1200, 'SALE', 'AVAILABLE', '/uploads/properties/d08babaa-bf61-48c3-a44a-6b06c58a4677.jpg,/uploads/properties/0084f6c4-6fb4-42df-ac4e-6c157feac22d.jpg,/uploads/properties/ae03e3d0-addf-4670-bf71-61966315fb3e.jpg', 1, 0, 'villa', 7, '2025-07-01 02:35:55.429131', '2025-07-01 02:35:55.429131', 1, NULL),
('5aeb50b0-ec9d-4c9c-92b5-aab32510b0f4', 'Landlord Home', '01764968811', 'landlord@gmail.com', '', 'Good', 'Rangpur', 'Rangpur', 'Rangpur', '2500', 10000.00, 2, 2, 1000, 'RENT', 'AVAILABLE', '/uploads/properties/c997464e-0faf-450e-8efe-1754a16a2f96.jpg', 1, 0, 'studio', 7, '2025-06-24 16:29:40.141473', '2025-06-30 09:38:27.218768', 0, NULL),
('901bbda1-6b21-4b60-b083-6728aa50ae0c', 'Sell Home', '01764968800', 'sellhome@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5555', 540000.00, 3, 3, 1600, 'SALE', 'AVAILABLE', '/uploads/properties/4ea46733-a557-43ca-8832-d1f55a88d0b8.jpg', 1, 0, 'house', 6, '2025-06-24 20:30:26.894901', '2025-06-30 09:39:17.542157', 0, NULL),
('ab84e61f-a563-4eb6-9a6d-d1b0eea91358', 'Sell Home', '01764968722', 'sellhome@gmail.com', '', 'Good', 'Chittagong', 'Chittagong', 'Chittagong', '5000', 300000.00, 3, 2, 1500, 'SALE', 'SOLD', '/uploads/properties/4a7e58d6-e1a4-4bd5-b20b-dc784be78c08.jpg', 1, 0, 'house', 6, '2025-06-24 20:29:07.278421', '2025-06-24 20:31:20.000000', 0, NULL),
('e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 'Tareq Monour', '01764968722', 'tareqmonour00@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5000', 20000.00, 3, 2, 1200, 'RENT', 'AVAILABLE', '/uploads/properties/34a2cf4d-78a9-47e2-ba58-9c4352fd2f83.jpg', 1, 1, 'house', 7, '2025-06-24 04:11:49.174439', '2025-06-30 10:26:22.000000', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `property_booking`
--

CREATE TABLE `property_booking` (
  `id` varchar(36) NOT NULL,
  `checkInDate` datetime NOT NULL,
  `checkOutDate` datetime NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','REJECTED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` enum('PENDING','PAID','REFUNDED','FAILED') NOT NULL DEFAULT 'PENDING',
  `paymentIntentId` varchar(255) DEFAULT NULL,
  `cancellationReason` varchar(255) DEFAULT NULL,
  `isRefundable` tinyint(4) NOT NULL DEFAULT 0,
  `propertyId` varchar(36) DEFAULT NULL,
  `tenantId` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `rejectionReason` varchar(255) DEFAULT NULL,
  `paymentDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paymentDetails`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_booking`
--

INSERT INTO `property_booking` (`id`, `checkInDate`, `checkOutDate`, `totalPrice`, `status`, `paymentStatus`, `paymentIntentId`, `cancellationReason`, `isRefundable`, `propertyId`, `tenantId`, `createdAt`, `updatedAt`, `rejectionReason`, `paymentDetails`) VALUES
('003f5d1e-8532-4a9d-8638-28ae17a7becb', '2025-07-01 02:54:32', '2025-07-01 02:54:32', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, '117ac6d5-6765-47b6-9426-e88f8393c928', 7, '2025-07-01 02:54:32.360489', '2025-07-01 02:54:32.360489', NULL, NULL),
('1cc05610-f9d3-4248-b517-745938e6d0ef', '2025-06-24 04:30:38', '2025-06-24 04:30:38', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 04:30:38.420242', '2025-06-24 04:30:38.420242', NULL, NULL),
('2c4df023-ce49-4b9e-aa8f-f9b9e9ab389a', '2025-06-24 18:43:02', '2025-06-24 18:43:02', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 18:43:02.191420', '2025-06-24 18:43:02.191420', NULL, NULL),
('6ae59052-1bd1-4610-b23e-347b980f9f0f', '2025-06-24 04:13:48', '2025-06-24 04:13:48', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 04:13:48.700981', '2025-06-24 04:13:48.700981', NULL, NULL),
('87cd3a88-edd3-4b62-9956-259d0b0246df', '2025-06-24 17:44:01', '2025-06-24 17:44:01', 20000.00, 'REJECTED', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 17:44:01.310598', '2025-06-30 03:30:55.000000', NULL, NULL),
('f0692124-673d-4510-8822-39bd93659866', '2025-06-24 18:54:22', '2025-06-24 18:54:22', 30000.00, 'PENDING', 'PENDING', NULL, NULL, 0, '06039826-6bbd-4c9a-a648-36094f6081ba', 2, '2025-06-24 18:54:22.567030', '2025-06-24 18:54:22.567030', NULL, NULL),
('f1811f0c-7f57-4a8f-8f4d-a4bea27e3839', '2025-06-24 17:58:43', '2025-06-24 17:58:43', 20000.00, 'CONFIRMED', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 17:58:43.577539', '2025-06-30 03:30:47.000000', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `property_purchase`
--

CREATE TABLE `property_purchase` (
  `id` varchar(36) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','REJECTED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` enum('PENDING','PAID','REFUNDED','FAILED') NOT NULL DEFAULT 'PENDING',
  `paymentIntentId` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `propertyId` varchar(36) DEFAULT NULL,
  `buyerId` int(11) DEFAULT NULL,
  `rejectionReason` varchar(255) DEFAULT NULL,
  `paymentDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paymentDetails`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_purchase`
--

INSERT INTO `property_purchase` (`id`, `totalPrice`, `status`, `paymentStatus`, `paymentIntentId`, `createdAt`, `updatedAt`, `propertyId`, `buyerId`, `rejectionReason`, `paymentDetails`) VALUES
('fe4cb1d3-d6bb-4ea4-a604-ccdbf4227fa5', 200000.00, 'PENDING', 'PENDING', NULL, '2025-06-24 20:40:37.622014', '2025-06-24 20:40:37.622014', '30259eb6-a69c-4fb0-9b87-a3786dbcd599', 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `save_and_swap`
--

CREATE TABLE `save_and_swap` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `isCompleted` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `userId` int(11) DEFAULT NULL,
  `propertyId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sell_product`
--

CREATE TABLE `sell_product` (
  `id` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `owner_phone` varchar(255) NOT NULL,
  `owner_email` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `product_condition` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `images` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sell_product`
--

INSERT INTO `sell_product` (`id`, `owner_name`, `owner_phone`, `owner_email`, `product_name`, `price`, `category`, `product_condition`, `location`, `description`, `images`, `created_at`) VALUES
(1, 'Tareq Monour', '01764968722', 'tareqmonour00@gmail.com', 'Smartphone', 15000.00, 'smartphone', 'Like New', 'Dhaka', 'Good Phone', 'http://localhost:3001/uploads/products/d4d0a34d-4083-48c9-9f46-9e852f9fc630.jpg', '2025-06-24 16:54:48.668642'),
(2, 'Lotifur Nishat', '01521782400', 'lnishat@gmail.com', 'Car', 1100000.00, 'car', 'New', 'Dhaka', 'Good', 'http://localhost:3001/uploads/products/5b974942-d2e1-49bb-9d40-590bf81faeff.jpg', '2025-06-24 17:32:43.941182'),
(3, 'Parvez Hosen', '01764968780', 'parvezhosen@gmail.com', 'Laptop', 60000.00, 'laptop', 'New', 'Chittagong', 'Good', 'http://localhost:3001/uploads/products/ee8bbc0c-edb7-4789-8811-42af9e3383d8.jpg', '2025-06-24 17:34:35.228249'),
(4, 'Parvez Hosen', '01764968722', 'parvezhosen@gmail.com', 'Phone', 15000.00, 'smartphone', 'New', 'Dhaka', 'Good', 'http://localhost:3001/uploads/products/1632d7fa-6d4b-4f24-9c1a-5b52998dd422.jpg', '2025-06-24 20:17:11.950323');

-- --------------------------------------------------------

--
-- Table structure for table `service_provider`
--

CREATE TABLE `service_provider` (
  `id` int(11) NOT NULL,
  `businessName` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `serviceType` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zipCode` varchar(255) NOT NULL,
  `services` text NOT NULL,
  `images` text NOT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `isVerified` tinyint(4) NOT NULL DEFAULT 0,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `ownerId` int(11) DEFAULT NULL,
  `totalRatings` int(11) NOT NULL DEFAULT 0,
  `totalReviews` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_provider`
--

INSERT INTO `service_provider` (`id`, `businessName`, `description`, `serviceType`, `phone`, `address`, `city`, `state`, `zipCode`, `services`, `images`, `isActive`, `isVerified`, `rating`, `createdAt`, `updatedAt`, `ownerId`, `totalRatings`, `totalReviews`) VALUES
(1, 'Cleaning Store', 'I\'m good at cleaning home.', 'AC Repair', '01521782400', 'Dhaka', 'Dhaka', '', '0000', 'I\'m good at cleaning home.', '/uploads/services/34e1861d-ab22-40a3-8ea6-7f252b100fb4.jpg', 1, 0, 4.00, '2025-06-24 04:22:26.351203', '2025-06-24 22:26:18.508537', 3, 0, 0),
(2, 'Skyline Cleaners', 'Professional home and office cleaning services with eco-friendly products.', 'Cleaning Services', '01234567890', '123 Green Road', 'Dhaka', 'Dhaka Division', '1205', 'Home Cleaning, Office Cleaning, Carpet Cleaning', '/uploads/services/3d3d5886-0d57-4bc2-aa6a-bd33ec5c3c78.jpg', 1, 1, 4.75, '2025-06-24 16:41:41.125471', '2025-06-24 22:27:21.757415', 3, 0, 0),
(12, 'EcoNix', 'I\'m a electrician, I provide good service.', 'Electrical', '0152178240', 'Dhaka', 'Dhaka', '', '0000', 'I\'m a electrician, I provide good service.', '/uploads/services/d455645e435b1295874784f59eb5f67d.jpg', 1, 0, 4.00, '2025-06-24 17:27:45.140620', '2025-06-24 17:27:45.140620', 18, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `emailNotifications` tinyint(4) NOT NULL DEFAULT 1,
  `smsNotifications` tinyint(4) NOT NULL DEFAULT 0,
  `showProfile` tinyint(4) NOT NULL DEFAULT 1,
  `customization` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customization`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `avatar`, `phone`, `address`, `role`, `isActive`, `createdAt`, `emailNotifications`, `smsNotifications`, `showProfile`, `customization`) VALUES
(1, 'tareqmonour00@gmail.com', '$2b$10$5.cm9EaEteY1VkwYl7oy6.Lg787zM0V53VRQ0Vq7ort9ug4bfX7Ai', 'Tareq Monour', 'http://localhost:3001/uploads/avatars/1751241277615-23635386.jpg', '01521782400', 'Madani Avenue, Vatara, Dhaka', 'ADMIN', 1, '2025-06-23 22:10:58', 1, 0, 1, NULL),
(2, 'renthome@gmail.com', '$2b$10$8xf8Rf9GhtNJf4ZDTjbhge4kAEOqqX4jQBBfCmhaFjn8noNH2ntpa', 'Rent Home', NULL, NULL, NULL, 'tenant', 0, '2025-06-23 22:13:25', 1, 0, 1, NULL),
(3, 'serviceprovider@gmail.com', '$2b$10$z6xOOcH.ftEmeq5cAqpeweSbOpGGtL8G75Z61MvAF7sGrh5RWuvS6', 'Service Provider', 'http://localhost:3001/uploads/avatars/1751239953777-112309941.jpg', '01521782400', 'Madani Avenue, Vatara, Dhaka', 'SERVICE_PROVIDER', 1, '2025-06-23 22:21:16', 1, 0, 1, NULL),
(4, 'lnishat@gmail.com', '$2b$10$ePY5vLKW6pEBoffv6lpnIeSRUxHkKGP4yUvkdJBxEUBCcUBEsAZBK', 'Lotifur Nishat', NULL, NULL, NULL, 'USER', 1, '2025-06-23 22:27:09', 1, 0, 1, NULL),
(5, 'buyhome@gmail.com', '$2b$10$BumMppVBQPKhWeFMhju8ce1Gnd8aJU5e8fERHFRvLn9dfLiTRJgtS', 'Buy Home', NULL, NULL, NULL, 'BUYER', 1, '2025-06-24 10:21:02', 1, 0, 1, NULL),
(6, 'sellhome@gmail.com', '$2b$10$.vjWZMW6l6A/ZMrSwpUxae50LnCvi7C6aB/QS6e8MSFVH7Ah96m16', 'Sell Home', NULL, NULL, NULL, 'SELLER', 1, '2025-06-24 10:21:34', 1, 0, 1, NULL),
(7, 'landlord@gmail.com', '$2b$10$G9efzY/lO9Adqnpm0Pjse.BR7v.DNOz/bG.deT4Q8s.XGg6RNCufa', 'Landlord Home', 'http://localhost:3001/uploads/avatars/1751257302111-428499173.jpg', '01861666884', 'Madani Avenue, Vatara, Dhaka', 'landlord', 1, '2025-06-24 10:25:17', 1, 0, 1, NULL),
(18, 'parvezhosen@gmail.com', '$2b$10$Rk0ulBAZbS1c30crRFPigeey31PwJQS9mWKPLuejb0JlxQopcDZzG', 'Parvez Hosen', NULL, NULL, NULL, 'user', 1, '2025-06-24 11:21:21', 1, 0, 1, NULL),
(19, 'admin@nestease.com', '$2b$10$NOOLBdf6ymlZIB1alupfVeWgw.h719KECg6c6Nu/.OKlL4ul4bzNK', 'Admin User', 'http://localhost:3001/uploads/avatars/1751242201590-208401316.jpg', '', '', 'admin', 1, '2025-06-30 00:03:54', 1, 0, 1, NULL),
(20, 'tenanthome@gmail.com', '$2b$10$8fbsh11XRK8RUc4BLqv8oOjmp9gDAbeODbGP5u1PRNTxR5owASYt.', 'Tenant Home', NULL, NULL, NULL, 'tenant', 1, '2025-06-30 01:05:39', 1, 0, 1, NULL),
(21, 'houseowner@gmail.com', '$2b$10$F/OnCIeyL40mRm4/LGLXD.qqtM5O.QFKXMCYj/xwMmH.KgRcWQpk2', 'House Owner', NULL, NULL, NULL, 'landlord', 1, '2025-06-30 01:07:49', 1, 0, 1, NULL),
(22, 'buyerhome@gmail.com', '$2b$10$QQjqGf1XPBSbnz57KQapxOkzr589sdqcxAoykoVU7Qbv6UCujKani', 'Buyer Home', NULL, NULL, NULL, 'buyer', 1, '2025-06-30 01:09:20', 1, 0, 1, NULL),
(23, 'sellerhome@gmail.com', '$2b$10$hirQdLzD6Y0qA2xy0T2WUudkeeG7wHqSHzUitSgeGiC1.Rb8tDcoy', 'Seller Home', NULL, NULL, NULL, 'seller', 1, '2025-06-30 01:10:03', 1, 0, 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d25f1ea79e282cc8a42bd616aa3` (`userId`);

--
-- Indexes for table `add_swap`
--
ALTER TABLE `add_swap`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `add_yours`
--
ALTER TABLE `add_yours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_eefb33e23a0348018218c1ed753` (`serviceProviderId`),
  ADD KEY `FK_72e32d29a7de28b3c469f858d56` (`customerId`);

--
-- Indexes for table `connected_account`
--
ALTER TABLE `connected_account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_484b6fb5944cf0def07f0508854` (`userId`);

--
-- Indexes for table `contact_form_messages`
--
ALTER TABLE `contact_form_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exchange_product`
--
ALTER TABLE `exchange_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_offer`
--
ALTER TABLE `item_offer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_692a909ee0fa9383e7859f9b406` (`userId`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_917755242ab5b0a0b08a63016d9` (`ownerId`);

--
-- Indexes for table `property_booking`
--
ALTER TABLE `property_booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_dedbee2fbf7cba1ecb5313486c1` (`propertyId`),
  ADD KEY `FK_8cc9f33884ae647db9cb19efefb` (`tenantId`);

--
-- Indexes for table `property_purchase`
--
ALTER TABLE `property_purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3102ec62447643f59e9308f2de7` (`propertyId`),
  ADD KEY `FK_5841de421847115d0dbb7d843b5` (`buyerId`);

--
-- Indexes for table `save_and_swap`
--
ALTER TABLE `save_and_swap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_de021692f3b90e342c578dcae9b` (`userId`),
  ADD KEY `FK_87f75a283a9b0f39d35cba121d2` (`propertyId`);

--
-- Indexes for table `sell_product`
--
ALTER TABLE `sell_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_provider`
--
ALTER TABLE `service_provider`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7b3850f163020f72d72f185c36b` (`ownerId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `add_swap`
--
ALTER TABLE `add_swap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `add_yours`
--
ALTER TABLE `add_yours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `connected_account`
--
ALTER TABLE `connected_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_form_messages`
--
ALTER TABLE `contact_form_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exchange_product`
--
ALTER TABLE `exchange_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `item_offer`
--
ALTER TABLE `item_offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `save_and_swap`
--
ALTER TABLE `save_and_swap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sell_product`
--
ALTER TABLE `sell_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_provider`
--
ALTER TABLE `service_provider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `FK_d25f1ea79e282cc8a42bd616aa3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `FK_72e32d29a7de28b3c469f858d56` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_eefb33e23a0348018218c1ed753` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_provider` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `connected_account`
--
ALTER TABLE `connected_account`
  ADD CONSTRAINT `FK_484b6fb5944cf0def07f0508854` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK_692a909ee0fa9383e7859f9b406` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `property`
--
ALTER TABLE `property`
  ADD CONSTRAINT `FK_917755242ab5b0a0b08a63016d9` FOREIGN KEY (`ownerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `property_booking`
--
ALTER TABLE `property_booking`
  ADD CONSTRAINT `FK_8cc9f33884ae647db9cb19efefb` FOREIGN KEY (`tenantId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_dedbee2fbf7cba1ecb5313486c1` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `property_purchase`
--
ALTER TABLE `property_purchase`
  ADD CONSTRAINT `FK_3102ec62447643f59e9308f2de7` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_5841de421847115d0dbb7d843b5` FOREIGN KEY (`buyerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `save_and_swap`
--
ALTER TABLE `save_and_swap`
  ADD CONSTRAINT `FK_87f75a283a9b0f39d35cba121d2` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_de021692f3b90e342c578dcae9b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `service_provider`
--
ALTER TABLE `service_provider`
  ADD CONSTRAINT `FK_7b3850f163020f72d72f185c36b` FOREIGN KEY (`ownerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
