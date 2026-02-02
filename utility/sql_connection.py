import sqlalchemy
import pyodbc
from urllib.parse import quote_plus


from core.config import Variable

def get_azure_engine():

    params = (
        f"DRIVER={Variable.AZURE_SQL_ODBC_DRIVER};"
        f"SERVER={Variable.AZURE_SQL_HOST};"
        f"DATABASE={Variable.SQL_DATABASE};"
        f"UID={Variable.AZURE_SQL_USERNAME};"
        f"PWD={Variable.AZURE_SQL_PASSWORD};"
        "Encrypt=yes;"
        "TrustServerCertificate=no;"
        "ConnectionTimeout=60;"
    )

    connection_url = f"mssql+pyodbc:///?odbc_connect={quote_plus(params)}"

    return sqlalchemy.create_engine(connection_url, echo=Variable.DEBUG)