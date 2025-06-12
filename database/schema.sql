CREATE SCHEMA `stockacc_db` ;

CREATE TABLE `stockacc_db`.`bank_details` (
  `Bank_Acc_No` VARCHAR(19) NOT NULL,
  `Bank_Acc_Name` VARCHAR(50) NULL,
  `Bank_Acc_Date_of_Opening` DATE NULL,
  `Bank_Name` VARCHAR(50) NULL,
  `Branch` VARCHAR(30) NULL,
  PRIMARY KEY (`Bank_Acc_No`),
  UNIQUE INDEX `Bank_Acc_No_UNIQUE` (`Bank_Acc_No` ASC) VISIBLE);


CREATE TABLE `stockacc_db`.`contact_person_details` (
  `Contact_ID` CHAR(5) NOT NULL,
  `C_Name` VARCHAR(50) NULL,
  `C_Address` VARCHAR(150) NULL,
  `C_Postal_Code` CHAR(5) NULL,
  `C_Email` VARCHAR(60) NULL,
  `C_Contact_Number` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Contact_ID`),
  UNIQUE INDEX `Contact_ID_UNIQUE` (`Contact_ID` ASC) VISIBLE,
  UNIQUE INDEX `C_Email_UNIQUE` (`C_Email` ASC) VISIBLE);


CREATE TABLE `stockacc_db`.`personal_data` (
  `Acc_ID` CHAR(4) NOT NULL,
  `P_Name` VARCHAR(50) NULL,
  `P_Address` VARCHAR(150) NULL,
  `P_Postal_Code` CHAR(5) NULL,
  `P_Cell_Number` BIGINT NOT NULL,
  `P_Email` VARCHAR(60) NULL,
  `Date_of_Birth` DATE NULL,
  `Employment_Status` ENUM('Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired') NULL,
  `Purpose_of_Opening` ENUM('Savings', 'Investment', 'Business', 'Personal Use', 'Retirement', 'Others') NULL,
  `Funding_ID` CHAR(7) NOT NULL,
  `Bank_Acc_No` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Acc_ID`),
  UNIQUE INDEX `Acc_ID_UNIQUE` (`Acc_ID` ASC) VISIBLE,
  UNIQUE INDEX `P_Cell_Number_UNIQUE` (`P_Cell_Number` ASC) VISIBLE,
  UNIQUE INDEX `P_Email_UNIQUE` (`P_Email` ASC) VISIBLE,
  UNIQUE INDEX `Funding_ID_UNIQUE` (`Funding_ID` ASC) VISIBLE,
  UNIQUE INDEX `Bank_Acc_No_UNIQUE` (`Bank_Acc_No` ASC) VISIBLE);



CREATE TABLE `stockacc_db`.`role_of_contact` (
  `Acc_ID` CHAR(4) NOT NULL,
  `C_Role` ENUM('Kin', 'Referee 1', 'Referee 2') NOT NULL,
  `Contact_ID` CHAR(5) NOT NULL,
  `C_Relationship` ENUM('Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Friend', 'Colleague', 'Mentor', 'Others') NULL,
  PRIMARY KEY (`Acc_ID`, `C_Role`, `Contact_ID`),
  UNIQUE INDEX `Acc_ID_UNIQUE` (`Acc_ID` ASC) VISIBLE,
  UNIQUE INDEX `Contact_ID_UNIQUE` (`Contact_ID` ASC) VISIBLE);


CREATE TABLE `stockacc_db`.`source_of_funding` (
  `Funding_ID` CHAR(7) NOT NULL,
  `Nature_of_Work` VARCHAR(50) NOT NULL,
  `Business/School_Name` VARCHAR(80) NULL,
  `Office/School_Address` VARCHAR(150) NULL,
  `Office/School_Number` VARCHAR(15) NULL,
  `Valid_ID` ENUM('Driver''s License', 'Passport', 'SSS ID', 'PhilHealth ID', 'Student ID', 'National ID', 'Others')
  `Source_of_Income` ENUM('Salary', 'Business', 'Remittance', 'Scholarship', 'Pension', 'Others') NULL,
  PRIMARY KEY (`Funding_ID`),
  UNIQUE INDEX `Funding_ID_UNIQUE` (`Funding_ID` ASC) VISIBLE);


