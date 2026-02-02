from pydantic import BaseModel, Field
from datetime import datetime, date

from model.food import NutritionalBase

class DailyMealRecord(NutritionalBase):
    Datetime: datetime = Field(..., description="Date and time of the meal")
    ItemName: str = Field(..., description="Name of the meal item")
    ServingGrams: float = Field(..., description="Serving size in grams")

class DailyMealRecordFromFoodCatalog(BaseModel):
    Datetime: datetime = Field(..., description="Date and time of the meal")
    FoodID: int = Field(..., description="ID of the food item from the catalog")
    ServingGrams: float = Field(..., description="Serving size in grams")

class DailyMealRecordFromFoodCatalogServing(BaseModel):
    Datetime: datetime = Field(..., description="Date and time of the meal")
    FoodID: int = Field(..., description="ID of the food item from the catalog")
    Serving: float = Field(..., description="Number of servings")