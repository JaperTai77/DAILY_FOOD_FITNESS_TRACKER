import sqlalchemy as sa
from sqlalchemy import text

from utility.sql_connection import get_azure_engine
import sqlalchemy


class FoodCatelog:
    def __init__(self):
        self.engine = get_azure_engine()

    def add_food_product(self, name, brand, calories, protein, fat, sat_fat, sodium, carbs, sugar, added_sugar, serving_gram, description):
        sql_query = text("""
            INSERT INTO [dbo].[FoodProductDetail] 
            (ProductName, ProductBrand, Calories, Protein, Fat, SatFat, Sodium, Carbs, Sugar, AddedSugar, PerServingGram, Description)
            VALUES 
            (:name, :brand, :cal, :prot, :fat, :sat, :sod, :carb, :sug, :add_sug, :serv, :desc)
        """)
        data = {
            "name": name,
            "brand": brand,
            "cal": calories,
            "prot": protein,
            "fat": fat,
            "sat": sat_fat,
            "sod": sodium,
            "carb": carbs,
            "sug": sugar,
            "add_sug": added_sugar,
            "serv": serving_gram,
            "desc": description
        }
        try:
            with self.engine.connect() as conn:
                conn.execute(sql_query, data)
                conn.commit()
        except Exception as e:
            print(f"Failed to insert {name}: {e}")
    
    def search_food_product(self, name):
        sql_query = text("""
            SELECT TOP 15 * FROM [dbo].[FoodProductDetail]
            WHERE ProductName LIKE :name
        """)
        try:
            with self.engine.connect() as conn:
                result = conn.execute(sql_query, {"name": f"%{name}%"})
                return result.fetchall()
        except Exception as e:
            print(f"Failed to search for {name}: {e}")
            return []
        
    def search_food_product_by_id(self, id):
        sql_query = text("""
            SELECT TOP 15 * FROM [dbo].[FoodProductDetail]
            WHERE ProductID = :id
        """)
        try:
            with self.engine.connect() as conn:
                result = conn.execute(sql_query, {"id": id})
                return result.fetchall()
        except Exception as e:
            print(f"Failed to search for ID {id}: {e}")
            return []
        
    def search_all_food_products(self):
        sql_query = text("""
            SELECT * FROM [dbo].[FoodProductDetail]
        """)
        try:
            with self.engine.connect() as conn:
                result = conn.execute(sql_query)
                return result.fetchall()
        except Exception as e:
            print(f"Failed to retrieve food products: {e}")
            return []