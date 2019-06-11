--
-- Table structure for table LOGIN
--
DROP TABLE IF EXISTS LOGINS;
CREATE TABLE LOGINS (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    EMAIL varchar(254) NOT NULL,
    IS_ACTIVE int(11) NOT NULL DEFAULT 0,
    PREFERRED_NAME varchar(1024) NOT NULL,
    PASSWORD varchar(1024) NOT NULL,
    SESSION varchar(254) NOT NULL,
    PRIMARY KEY (ID),
    KEY IDX_EMAIL (EMAIL),
    KEY IDX_SESSION (SESSION)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--  What password encoder did I use?
 
INSERT INTO LOGINS (EMAIL, IS_ACTIVE, PREFERRED_NAME, PASSWORD, SESSION) 
VALUES ( 'paul@armsign.com.au', 1, 'Paul Dunn', 'f450ca5fcb9b2333b38dd230ddae0b300', '');

--
-- Table structure for table DEPOSITS
--
DROP TABLE IF EXISTS DEPOSITS;
CREATE TABLE DEPOSITS (
  ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  PROMPT_ID bigint(20) UNSIGNED ZEROFILL DEFAULT 0,
  TITLE varchar(1024) NOT NULL DEFAULT '',
  VISITOR_ID varchar(256) NOT NULL DEFAULT '', --  IS THIS THE EMAIL ... SO. HMM. IF THE DEPOSIT EXISTS ... 
  STORED_BY varchar(2048) NOT NULL DEFAULT '', --  IS THIS THE EMAIL ... SO. HMM. IF THE DEPOSIT EXISTS ... 
  STORED_AS varchar(2048) NOT NULL DEFAULT '', --  NOM DE PLUM
  STORED_AT varchar(2048) NOT NULL DEFAULT '', --  THIS IS THE FILE LOCATION IF NECESSARY
  STORED_ON datetime NOT NULL DEFAULT NOW(),
  AUDIO_TYPE varchar(1024) NOT NULL DEFAULT '',
  AUDIO_LENGTH bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  IS_PLAYABLE int(11) NOT NULL DEFAULT 0,
  IS_TRANSCRIBED int(11) NOT NULL DEFAULT 0,
  TRANSCRIPTION MEDIUMTEXT DEFAULT '',
  CHARACTER_DESIGN varchar(1024) DEFAULT '',
  HAS_CONSENT int(11) NOT NULL DEFAULT 0,
  USE_EMAIL int(11) NOT NULL DEFAULT 0,
  REVIEWED_BY bigint(20) NOT NULL DEFAULT 0,
  REVIEWED_ON datetime NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ID),
  KEY IDX_PROMPT_ID (PROMPT_ID),
  KEY IDX_STORED_ON (STORED_ON),
  KEY IDX_STORED_BY (STORED_BY),
  KEY IDX_VISITOR_ID (VISITOR_ID),
  KEY IDX_IS_TRANSCRIBED (IS_TRANSCRIBED),
  KEY IDX_IS_PLAYABLE (IS_PLAYABLE),
  KEY IDX_REVIEWED_BY (REVIEWED_BY)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS DEPOSITS_ARCHIVE;
CREATE TABLE DEPOSITS_ARCHIVE (
  ID bigint(20) UNSIGNED ZEROFILL,
  PROMPT_ID bigint(20) UNSIGNED ZEROFILL DEFAULT 0,
  TITLE varchar(1024) NOT NULL DEFAULT '',
  VISITOR_ID varchar(256) NOT NULL DEFAULT '', --  IS THIS THE EMAIL ... SO. HMM. IF THE DEPOSIT EXISTS ... 
  STORED_BY varchar(2048) NOT NULL DEFAULT '', --  IS THIS THE EMAIL ... SO. HMM. IF THE DEPOSIT EXISTS ... 
  STORED_AS varchar(2048) NOT NULL DEFAULT '', --  NOM DE PLUM
  STORED_AT varchar(2048) NOT NULL DEFAULT '', --  THIS IS THE FILE LOCATION IF NECESSARY
  STORED_ON datetime NOT NULL DEFAULT NOW(),
  AUDIO_TYPE varchar(1024) NOT NULL DEFAULT '',
  AUDIO_LENGTH bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  IS_PLAYABLE int(11) NOT NULL DEFAULT 0,
  IS_TRANSCRIBED int(11) NOT NULL DEFAULT 0,
  TRANSCRIPTION MEDIUMTEXT DEFAULT '',
  CHARACTER_DESIGN varchar(1024) DEFAULT '',
  HAS_CONSENT int(11) NOT NULL DEFAULT 0,
  USE_EMAIL int(11) NOT NULL DEFAULT 0,
  REVIEWED_BY bigint(20) NOT NULL DEFAULT 0,
  REVIEWED_ON datetime NOT NULL DEFAULT NOW(),
  KEY IDX_PROMPT_ID (PROMPT_ID),
  KEY IDX_STORED_ON (STORED_ON),
  KEY IDX_STORED_BY (STORED_BY),
  KEY IDX_VISITOR_ID (VISITOR_ID),
  KEY IDX_IS_TRANSCRIBED (IS_TRANSCRIBED),
  KEY IDX_IS_PLAYABLE (IS_PLAYABLE),
  KEY IDX_REVIEWED_BY (REVIEWED_BY)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table DEPOSIT_METRIC
--
DROP TABLE IF EXISTS DEPOSIT_FLAGS;
CREATE TABLE DEPOSIT_FLAGS (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    DEPOSIT bigint(20) UNSIGNED ZEROFILL NOT NULL, 
    FLAGGED_BY varchar(2048) NOT NULL,
    FLAGGED_ON datetime NOT NULL,
    REASON varchar(2048) DEFAULT NULL,
    REVIEWED_BY BIGINT NOT NULL DEFAULT '0',
    REVIEWED_ON datetime NOT NULL,
    OUTCOME varchar(2048) DEFAULT NULL,
    IS_INAPPROPRIATE INT(11) NOT NULL DEFAULT '1',
    PRIMARY KEY (ID),
    KEY IDX_DEPOSIT (DEPOSIT),
    KEY IDX_FLAGGED_ON (FLAGGED_ON),
    KEY IDX_IS_INAPPROPRIATE (IS_INAPPROPRIATE) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table DEPOSIT_METRIC
--
DROP TABLE IF EXISTS DEPOSIT_METRICS;
CREATE TABLE DEPOSIT_METRICS (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    DEPOSIT bigint(20) UNSIGNED ZEROFILL NOT NULL,
    LOVED_BY varchar(2048) NOT NULL DEFAULT '', 
    LOVED_ON datetime NOT NULL,
    PRIMARY KEY (ID),
    KEY IDX_DEPOSIT (DEPOSIT),
    KEY IDX_PLAYED_ON (LOVED_BY)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table DEPOSIT_TAGS
--
DROP TABLE IF EXISTS DEPOSIT_TAGS;
CREATE TABLE DEPOSIT_TAGS (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    DEPOSIT bigint(20) NOT NULL,
    TAG bigint(20) NOT NULL,
    PRIMARY KEY (ID),
    KEY IDX_DEPOSIT (DEPOSIT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table DEPOSIT_COMMENTS
--
DROP TABLE IF EXISTS DEPOSIT_COMMENTS;
CREATE TABLE DEPOSIT_FLAGS (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    DEPOSIT bigint(20) UNSIGNED ZEROFILL NOT NULL, 
    COMMENT_BY varchar(2048) NOT NULL,
    COMMENT_ON datetime NOT NULL,
    COMMENT varchar(2048) DEFAULT NULL,
    REVIEWED_BY BIGINT NOT NULL DEFAULT '0',
    REVIEWED_ON datetime NOT NULL,
    IS_INAPPROPRIATE INT(11) NOT NULL DEFAULT '1',
    PRIMARY KEY (ID),
    KEY IDX_DEPOSIT (DEPOSIT),
    KEY IDX_FLAGGED_ON (COMMENT_ON),
    KEY IDX_IS_INAPPROPRIATE (IS_INAPPROPRIATE) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table TAGS
--
DROP TABLE IF EXISTS TAGS;
CREATE TABLE TAGS (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
    TITLE varchar(1024) NOT NULL,
    DESCRIPTION varchar(2048) NOT NULL,
    IS_INAPPROPRIATE INT(11) NOT NULL DEFAULT '0',
    PRIMARY KEY (ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table TAGS
--

INSERT INTO TAGS (ID, TITLE, DESCRIPTION) VALUES
(1, 'PL Travers', 'This content mentions PL Travers directly');

DROP TABLE IF EXISTS PRINT_REQUEST;
CREATE TABLE PRINT_REQUEST (
    ID bigint(20) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, 
    VISITOR_ID varchar(256) NOT NULL DEFAULT '', --  IS THIS THE EMAIL ... SO. HMM. IF THE DEPOSIT EXISTS ... 
    PRINTED_ON datetime NOT NULL DEFAULT NOW(),
    PRIMARY KEY (ID),
    KEY IDX_VISITOR_ID (VISITOR_ID),
    KEY IDX_REVIEWED_BY (PRINTED_ON)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*

SELECT 	a.name, a.account_type, a.industry, c.last_name, c.first_name, c.title, c.primary_address_state, ea.email_address, parent.name AS MemberOf
FROM 	accounts a
JOIN	accounts_contacts ac ON a.id = ac.account_id AND ac.deleted = 0
JOIN	contacts c ON ac.contact_id = c.id AND c.deleted = 0
JOIN 	email_addr_bean_rel eb ON ac.contact_id = eb.bean_id
JOIN	email_addresses ea ON eb.email_address_id = ea.id
LEFT 	JOIN accounts parent ON a.parent_id = parent.id
WHERE	a.deleted = 0 

mysql --user=vaultAdmin --password=Q2QBL5BQDKB85KNG StoryVault

mysql --user=vaultAdmin --password=Q2QBL5BQDKB85KNG StoryVault < "call Archive_Deposits();"

--execute="CALL Archive_Deposits();"

*/
