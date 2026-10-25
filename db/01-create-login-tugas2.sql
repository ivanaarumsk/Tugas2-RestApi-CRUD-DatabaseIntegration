-- Login KHUSUS untuk Tugas 2 (beda dari praktikum_user di hands-on),
-- supaya kredensial tugas & praktikum tidak tercampur.
USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = 'ivana')
BEGIN
    CREATE LOGIN ivana
        WITH PASSWORD = N'Ivana_Tugas2026!',
             DEFAULT_DATABASE = review_kantin;
END
GO

USE review_kantin;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'ivana')
BEGIN
    CREATE USER ivana FOR LOGIN ivana;
END
GO

ALTER ROLE db_datareader ADD MEMBER ivana;
ALTER ROLE db_datawriter ADD MEMBER ivana;
GO

SELECT name, type_desc, authentication_type_desc
FROM sys.database_principals
WHERE name = 'ivana';
GO
