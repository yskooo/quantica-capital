
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
  `P_Password` VARCHAR(255) NULL,
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
  INDEX `Contact_ID_FK_idx` (`Contact_ID` ASC) VISIBLE,
  CONSTRAINT `Acc_ID_FK`
    FOREIGN KEY (`Acc_ID`)
    REFERENCES `stockacc_db`.`personal_data` (`Acc_ID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `Contact_ID_FK`
    FOREIGN KEY (`Contact_ID`)
    REFERENCES `stockacc_db`.`contact_person_details` (`Contact_ID`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);


CREATE TABLE `stockacc_db`.`source_of_funding` (
  `Funding_ID` CHAR(7) NOT NULL,
  `Nature_of_Work` VARCHAR(50) NOT NULL,
  `Business/School_Name` VARCHAR(80) NULL,
  `Office/School_Address` VARCHAR(150) NULL,
  `Office/School_Number` VARCHAR(15) NULL,
  `Valid_ID` ENUM('Driver''s License', 'Passport', 'SSS ID', 'PhilHealth ID', 'Student ID', 'National ID', 'Others') NULL,
  `Source_of_Income` ENUM('Salary', 'Business', 'Remittance', 'Scholarship', 'Pension', 'Others') NULL,
  PRIMARY KEY (`Funding_ID`),
  UNIQUE INDEX `Funding_ID_UNIQUE` (`Funding_ID` ASC) VISIBLE);


ALTER TABLE `stockacc_db`.`personal_data` 
ADD CONSTRAINT `Funding_ID_FK`
  FOREIGN KEY (`Funding_ID`)
  REFERENCES `stockacc_db`.`source_of_funding` (`Funding_ID`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `Bank_Acc_No_FK`
  FOREIGN KEY (`Bank_Acc_No`)
  REFERENCES `stockacc_db`.`bank_details` (`Bank_Acc_No`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
