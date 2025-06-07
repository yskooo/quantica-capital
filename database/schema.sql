
-- Stock Account Management System Database Schema
-- MySQL 8.0+ Compatible

CREATE SCHEMA IF NOT EXISTS `stockacc_db`;
USE `stockacc_db`;

-- Table: bank_details
CREATE TABLE `bank_details` (
  `Bank_Acc_No` VARCHAR(19) NOT NULL,
  `Bank_Acc_Name` VARCHAR(50) NULL,
  `Bank_Acc_Date_of_Opening` DATE NULL,
  `Bank_Name` VARCHAR(50) NULL,
  `Branch` VARCHAR(30) NULL,
  PRIMARY KEY (`Bank_Acc_No`),
  UNIQUE INDEX `Bank_Acc_No_UNIQUE` (`Bank_Acc_No` ASC) VISIBLE
);

-- Table: contact_person_details
CREATE TABLE `contact_person_details` (
  `Contact_ID` CHAR(5) NOT NULL,
  `C_Name` VARCHAR(50) NULL,
  `C_Address` VARCHAR(150) NULL,
  `C_Postal_Code` CHAR(5) NULL,
  `C_Email` VARCHAR(60) NULL,
  `C_Contact_Number` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Contact_ID`),
  UNIQUE INDEX `Contact_ID_UNIQUE` (`Contact_ID` ASC) VISIBLE,
  UNIQUE INDEX `C_Email_UNIQUE` (`C_Email` ASC) VISIBLE,
  UNIQUE INDEX `C_Contact_Number_UNIQUE` (`C_Contact_Number` ASC) VISIBLE
);

-- Table: source_of_funding
CREATE TABLE `source_of_funding` (
  `Funding_ID` CHAR(7) NOT NULL,
  `Nature_of_Work` VARCHAR(50) NOT NULL,
  `Business/School_Name` VARCHAR(80) NULL,
  `Office/School_Address` VARCHAR(150) NULL,
  `Office/School_Number` VARCHAR(15) NULL,
  `Valid_ID` ENUM("Driver's License", "Passport", "SSS ID", "PhilHealth ID", "Student ID", "National ID", "Others") NULL,
  `Source_of_Income` ENUM("Salary", "Business", "Remittance", "Scholarship", "Pension", "Others") NULL,
  PRIMARY KEY (`Funding_ID`),
  UNIQUE INDEX `Funding_ID_UNIQUE` (`Funding_ID` ASC) VISIBLE
);

-- Table: personal_data (now includes credentials)
CREATE TABLE `personal_data` (
  `Acc_ID` CHAR(4) NOT NULL,
  `P_Name` VARCHAR(50) NULL,
  `P_Address` VARCHAR(150) NULL,
  `P_Postal_Code` CHAR(5) NULL,
  `P_Cell_Number` BIGINT NOT NULL,
  `P_Email` VARCHAR(60) NULL,
  `P_Password` VARCHAR(255) NULL,
  `Date_of_Birth` DATE NULL,
  `Employment_Status` ENUM('Employed', 'Self-Employed', 'Unemployed', 'Student', 'Retired') NULL,
  `Purpose_of_Opening` ENUM('Savings', 'Investment', 'Business', 'Personal Use', 'Retirement', 'Others') NULL,
  `Funding_ID` CHAR(7) NOT NULL,
  `Bank_Acc_No` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Acc_ID`),
  UNIQUE INDEX `Acc_ID_UNIQUE` (`Acc_ID` ASC) VISIBLE,
  UNIQUE INDEX `P_Cell_Number_UNIQUE` (`P_Cell_Number` ASC) VISIBLE,
  UNIQUE INDEX `P_Email_UNIQUE` (`P_Email` ASC) VISIBLE,
  UNIQUE INDEX `Funding_ID_UNIQUE` (`Funding_ID` ASC) VISIBLE,
  UNIQUE INDEX `Bank_Acc_No_UNIQUE` (`Bank_Acc_No` ASC) VISIBLE
);

-- Table: role_of_contact
CREATE TABLE `role_of_contact` (
  `Acc_ID` CHAR(4) NOT NULL,
  `C_Role` ENUM('Kin', 'Referee 1', 'Referee 2') NOT NULL,
  `Contact_ID` CHAR(5) NOT NULL,
  `C_Relationship` ENUM('Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Friend', 'Colleague', 'Mentor', 'Others') NULL,
  PRIMARY KEY (`Acc_ID`, `C_Role`, `Contact_ID`),
  INDEX `Contact_ID_idx` (`Contact_ID` ASC) VISIBLE
);

-- Foreign Key Constraints
ALTER TABLE `personal_data` 
ADD CONSTRAINT `fk_source_of_funding_funding_id`
  FOREIGN KEY (`Funding_ID`)
  REFERENCES `source_of_funding` (`Funding_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `fk_bank_details_bank_acc_no`
  FOREIGN KEY (`Bank_Acc_No`)
  REFERENCES `bank_details` (`Bank_Acc_No`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE `role_of_contact` 
ADD CONSTRAINT `fk_personal_data_acc_id`
  FOREIGN KEY (`Acc_ID`)
  REFERENCES `personal_data` (`Acc_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `fk_contact_person_contact_id`
  FOREIGN KEY (`Contact_ID`)
  REFERENCES `contact_person_details` (`Contact_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

-- Add P_Password column if it doesn't exist (for existing databases)
ALTER TABLE `personal_data` 
ADD COLUMN IF NOT EXISTS `P_Password` VARCHAR(255) NULL AFTER `P_Email`;

-- Insert some sample bank data for testing
INSERT INTO `bank_details` (`Bank_Acc_No`, `Bank_Acc_Name`, `Bank_Acc_Date_of_Opening`, `Bank_Name`, `Branch`) VALUES
('1234567890123456789', 'John Doe', '2023-01-15', 'Chase Bank', 'Main Street Branch'),
('9876543210987654321', 'Jane Smith', '2023-02-20', 'Wells Fargo', 'Downtown Branch'),
('1111222233334444555', 'Bob Johnson', '2023-03-10', 'Bank of America', 'Uptown Branch')
ON DUPLICATE KEY UPDATE Bank_Acc_Name = VALUES(Bank_Acc_Name);
