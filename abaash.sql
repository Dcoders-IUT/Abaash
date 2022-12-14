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
  `description` text DEFAULT NULL,
  `owner` varchar(50) NOT NULL,
  `gender` smallint(2) NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `level` int(3) NOT NULL,
  `area` double NOT NULL,
  `lift` tinyint(1) NOT NULL,
  `generator` tinyint(1) NOT NULL,
  `rent` int(10) DEFAULT NULL,
  `message` text NOT NULL DEFAULT '',
  `photo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`flatID`) USING BTREE,
  KEY `flat_ibfk_1` (`owner`),
  CONSTRAINT `flat_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `owner` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.flat: ~7 rows (approximately)
DELETE FROM `flat`;
/*!40000 ALTER TABLE `flat` DISABLE KEYS */;
INSERT INTO `flat` (`flatID`, `name`, `address`, `description`, `owner`, `gender`, `x`, `y`, `level`, `area`, `lift`, `generator`, `rent`, `message`, `photo`) VALUES
	(1001734, 'Sanctuary', 'Kolemeshor', 'Best', 'ork', 1, 23.947587604209236, 90.37590189795455, 2, 800, 0, 0, 2000, 'Please include your hometown in your message.', NULL),
	(1003432, 'Sanctuary', 'Mita Park', 'Best male residence outside IUT.', 'ork', 1, 23.94886359529383, 90.3756187977774, 2, 800, 0, 1, 3000, 'Please include your hometown in your message.', NULL),
	(1004979, 'Glorious Housing', 'Kathora', 'Best female residence outside IUT.', 'ork', 0, 23.94897163115608, 90.3798185760795, 3, 1350, 0, 0, 8000, 'Please include your hometown in your message.', 'ork1669366259867.jpg'),
	(1129304, 'Sattar House', 'Opposite of IUT', 'You can wake up at 7:55 and reach class on time!', 'ork', 0, 23.9489922, 90.3797594, 6, 1700, 0, 0, 4000, 'Please include your hometown in your message.', NULL),
	(1158151, 'New Home', 'Board Bazar', 'Just beside the mosque.', 'arifin', 0, 23.94462222232767, 90.38188038666934, 8, 850, 1, 0, 3500, 'Please include your hometown in your message.', 'arifin1669366469280.jpg'),
	(1438758, 'MAA Tower', 'Kathora', 'You wont feel your mother\'s absense!', 'ork', 0, 23.94897163115608, 90.3798185760795, 19, 1500, 1, 1, 7000, 'Please include your hometown in your message.', NULL),
	(1556134, 'Housing Complex', 'Bashundhara', 'Best', 'arifin', 1, 23.815276, 90.448183, 20, 22000, 0, 0, 85000, 'You must have CGPA 3.9 or above to rent this flat.', 'arifin1669012891745.jpg');
/*!40000 ALTER TABLE `flat` ENABLE KEYS */;

