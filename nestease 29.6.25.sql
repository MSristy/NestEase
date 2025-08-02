-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 29, 2025 at 04:49 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
(4, 'Abdul Bari', '01521782400', 'renthome@gmail.com', 'Car', 'vehicles', 'New', 'Chittagong', 'Good', '/uploads/swaps/bb327bb8-e1bc-4d0c-b746-ee5ada5e9cc2.jpg', '2025-06-24 17:56:58.936088'),
(5, 'New Seller', '01403851619', 'newseller@gmail.com', 'Phone', 'electronics', 'New', 'Dhaka', 'Good', '/uploads/swaps/image-1751034300548-37614854.jpg', '2025-06-27 20:25:00.556102');

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
(5, 13, 24, 'Moving', '2025-06-30', '12:30', 1, 'Dhaka', 'Good', 'rejected', 100.00, 'Not avaiable on that day in dhaka', '2025-06-29 00:32:20.427707', '2025-06-29 00:33:50.000000', 'pending', 'pending', NULL),
(6, 13, 24, 'Moving', '2025-07-02', '13:40', 1, 'Dhaka', 'Good', 'approved', 1500.00, NULL, '2025-06-29 01:39:38.531865', '2025-06-29 05:05:32.000000', 'paid', 'cash', 'BILL-6-1751151932372'),
(7, 12, 24, 'Electrical', '2025-06-30', '17:05', 1, 'Dhaka', 'Good', 'pending_approval', 1000.00, NULL, '2025-06-29 02:04:44.905782', '2025-06-29 02:04:44.905782', 'pending', 'pending', NULL);

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
(5, 'Tareq Monour', '01403851620', 'parvezhosen@gmail.com', 'Sofa', 'furniture', 'Like New', 'Dhaka', 'Good', '/uploads/products/4dab3f98-855c-4a58-8b97-81a4f09bc479.jpg', '2025-06-27 05:10:05.059000', 'pending'),
(6, 'New User', '01403851620', 'newseller@gmail.com', 'Phone', 'electronics', 'Like New', 'Dhaka', 'Good Quality', '/uploads/products/1632d7fa-6d4b-4f24-9c1a-5b52998dd422.jpg', '2025-06-27 20:26:23.316000', 'declined');

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `job_applications`
--

