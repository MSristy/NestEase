-- Reset NestEase Database
-- Run this script in MySQL Workbench, phpMyAdmin, or any MySQL client

-- Drop the existing database
DROP DATABASE IF EXISTS nestease;

-- Create a fresh database
CREATE DATABASE nestease;

-- Use the database
USE nestease;

-- The tables will be created automatically by TypeORM when you restart your backend
-- with synchronize: true enabled 