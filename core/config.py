import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    AZURE_SQL_HOST: str = os.getenv("AZURE_SQL_HOST", ".")
    AZURE_SQL_USERNAME: str = os.getenv("AZURE_SQL_USERNAME")
    AZURE_SQL_PASSWORD: str = os.getenv("AZURE_SQL_PASSWORD")
    AZURE_SQL_ODBC_DRIVER: str = os.getenv("AZURE_SQL_ODBC_DRIVER", "ODBC Driver 18 for SQL Server")
    SQL_DATABASE: str = os.getenv("SQL_DATABASE")
    DEBUG: bool = os.getenv("debug", "False").lower() in ("true", "1", "t")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

Variable = Settings()