INSERT INTO `job_applications` (`id`, `firstName`, `lastName`, `email`, `phone`, `position`, `department`, `coverLetter`, `resumeUrl`, `portfolioUrl`, `linkedinUrl`, `githubUrl`, `experience`, `education`, `skills`, `expectedSalary`, `noticePeriod`, `availability`, `status`, `adminNotes`, `rejectionReason`, `createdAt`, `updatedAt`) VALUES
(1, 'Parvez', 'Hossen', 'parvez302834@gmail.com', '01403851619', 'Frontend Developer', 'Engineering', 'Good', 'https://tiiny.host/?content=resume', 'https://tiiny.host/?content=resume', 'https://tiiny.host/?content=resume', 'https://tiiny.host/?content=resume', '2 years', 'BSc. in CSE', 'Design', '40000', '2 week', 'Immidiate', 'interview', NULL, NULL, '2025-06-28 02:53:37.928229', '2025-06-28 02:58:44.000000');

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
(5, 1710000000000, 'AddUserRole1710000000000'),
(6, 1710000000000, 'AddPropertyType1710000000000'),
(7, 1710000000001, 'AddPaymentFieldsToBooking1710000000001'),
(8, 1711036800000, 'CreateAddYoursTable1711036800000'),
(9, 1717000000000, 'CreateAddSwapTable1717000000000'),
(10, 1748547046391, 'RemoveImageUrlFromAddSwap1748547046391'),
(11, 1748547046392, 'FixAmenitiesAndAddBachelorFriendly1748547046392');

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
('117ac6d5-6765-47b6-9426-e88f8393c928', 'Landlord Home', '01764968800', 'landlord@gmail.com', '', 'Good ', 'Chittagong', 'Chittagong', 'Chittagong', '5555', 20000.00, 3, 3, 1500, 'RENT', 'AVAILABLE', '/uploads/properties/3bd3be42-74a3-4a6d-b0ab-7e625547d82f.jpg', 1, 0, 'house', 7, '2025-06-24 16:26:46.716256', '2025-06-29 06:03:53.048715', 0, NULL),
('30259eb6-a69c-4fb0-9b87-a3786dbcd599', 'Sell Home', '01764968811', 'sellhome@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '2500', 200000.00, 2, 2, 1200, 'SALE', 'PENDING', '/uploads/properties/0426830f-bd56-439b-b856-8e39bb8067d1.jpg', 1, 0, 'villa', 6, '2025-06-24 20:39:11.568402', '2025-06-24 20:40:37.000000', 0, NULL),
('459fdc58-ba14-411b-bf7b-85bba2472bbb', 'Landlord Home', '01764968722', 'landlord@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5000', 25000.00, 3, 3, 1800, 'RENT', 'AVAILABLE', '/uploads/properties/7553454b-483c-4230-94d7-73c32c55f48a.jpg', 1, 0, 'house', 7, '2025-06-24 16:32:54.157748', '2025-06-29 06:03:49.309255', 0, NULL),
('5aeb50b0-ec9d-4c9c-92b5-aab32510b0f4', 'Landlord Home', '01764968811', 'landlord@gmail.com', '', 'Good', 'Rangpur', 'Rangpur', 'Rangpur', '2500', 10000.00, 2, 2, 1000, 'RENT', 'PENDING', '/uploads/properties/c997464e-0faf-450e-8efe-1754a16a2f96.jpg', 1, 0, 'studio', 7, '2025-06-24 16:29:40.141473', '2025-06-29 04:29:10.000000', 0, NULL),
('901bbda1-6b21-4b60-b083-6728aa50ae0c', 'Sell Home', '01764968800', 'sellhome@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5555', 540000.00, 3, 3, 1600, 'SALE', 'AVAILABLE', '/uploads/properties/4ea46733-a557-43ca-8832-d1f55a88d0b8.jpg', 1, 0, 'house', 6, '2025-06-24 20:30:26.894901', '2025-06-29 06:03:44.840943', 0, NULL),
('9f97332b-29f1-41e1-a1f5-965c2373df30', 'Mahmuda Sristy', '01521782455', 'newlandlord@gmail.com', '', 'Good', 'Gulsan', 'Dhaka', 'Dhaka', '5555', 27500.00, 3, 3, 1500, 'RENT', 'AVAILABLE', '/uploads/properties/183fb8d8-10fe-4afb-a185-520b9beebe1f.jpg,/uploads/properties/34a2cf4d-78a9-47e2-ba58-9c4352fd2f83.jpg,/uploads/properties/9874ecd0-c10c-4414-9543-d382cae5ca9a.jpg', 1, 0, 'house', 19, '2025-06-29 06:42:14.813643', '2025-06-29 06:42:14.813643', 1, NULL),
('ab84e61f-a563-4eb6-9a6d-d1b0eea91358', 'Sell Home', '01764968722', 'sellhome@gmail.com', '', 'Good', 'Chittagong', 'Chittagong', 'Chittagong', '5000', 300000.00, 3, 2, 1500, 'SALE', 'SOLD', '/uploads/properties/4a7e58d6-e1a4-4bd5-b20b-dc784be78c08.jpg', 1, 0, 'house', 6, '2025-06-24 20:29:07.278421', '2025-06-24 20:31:20.000000', 0, NULL),
('b04a03dd-9a8f-4916-871d-5e25de8f743b', 'New Seller', '01521782455', 'newseller@gmail.com', '', 'Good', 'Vatara', 'Dhaka', 'Dhaka', '5555', 1250000.00, 3, 3, 1200, 'SALE', 'SOLD', '/uploads/properties/10728581-b69a-41cd-8381-70051cb4d4e6.jpg', 1, 0, 'house', 21, '2025-06-27 22:21:22.022061', '2025-06-27 23:52:14.000000', 0, NULL),
('c23e4a6c-290e-425a-8ef6-e927bf4e4254', 'New Seller', '01521782400', 'newseller@gmail.com', '', 'Good', 'Vatara', 'Dhaka', 'Dhaka', '5000', 4500000.00, 3, 2, 1500, 'SALE', 'AVAILABLE', '/uploads/properties/50dd2998-28c6-4b7d-9579-7cf904a50c3e.jpg', 1, 0, 'house', 21, '2025-06-27 20:23:49.822028', '2025-06-29 06:03:32.598333', 0, NULL),
('e32ea929-776b-45b8-998e-cd6dde6fc211', 'New Landlord', '01521782400', 'newlandlord@gmail.com', '', 'Good', 'Vatara', 'Dhaka', 'Dhaka', '5005', 24500.00, 3, 3, 1200, 'RENT', 'AVAILABLE', '/uploads/properties/5872d2ce-afe5-4ff3-a068-e2b6788e0146.jpg,/uploads/properties/92abd55e-bed1-42ff-9c1a-d5898efc40ae.jpg,/uploads/properties/5c514f39-f100-4f4e-9eae-bf68eeb3055d.jpg', 1, 0, 'house', 19, '2025-06-29 06:02:18.102840', '2025-06-29 06:02:18.102840', 1, NULL),
('e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 'Tareq Monour', '01764968722', 'tareqmonour00@gmail.com', '', 'Good', 'Madani Avenue, Vatara, Dhaka', 'Dhaka', 'Dhaka', '5000', 20000.00, 3, 2, 1200, 'RENT', 'PENDING', '/uploads/properties/fb01aa1c-6615-4b29-a24b-6569702d8eb2.jpg', 1, 0, 'house', 7, '2025-06-24 04:11:49.174439', '2025-06-24 19:03:31.157466', 0, NULL),
('eb17b005-b20b-4a1c-85be-058d5b8d33c0', 'New Landlord', '01521782450', 'newlandlord@gmail.com', '', 'Good', 'Gulsan', 'Dhaka', 'Dhaka', '5005', 35000.00, 3, 3, 1600, 'RENT', 'AVAILABLE', '/uploads/properties/4712cd80-8945-4e04-8716-58389b4b11ff.jpg', 1, 1, 'house', 19, '2025-06-27 20:34:29.454903', '2025-06-29 06:03:05.238818', 0, NULL);

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
('1cc05610-f9d3-4248-b517-745938e6d0ef', '2025-06-24 04:30:38', '2025-06-24 04:30:38', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 04:30:38.420242', '2025-06-24 04:30:38.420242', NULL, NULL),
('2c4df023-ce49-4b9e-aa8f-f9b9e9ab389a', '2025-06-24 18:43:02', '2025-06-24 18:43:02', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 18:43:02.191420', '2025-06-24 18:43:02.191420', NULL, NULL),
('3ee5c014-ed9d-4f3d-8e05-8602ac62f3cc', '2025-06-27 20:35:27', '2025-06-27 20:35:27', 35000.00, 'REJECTED', 'PENDING', NULL, NULL, 0, 'eb17b005-b20b-4a1c-85be-058d5b8d33c0', 20, '2025-06-27 20:35:27.771080', '2025-06-27 23:57:54.000000', NULL, NULL),
('6ae59052-1bd1-4610-b23e-347b980f9f0f', '2025-06-24 04:13:48', '2025-06-24 04:13:48', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 04:13:48.700981', '2025-06-24 04:13:48.700981', NULL, NULL),
('87cd3a88-edd3-4b62-9956-259d0b0246df', '2025-06-24 17:44:01', '2025-06-24 17:44:01', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 17:44:01.310598', '2025-06-24 17:44:01.310598', NULL, NULL),
('bbeb5e67-31e7-45c5-b342-cf41a0d443ce', '2025-06-29 04:21:38', '2025-06-29 04:21:38', 35000.00, 'REJECTED', 'PENDING', NULL, NULL, 0, 'eb17b005-b20b-4a1c-85be-058d5b8d33c0', 20, '2025-06-29 04:21:38.512604', '2025-06-29 04:29:47.000000', NULL, NULL),
('c8d7fcb7-6e75-4250-b85e-c7d37f3ee716', '2025-06-29 04:29:10', '2025-06-29 04:29:10', 10000.00, 'PENDING', 'PENDING', NULL, NULL, 0, '5aeb50b0-ec9d-4c9c-92b5-aab32510b0f4', 20, '2025-06-29 04:29:10.967854', '2025-06-29 04:29:10.967854', NULL, NULL),
('f0692124-673d-4510-8822-39bd93659866', '2025-06-24 18:54:22', '2025-06-24 18:54:22', 30000.00, 'PENDING', 'PENDING', NULL, NULL, 0, '06039826-6bbd-4c9a-a648-36094f6081ba', 2, '2025-06-24 18:54:22.567030', '2025-06-24 18:54:22.567030', NULL, NULL),
('f1811f0c-7f57-4a8f-8f4d-a4bea27e3839', '2025-06-24 17:58:43', '2025-06-24 17:58:43', 20000.00, 'PENDING', 'PENDING', NULL, NULL, 0, 'e8a26dd6-c7b3-4d53-be5a-055e1d9b2091', 2, '2025-06-24 17:58:43.577539', '2025-06-24 17:58:43.577539', NULL, NULL);

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
('01c8f54a-5aba-4047-8e1d-c66b9c700104', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 23:32:54.807816', '2025-06-27 23:33:49.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
('01e7fa99-0346-4657-8fd9-71e53fc9169e', 1250000.00, 'CONFIRMED', 'PENDING', NULL, '2025-06-27 23:43:13.043948', '2025-06-27 23:52:14.000000', 'b04a03dd-9a8f-4916-871d-5e25de8f743b', 22, NULL, NULL),
('16a18061-38ac-4677-b43a-9fcc17184ead', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 20:31:37.549443', '2025-06-27 23:08:36.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
('40d2756a-af55-435d-8b40-82852dae6fa3', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 23:10:07.033900', '2025-06-27 23:10:39.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
('63079089-1480-4d2d-a9a0-b511aeac714d', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 23:23:44.225835', '2025-06-27 23:24:57.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
('876a5746-4b74-4ee7-91a0-b56d2cb0c985', 1250000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 22:23:02.845897', '2025-06-27 22:51:46.000000', 'b04a03dd-9a8f-4916-871d-5e25de8f743b', 22, NULL, NULL),
('8a9cab82-92d3-405c-873d-33ba5194fd37', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-28 00:09:29.038000', '2025-06-28 00:09:50.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
('c4cb1b3b-9818-4407-9453-26fd9d894af8', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 23:27:43.580960', '2025-06-27 23:29:05.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
('cc6514bd-feff-4f10-9256-f3c4f1b25bf4', 4500000.00, 'REJECTED', 'PENDING', NULL, '2025-06-27 23:56:55.207180', '2025-06-27 23:57:26.000000', 'c23e4a6c-290e-425a-8ef6-e927bf4e4254', 22, NULL, NULL),
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
(1, 'Cleaning Store', 'I\'m good at cleaning home.', 'AC Repair', '01521782400', 'Dhaka', 'Dhaka', '', '0000', 'I\'m good at cleaning home.', '/uploads/services/34e1861d-ab22-40a3-8ea6-7f252b100fb4.jpg', 1, 1, 4.00, '2025-06-24 04:22:26.351203', '2025-06-28 01:55:27.000000', 3, 0, 0),
(12, 'EcoNix', 'I\'m a electrician, I provide good service.', 'Electrical', '0152178240', 'Dhaka', 'Dhaka', '', '0000', 'I\'m a electrician, I provide good service.', '/uploads/services/d455645e435b1295874784f59eb5f67d.jpg', 1, 0, 4.00, '2025-06-24 17:27:45.140620', '2025-06-24 17:27:45.140620', 18, 0, 0),
(13, 'MoveMe', 'We are shifting your items in a gentle manner!', 'Moving', '01403851619', 'Dhaka', 'Dhaka', '', '0000', 'We are shifting your items in a gentle manner!', '/uploads/services/3d3d5886-0d57-4bc2-aa6a-bd33ec5c3c78.jpg', 1, 0, 4.00, '2025-06-27 19:46:12.141146', '2025-06-29 01:04:23.780109', 23, 0, 0);

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
(1, 'tareqmonour00@gmail.com', '$2b$10$5.cm9EaEteY1VkwYl7oy6.Lg787zM0V53VRQ0Vq7ort9ug4bfX7Ai', 'Tareq Monour', NULL, NULL, NULL, 'ADMIN', 1, '2025-06-23 22:10:58', 1, 0, 1, NULL),
(2, 'renthome@gmail.com', '$2b$10$8xf8Rf9GhtNJf4ZDTjbhge4kAEOqqX4jQBBfCmhaFjn8noNH2ntpa', 'Rent Home', NULL, NULL, NULL, 'TENANT', 1, '2025-06-23 22:13:25', 1, 0, 1, NULL),
(3, 'serviceprovider@gmail.com', '$2b$10$z6xOOcH.ftEmeq5cAqpeweSbOpGGtL8G75Z61MvAF7sGrh5RWuvS6', 'Service Provider', NULL, NULL, NULL, 'SERVICE_PROVIDER', 1, '2025-06-23 22:21:16', 1, 0, 1, NULL),
(4, 'lnishat@gmail.com', '$2b$10$ePY5vLKW6pEBoffv6lpnIeSRUxHkKGP4yUvkdJBxEUBCcUBEsAZBK', 'Lotifur Nishat', NULL, NULL, NULL, 'USER', 1, '2025-06-23 22:27:09', 1, 0, 1, NULL),
(5, 'buyhome@gmail.com', '$2b$10$BumMppVBQPKhWeFMhju8ce1Gnd8aJU5e8fERHFRvLn9dfLiTRJgtS', 'Buy Home', NULL, NULL, NULL, 'BUYER', 1, '2025-06-24 10:21:02', 1, 0, 1, NULL),
(6, 'sellhome@gmail.com', '$2b$10$.vjWZMW6l6A/ZMrSwpUxae50LnCvi7C6aB/QS6e8MSFVH7Ah96m16', 'Sell Home', NULL, NULL, NULL, 'SELLER', 1, '2025-06-24 10:21:34', 1, 0, 1, NULL),
(7, 'landlord@gmail.com', '$2b$10$G9efzY/lO9Adqnpm0Pjse.BR7v.DNOz/bG.deT4Q8s.XGg6RNCufa', 'Landlord Home', NULL, NULL, NULL, 'LANDLORD', 1, '2025-06-24 10:25:17', 1, 0, 1, NULL),
(18, 'parvezhosen@gmail.com', '$2b$10$MzowR5JRLi.FZHLZv1SxJeb2GabvNPAy1owTaUK4WmYpBMrc3Ia3.', 'Parvez Hosen', NULL, NULL, NULL, 'SERVICE_PROVIDER', 1, '2025-06-24 11:21:21', 1, 0, 1, NULL),
(19, 'newlandlord@gmail.com', '$2b$10$cGBzRHht8zCHU0Y/gCT0yuIzKy5ye6EUXsQbZlYtnZ7UG0YoMOO2a', 'New Landlord', NULL, NULL, NULL, 'LANDLORD', 1, '2025-06-27 13:39:38', 1, 0, 1, NULL),
(20, 'newtenant@gmail.com', '$2b$10$1N4PQP3EYUD8WfCs3pfHIuCBOKJEz2rhfJJ6Q00.RxflWlvnZpKqK', 'New Tenant', NULL, NULL, NULL, 'TENANT', 1, '2025-06-27 13:40:20', 1, 0, 1, NULL),
(21, 'newseller@gmail.com', '$2b$10$3HmUxZY1fVO65bRni89A0eSIINWog/LiDJ4mwrL1bAVB7xhHziSJq', 'New Seller', NULL, NULL, NULL, 'SELLER', 1, '2025-06-27 13:41:09', 1, 0, 1, NULL),
(22, 'newbuyer@gmail.com', '$2b$10$L8l/7QFB/R33KosQ87Buc.gPoS3VUSVDYE1LQRB02.Cb/1N.U6xGa', 'New Buyer', NULL, NULL, NULL, 'BUYER', 1, '2025-06-27 13:41:47', 1, 0, 1, NULL),
(23, 'newsprovider@gmail.com', '$2b$10$yLodpypnqzmOwYBmh9auVuQXZc34hdfUlucaJY0RtG1ar6/oZRRL.', 'New Service Provider', NULL, NULL, NULL, 'SERVICE_PROVIDER', 1, '2025-06-27 13:42:41', 1, 0, 1, NULL),
(24, 'newuser@gmail.com', '$2b$10$PuJZGnWCxR4EomBb51ILGOYlIM.6aQ3kXV.WINSTr1Y5q0cw.6jVG', 'New User', NULL, NULL, NULL, 'USER', 1, '2025-06-27 13:43:34', 1, 0, 1, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `add_yours`
--
ALTER TABLE `add_yours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `item_offer`
--
ALTER TABLE `item_offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
