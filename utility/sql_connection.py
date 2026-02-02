import sqlalchemy
import pymssql

from core.config import Variable

def get_azure_engine():
    connection_url = sqlalchemy.engine.URL.create(
        drivername="mssql+pymssql",
        username=Variable.AZURE_SQL_USERNAME,
        password=Variable.AZURE_SQL_PASSWORD,
        host=Variable.AZURE_SQL_HOST,
        port=1433,
        database=Variable.SQL_DATABASE,
    )

    return sqlalchemy.create_engine(connection_url, echo=Variable.DEBUG)