import sqlalchemy as sa
from sqlalchemy import text
import decimal

from utility.sql_connection import get_azure_engine
import sqlalchemy

class DailyMealRepository:
    def __init__(self):
        self.engine = get_azure_engine()

    def add_daily_meal(self, meal_datetime, item_name, serving_grams, calories, protein, fat, sat_fat, sodium, carbs, sugar, added_sugar, description):
        sql_query = text("""
            INSERT INTO [dbo].[DailyMealItem]
            (MealDateTime, ItemName, ServingGrams, Calories, Protein, Fat, SatFat, Sodium, Carbs, Sugar, AddedSugar, Description)
            VALUES 
            (:dt, :name, :grams, :cal, :prot, :fat, :sat, :sod, :carb, :sug, :add_sug, :desc)
        """)
        data = {
            "dt": meal_datetime,
            "name": item_name,
            "grams": serving_grams,
            "cal": calories,
            "prot": protein,
            "fat": fat,
            "sat": sat_fat,
            "sod": sodium,
            "carb": carbs,
            "sug": sugar,
            "add_sug": added_sugar,
            "desc": description
        }
        try:
            with self.engine.connect() as conn:
                conn.execute(sql_query, data)
                conn.commit()
        except Exception as e:
            print(f"Failed to insert meal: {e}")

    def add_meal_item_from_food_catalog(self, meal_datetime, food_id, serving_grams):
        sql_query = text("""
            INSERT INTO [dbo].[DailyMealItem]
            (MealDateTime, ItemName, ServingGrams, Calories, Protein, Fat, SatFat, Sodium, Carbs, Sugar, AddedSugar, Description)
            SELECT 
                :datetime,
                f.ProductName,
                :grams,
                (f.Calories * :grams) / f.PerServingGram,
                (f.Protein * :grams) / f.PerServingGram,
                (f.Fat * :grams) / f.PerServingGram,
                (f.SatFat * :grams) / f.PerServingGram,
                (f.Sodium * :grams) / f.PerServingGram,
                (f.Carbs * :grams) / f.PerServingGram,
                (f.Sugar * :grams) / f.PerServingGram,
                (f.AddedSugar * :grams) / f.PerServingGram,
                f.Description
            FROM [dbo].[FoodProductDetail] f
            WHERE f.ProductID = :food_id
        """)
        data = {
            "datetime": meal_datetime,
            "grams": serving_grams,
            "food_id": food_id
        }
        try:
            with self.engine.connect() as conn:
                conn.execute(sql_query, data)
                conn.commit()
        except Exception as e:
            print(f"Failed to insert meal: {e}")

    def add_meal_item_from_food_catelog_serving(self, meal_datetime, food_id, num_serving):
        sql_query = text("""
            INSERT INTO [dbo].[DailyMealItem]
            (MealDateTime, ItemName, ServingGrams, Calories, Protein, Fat, SatFat, Sodium, Carbs, Sugar, AddedSugar, Description)
            SELECT
                :datetime,
                f.ProductName,
                (f.PerServingGram * :num_serving),
                (f.Calories * :num_serving),
                (f.Protein * :num_serving),
                (f.Fat * :num_serving),
                (f.SatFat * :num_serving),
                (f.Sodium * :num_serving),
                (f.Carbs * :num_serving),
                (f.Sugar * :num_serving),
                (f.AddedSugar * :num_serving),
                f.Description
            FROM [dbo].[FoodProductDetail] f
            WHERE f.ProductID = :food_id
        """)
        data = {
            "datetime": meal_datetime,
            "num_serving": num_serving,
            "food_id": food_id
        }
        try:
            with self.engine.connect() as conn:
                conn.execute(sql_query, data)
                conn.commit()
        except Exception as e:
            print(f"Failed to insert meal: {e}")

    def calulate_daily_nutrition(self, meal_date) -> dict:
        sql_query = text("""
            SELECT 
                SUM(Calories) AS TotalCalories,
                SUM(Protein) AS TotalProtein,
                SUM(Fat) AS TotalFat,
                SUM(SatFat) AS TotalSatFat,
                SUM(Sodium) AS TotalSodium,
                SUM(Carbs) AS TotalCarbs,
                SUM(Sugar) AS TotalSugar,
                SUM(AddedSugar) AS TotalAddedSugar
            FROM [dbo].[DailyMealItem]
            WHERE CAST(MealDateTime AS DATE) = :meal_date
        """)
        try:
            with self.engine.connect() as conn:
                result = conn.execute(sql_query, {"meal_date": meal_date})
                row = result.fetchone()
                
                if row is None:
                    return {}
                data = dict(row._mapping)
                for k, v in data.items():
                    if isinstance(v, decimal.Decimal):
                        data[k] = float(v)
                return data
        except Exception as e:
            print(f"Failed to calculate daily nutrition for {meal_date}: {e}")
            return None