-- Dumping structure for table abaash.flatrequest
DROP TABLE IF EXISTS `flatrequest`;
CREATE TABLE IF NOT EXISTS `flatrequest` (
  `studentID` int(9) NOT NULL,
  `flatID` int(12) NOT NULL,
  `date` varchar(100) NOT NULL,
  `message` text DEFAULT NULL,
  PRIMARY KEY (`studentID`,`flatID`),
  KEY `flatrequest_ibfk_2` (`flatID`),
  CONSTRAINT `flatrequest_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `student` (`studentID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `flatrequest_ibfk_2` FOREIGN KEY (`flatID`) REFERENCES `flat` (`flatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.flatrequest: ~0 rows (approximately)
DELETE FROM `flatrequest`;
/*!40000 ALTER TABLE `flatrequest` DISABLE KEYS */;
INSERT INTO `flatrequest` (`studentID`, `flatID`, `date`, `message`) VALUES
	(190041115, 1001734, '2022-12-24T4:7:37.767', 'Hi um interested');
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
  `photo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nid` (`nid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.owner: ~4 rows (approximately)
DELETE FROM `owner`;
/*!40000 ALTER TABLE `owner` DISABLE KEYS */;
INSERT INTO `owner` (`name`, `username`, `password`, `passwordLastChanged`, `phone`, `email`, `nid`, `photo`) VALUES
	('Sherajul Arifin', 'arifin', 'cb19b4edd90562692900e12c8c19f7e1b3240b88831e46e8fffee6cc88fc0664', '2022-10-18T20:57:36.383', 1731568888, 'gmail@arifin.com', 65274196, NULL),
	('Ork the Bariola', 'ork', 'f6c3a82f8d5ed8b78bfd15d639410719ce24d8393fb020a722c298831d8a6555', '2022-9-15T3:29:21.858', 1731969826, 'ork@bariola.com', 2000785, 'ork1671856390627.jpg'),
	('Tanvir Hasan Saikat', 'saikat', 'c3f604b8a8b797a0d402738c7f588511555702ef8e73bd78dfd37a9ef3c50877', '2022-10-12T13:6:8.284', 1745986461, 'saikat@gmail.com', 46541646, NULL),
	('Sumit Alam Khan', 'sumit', 'cb19b4edd90562692900e12c8c19f7e1b3240b88831e46e8fffee6cc88fc0664', '2022-10-18T20:57:36.383', 1731569827, 'sumit@iut.edu', 85274196, NULL);
/*!40000 ALTER TABLE `owner` ENABLE KEYS */;

-- Dumping structure for table abaash.room
DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `flatid` int(11) NOT NULL,
  `bed` int(11) NOT NULL,
  `din` int(11) NOT NULL,
  `liv` int(11) NOT NULL,
  `kit` int(11) NOT NULL,
  `bath` int(11) NOT NULL,
  `balk` int(11) NOT NULL,
  `xtra` int(11) NOT NULL,
  PRIMARY KEY (`flatid`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`flatid`) REFERENCES `flat` (`flatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.room: ~7 rows (approximately)
DELETE FROM `room`;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` (`flatid`, `bed`, `din`, `liv`, `kit`, `bath`, `balk`, `xtra`) VALUES
	(1001734, 3, 1, 1, 1, 3, 3, 0),
	(1003432, 0, 0, 0, 0, 0, 0, 0),
	(1004979, 0, 0, 0, 0, 0, 0, 0),
	(1129304, 3, 1, 1, 1, 2, 2, 0),
	(1158151, 0, 0, 0, 0, 0, 0, 0),
	(1438758, 0, 0, 0, 0, 0, 0, 0),
	(1556134, 5, 1, 2, 1, 4, 3, 0);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;

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
  `photo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`studentID`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table abaash.student: ~5 rows (approximately)
DELETE FROM `student`;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` (`name`, `gender`, `studentID`, `password`, `passwordLastChanged`, `phone`, `email`, `nid`, `bloodgroup`, `photo`) VALUES
	('Fardin', 1, 190041112, '519211b1c823753d0db208af050b9fe855b7379aeacf1f7e4b834c5e7378390e', '2022-9-28T7:15:16.53', 1930305520, 'mahtabnur@iut-dhaka.edu', 0, 'AB+', NULL),
	('Shahnewaz', 1, 190041115, '554c5ae562e9cebc8a7fa1df8c848444b4b01e250b117341dba00d293073b099', '2022-12-24T3:38:0.876', 1234567895, 'labib@gmail.com', 0, ' ', NULL),
	('Reaz Hassan Joarder', 1, 190041117, '5c647824cbd72e2f7108a0e39f48d5540309f05ded4f6fabe0005797ac4c24ea', '2022-10-20T18:10:53.467', 1986731598, 'reazhassan@iut-dhaka.edu', 93461935, 'A+', NULL),
	('Nafi', 1, 190041120, 'ff20e2239111482880e23eb82ddce6e3ad3ea4ec9914fa231181a76ff220a3da', '2022-9-28T6:50:41.680', 1498714970, 'nafi120@gmail.com', 123164867, 'B+', NULL),
	('Jubayer', 1, 190041129, 'bc8e7191c2fae4af85e6b728bcec435a48fe18faf0ee58d710800d0da33be456', '2022-9-14T16:12:16.155', 1829977462, 'jubayerislam@iut-dhaka.edu', 0, 'A+', NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
