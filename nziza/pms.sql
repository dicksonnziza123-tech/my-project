-- phpMyAdmin SQL Dump
-- version 2.11.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 09, 2026 at 08:42 AM
-- Server version: 5.0.51
-- PHP Version: 5.2.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `pms`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_Id` int(255) NOT NULL auto_increment,
  `FirstNme` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PhoneNumber` int(255) NOT NULL,
  `CreatedAt` varchar(255) NOT NULL,
  `Status` varchar(255) NOT NULL,
  PRIMARY KEY  (`customer_Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_Id`, `FirstNme`, `LastName`, `Email`, `PhoneNumber`, `CreatedAt`, `Status`) VALUES
(1, 'nziza', 'dickson', 'dickson@gmail.com', 98765876, 'azert', 'active'),
(4, 'kaka', 'sam', 'kaka@gmail.com', 794665673, '2026-06-08T13:55:41.109Z', 'active'),
(5, 'okello', 'bushali', 'imbwa@gmail.com', 788123411, '2026-06-08T14:02:38.278Z', 'blocked'),
(6, 'muneza', 'goefrey', 'muneza@gmail.com', 98765, '2026-06-08T14:34:42.958Z', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `PromotionId` int(255) NOT NULL auto_increment,
  `Title` varchar(255) NOT NULL,
  `Department` varchar(255) NOT NULL,
  `Discount_Type` varchar(255) NOT NULL,
  `Discount_Value` varchar(255) NOT NULL,
  `Start_Date` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `End_Date` timestamp NOT NULL default '0000-00-00 00:00:00',
  `Status` varchar(255) NOT NULL,
  PRIMARY KEY  (`PromotionId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `promotion`
--

INSERT INTO `promotion` (`PromotionId`, `Title`, `Department`, `Discount_Type`, `Discount_Value`, `Start_Date`, `End_Date`, `Status`) VALUES
(1, 'free', 'General', 'Flat', '1234', '2026-06-08 00:00:00', '2026-06-08 00:00:00', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_vehicle`
--

CREATE TABLE `promotion_vehicle` (
  `PromotionVehicleID` int(255) NOT NULL auto_increment,
  `VehicleId` int(255) NOT NULL,
  `PromotionId` int(255) NOT NULL,
  `Performance` varchar(255) NOT NULL,
  PRIMARY KEY  (`PromotionVehicleID`),
  KEY `VehicleId` (`VehicleId`),
  KEY `PromotionId` (`PromotionId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `promotion_vehicle`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` int(255) NOT NULL auto_increment,
  `UserName` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(255) NOT NULL,
  PRIMARY KEY  (`UserId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `UserName`, `Password`, `Role`) VALUES
(1, 'nziza', '2007', 'manager'),
(2, 'nziza', '2007', 'manager');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `VehicleId` int(255) NOT NULL auto_increment,
  `Plate_Number` int(255) NOT NULL,
  `Brand` varchar(255) NOT NULL,
  `Model` varchar(255) NOT NULL,
  `Year` varchar(255) NOT NULL,
  `Vehicle_Type` varchar(255) NOT NULL,
  `Purchase_Price` varchar(255) NOT NULL,
  `Status` varchar(255) NOT NULL,
  PRIMARY KEY  (`VehicleId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`VehicleId`, `Plate_Number`, `Brand`, `Model`, `Year`, `Vehicle_Type`, `Purchase_Price`, `Status`) VALUES
(3, 0, 'toyota', 'corolle', '2015', 'sedan', '250000000', 'Available'),
(5, 0, 'benz', 'fyuyiuoi', '12345', 'qsdft', '1234567', 'Inactive');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `promotion_vehicle`
--
ALTER TABLE `promotion_vehicle`
  ADD CONSTRAINT `promotion_vehicle_ibfk_1` FOREIGN KEY (`VehicleId`) REFERENCES `vehicle` (`VehicleId`),
  ADD CONSTRAINT `promotion_vehicle_ibfk_2` FOREIGN KEY (`PromotionId`) REFERENCES `promotion` (`PromotionId`);