ALTER TABLE `stockacc_db`.`personal_data` 
ADD CONSTRAINT `Funding_ID`
  FOREIGN KEY (`Funding_ID`)
  REFERENCES `stockacc_db`.`source_of_funding` (`Funding_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `Bank_Acc_No`
  FOREIGN KEY (`Bank_Acc_No`)
  REFERENCES `stockacc_db`.`bank_details` (`Bank_Acc_No`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;


ALTER TABLE `stockacc_db`.`role_of_contact` 
ADD CONSTRAINT `Acc_ID`
  FOREIGN KEY (`Acc_ID`)
  REFERENCES `stockacc_db`.`personal_data` (`Acc_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `Contact_ID`
  FOREIGN KEY (`Contact_ID`)
  REFERENCES `stockacc_db`.`contact_person_details` (`Contact_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `Acc_ID` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'active',
  PRIMARY KEY (`Acc_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bank_details`
--

DROP TABLE IF EXISTS `bank_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_details` (
  `Bank_Acc_No` varchar(19) NOT NULL,
  `Bank_Acc_Name` varchar(50) DEFAULT NULL,
  `Bank_Acc_Date_of_Opening` date DEFAULT NULL,
  `Bank_Name` varchar(50) DEFAULT NULL,
  `Branch` varchar(30) DEFAULT NULL,
  `Account_ID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`Bank_Acc_No`),
  UNIQUE KEY `Bank_Acc_No_UNIQUE` (`Bank_Acc_No`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_details`
--

LOCK TABLES `bank_details` WRITE;
/*!40000 ALTER TABLE `bank_details` DISABLE KEYS */;
INSERT INTO `bank_details` VALUES ('3782591890',NULL,NULL,'Landbank',NULL,'OK1W');
/*!40000 ALTER TABLE `bank_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_person_details`
--

DROP TABLE IF EXISTS `contact_person_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_person_details` (
  `Contact_ID` char(5) NOT NULL,
  `C_Name` varchar(50) DEFAULT NULL,
  `C_Address` varchar(150) DEFAULT NULL,
  `C_Postal_Code` char(5) DEFAULT NULL,
  `C_Email` varchar(60) DEFAULT NULL,
  `C_Contact_Number` varchar(45) NOT NULL,
  PRIMARY KEY (`Contact_ID`),
  UNIQUE KEY `Contact_ID_UNIQUE` (`Contact_ID`),
  UNIQUE KEY `C_Contact_Number_UNIQUE` (`C_Contact_Number`),
  UNIQUE KEY `C_Email_UNIQUE` (`C_Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_person_details`
--

LOCK TABLES `contact_person_details` WRITE;
/*!40000 ALTER TABLE `contact_person_details` DISABLE KEYS */;
INSERT INTO `contact_person_details` VALUES ('C0174',NULL,NULL,NULL,NULL,'09454135180'),('C5916',NULL,NULL,NULL,NULL,'09760630969'),('C6120',NULL,NULL,NULL,NULL,'09611198209');
/*!40000 ALTER TABLE `contact_person_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_data`
--

DROP TABLE IF EXISTS `personal_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_data` (
  `Acc_ID` char(4) NOT NULL,
  `P_Name` varchar(50) DEFAULT NULL,
  `P_Address` varchar(150) DEFAULT NULL,
  `P_Postal_Code` char(5) DEFAULT NULL,
  `P_Cell_Number` varchar(15) DEFAULT NULL,
  `P_Email` varchar(60) DEFAULT NULL,
  `Date_of_Birth` date DEFAULT NULL,
  `Employment_Status` enum('Employed','Self-Employed','Unemployed','Student','Retired') DEFAULT NULL,
  `Purpose_of_Opening` enum('Savings','Investment','Business','Personal Use','Others') DEFAULT NULL,
  `Funding_ID` char(7) NOT NULL,
  `Bank_Acc_No` varchar(45) NOT NULL,
  `P_Password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Acc_ID`),
  UNIQUE KEY `Acc_ID_UNIQUE` (`Acc_ID`),
  UNIQUE KEY `Funding_ID_UNIQUE` (`Funding_ID`),
  UNIQUE KEY `Bank_Acc_No_UNIQUE` (`Bank_Acc_No`),
  UNIQUE KEY `P_Cell_Number_UNIQUE` (`P_Cell_Number`),
  UNIQUE KEY `P_Email_UNIQUE` (`P_Email`),
  CONSTRAINT `Bank_Acc_No` FOREIGN KEY (`Bank_Acc_No`) REFERENCES `bank_details` (`Bank_Acc_No`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Funding_ID` FOREIGN KEY (`Funding_ID`) REFERENCES `source_of_funding` (`Funding_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_data`
--

LOCK TABLES `personal_data` WRITE;
/*!40000 ALTER TABLE `personal_data` DISABLE KEYS */;
INSERT INTO `personal_data` VALUES ('OK1W','Jireh Rabbi Bernardo',NULL,NULL,'',NULL,NULL,NULL,NULL,'FHSWT6N','3782591890','$2b$12$pzvBP2nIrSGpD.ZEC1vo4uUJdoRicPLbYmyuqt1aZNiByi.LiwgHa');
/*!40000 ALTER TABLE `personal_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_of_contact`
--

DROP TABLE IF EXISTS `role_of_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_of_contact` (
  `Acc_ID` char(4) NOT NULL,
  `C_Role` enum('Kin','Referee 1','Referee 2') NOT NULL,
  `Contact_ID` char(5) NOT NULL,
  `C_Relationship` enum('Father','Mother','Spouse','Son','Daughter','Friend','Colleague','Mentor','Others') DEFAULT NULL,
  PRIMARY KEY (`Acc_ID`,`C_Role`,`Contact_ID`),
  UNIQUE KEY `Acc_ID_UNIQUE` (`Acc_ID`),
  UNIQUE KEY `Contact_ID_UNIQUE` (`Contact_ID`),
  CONSTRAINT `Acc_ID` FOREIGN KEY (`Acc_ID`) REFERENCES `personal_data` (`Acc_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Contact_ID` FOREIGN KEY (`Contact_ID`) REFERENCES `contact_person_details` (`Contact_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_of_contact`
--

LOCK TABLES `role_of_contact` WRITE;
/*!40000 ALTER TABLE `role_of_contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_of_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `source_of_funding`
--

DROP TABLE IF EXISTS `source_of_funding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `source_of_funding` (
  `Funding_ID` char(7) NOT NULL,
  `Nature_of_Work` varchar(50) NOT NULL,
  `Business/School_Name` varchar(80) DEFAULT NULL,
  `Office/School_Address` varchar(150) DEFAULT NULL,
  `Office/School_Number` varchar(15) DEFAULT NULL,
  `Valid_ID` enum('Driver''s License','Passport','SSS ID','PhilHealth ID','Others') DEFAULT NULL,
  `Source_of_Income` enum('Salary','Business','Remittance','Scholarship','Pension','Others') DEFAULT NULL,
  PRIMARY KEY (`Funding_ID`),
  UNIQUE KEY `Funding_ID_UNIQUE` (`Funding_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `source_of_funding`
--

LOCK TABLES `source_of_funding` WRITE;
/*!40000 ALTER TABLE `source_of_funding` DISABLE KEYS */;
INSERT INTO `source_of_funding` VALUES ('FHSWT6N','Student','PUP Sta. Mesa','1016 Anonas, Sta. Mesa, City Of Manila, Kalakhang Maynila','(02) 5335 1787','Passport','Others');
/*!40000 ALTER TABLE `source_of_funding` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-10 12:12:18


