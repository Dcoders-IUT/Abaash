-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.11.0-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for abaash
DROP DATABASE IF EXISTS `abaash`;
CREATE DATABASE IF NOT EXISTS `abaash` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `abaash`;

-- Dumping structure for table abaash.flat
DROP TABLE IF EXISTS `flat`;
CREATE TABLE IF NOT EXISTS `flat` (
  `flatID` int(12) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `gender` smallint(2) NOT NULL DEFAULT 0,
  `x` decimal(16,16) NOT NULL,
  `y` decimal(16,16) NOT NULL,
  `level` int(3) NOT NULL,
  `owner` varchar(50) NOT NULL,
  `lift` tinyint(1) NOT NULL DEFAULT 0,
  `generator` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`flatID`) USING BTREE,
  KEY `owner` (`owner`),
  CONSTRAINT `flat_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `owner` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.flat: ~5 rows (approximately)
DELETE FROM `flat`;
/*!40000 ALTER TABLE `flat` DISABLE KEYS */;
INSERT INTO `flat` (`flatID`, `name`, `address`, `gender`, `x`, `y`, `level`, `owner`, `lift`, `generator`) VALUES
	(1001734, 'Ork er Flat 1', 'In Our Hearts', 1, 0.0000000000000000, 0.0000000000000000, 2, 'ork', 0, 1),
	(1002726, 'Ork er Flat 2', 'In Our Hearts', 1, 0.0000000000000000, 0.0000000000000000, 1, 'ork', 1, 0),
	(1003432, 'Ork er Flat 3', 'In Our Hearts', 1, 0.0000000000000000, 0.0000000000000000, 2, 'ork', 0, 1),
	(1004979, 'Ork er Flat 4', 'In Our Hearts', 2, 0.0000000000000000, 0.0000000000000000, 3, 'ork', 0, 1),
	(1158151, 'gultu', 'dhaka', 1, 0.0000000000000000, 0.0000000000000000, 20, 'arifin', 1, 1);
/*!40000 ALTER TABLE `flat` ENABLE KEYS */;

-- Dumping structure for table abaash.flatrequest
DROP TABLE IF EXISTS `flatrequest`;
CREATE TABLE IF NOT EXISTS `flatrequest` (
  `studentID` int(9) NOT NULL,
  `flatID` int(12) NOT NULL,
  `date` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`studentID`,`flatID`),
  KEY `flatID` (`flatID`),
  CONSTRAINT `flatrequest_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentID`),
  CONSTRAINT `flatrequest_ibfk_2` FOREIGN KEY (`flatID`) REFERENCES `flat` (`flatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.flatrequest: ~1 rows (approximately)
DELETE FROM `flatrequest`;
/*!40000 ALTER TABLE `flatrequest` DISABLE KEYS */;
INSERT INTO `flatrequest` (`studentID`, `flatID`, `date`) VALUES
	(190041120, 1002726, '2022-9-28T8:10:22.870');
/*!40000 ALTER TABLE `flatrequest` ENABLE KEYS */;

-- Dumping structure for table abaash.owner
DROP TABLE IF EXISTS `owner`;
CREATE TABLE IF NOT EXISTS `owner` (
  `name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(70) NOT NULL,
  `passwordLastChanged` varchar(100) NOT NULL,
  `phone` int(12) NOT NULL,
  `email` varchar(200) NOT NULL,
  `nid` int(20) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nid` (`nid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.owner: ~1 rows (approximately)
DELETE FROM `owner`;
/*!40000 ALTER TABLE `owner` DISABLE KEYS */;
INSERT INTO `owner` (`name`, `username`, `password`, `passwordLastChanged`, `phone`, `email`, `nid`) VALUES
	('Sherajul Arifin', 'arifin', '65ca3d04be0cc68c1a7003f8aab5e7c9f93d83fa94351f91925e4dcabb5065fe', '2022-9-25T14:13:17.638', 111, 'gmail@arifin.com', 111),
	('Ork the Bariola', 'ork', 'f6c3a82f8d5ed8b78bfd15d639410719ce24d8393fb020a722c298831d8a6555', '2022-9-15T3:29:21.858', 1731969827, 'ork@bariola.com', 123);
/*!40000 ALTER TABLE `owner` ENABLE KEYS */;

-- Dumping structure for table abaash.student
DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `name` varchar(50) NOT NULL,
  `gender` tinyint(1) NOT NULL,
  `studentID` int(9) NOT NULL,
  `password` varchar(70) NOT NULL,
  `passwordLastChanged` varchar(100) NOT NULL,
  `phone` int(12) NOT NULL,
  `email` varchar(200) NOT NULL,
  `nid` int(20) NOT NULL,
  `bloodgroup` varchar(4) NOT NULL DEFAULT ' ',
  `flatID` int(12) DEFAULT NULL,
  PRIMARY KEY (`studentID`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nid` (`nid`),
  KEY `student_ibfk_1` (`flatID`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`flatID`) REFERENCES `flat` (`flatID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.student: ~3 rows (approximately)
DELETE FROM `student`;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` (`name`, `gender`, `studentID`, `password`, `passwordLastChanged`, `phone`, `email`, `nid`, `bloodgroup`, `flatID`) VALUES
	('Fardin', 1, 112, '519211b1c823753d0db208af050b9fe855b7379aeacf1f7e4b834c5e7378390e', '2022-9-28T7:15:16.53', 543156464, 'fardinnur12@gmail.com', 56466, 'AB+', NULL),
	('Jubayer', 1, 129, 'bc8e7191c2fae4af85e6b728bcec435a48fe18faf0ee58d710800d0da33be456', '2022-9-14T16:12:16.155', 182, 'jubayer@gmail.com', 1223, 'A+', 1002726),
	('Nafi', 1, 190041120, 'ff20e2239111482880e23eb82ddce6e3ad3ea4ec9914fa231181a76ff220a3da', '2022-9-28T6:50:41.680', 49871497, 'nafi@gmail.com', 123164867, 'B+', NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
