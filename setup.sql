CREATE TABLE Users (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, userId TEXT, displayName VARCHAR(30), accessToken TEXT, googleId TEXT, iconUrl TEXT, init BOOLEAN, createdAt DATETIME, updatedAt DATETIME);

CREATE TABLE Cards (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, masterId BIGINT, ownerUserId BIGINT, point INT DEFAULT 0, description TEXT, createdAt DATETIME, updatedAt DATETIME);

CREATE TABLE CardMasters (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, style TEXT, ownerUserId BIGINT, showInList BOOLEAN, regByURL BOOLEAN, regToken TEXT, userToUserPointOpt BOOLEAN, displayName TEXT, logo TEXT, logoType TEXT, primaryColor TEXT, backgroundColor TEXT, textColor TEXT, createdAt DATETIME, updatedAt DATETIME);

CREATE TABLE PointOpReq (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, token TEXT, masterId INT, operatorUserId INT, opType CHAR, value INT, createdAt DATETIME, updatedAt DATETIME);