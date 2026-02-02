from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import datetime

from repository.daily_meal import DailyMealRepository
from model.daily_meal import DailyMealRecord, DailyMealRecordFromFoodCatalog, DailyMealRecordFromFoodCatalogServing

router = APIRouter(
    prefix="/dailymeal",
    tags=["dailymeal"],
    responses={404: {"description": "Not found"}},
)

@router.post("/adddailymeal")
async def add_daily_meal(data: DailyMealRecord):
    daily_meal = DailyMealRepository()
    daily_meal.add_daily_meal(
        meal_datetime=data.Datetime,
        item_name=data.ItemName,
        serving_grams=data.ServingGrams,
        calories=data.Calories,
        protein=data.Protein,
        fat=data.Fat,
        sat_fat=data.SatFat,
        sodium=data.Sodium,
        carbs=data.Carbs,
        sugar=data.Sugar,
        added_sugar=data.AddedSugar,
        description=data.Description
    )
    return JSONResponse(content=jsonable_encoder({"message": f"'{data.ItemName}' added successfully."}))

@router.post("/addmealitemfromfoodcatalog")
async def add_meal_item_from_food_catalog(data: DailyMealRecordFromFoodCatalog):
    daily_meal = DailyMealRepository()
    daily_meal.add_meal_item_from_food_catalog(
        meal_datetime=data.Datetime,
        food_id=data.FoodID,
        serving_grams=data.ServingGrams
    )
    return JSONResponse(content=jsonable_encoder({"message": f"Meal item from food ID '{data.FoodID}' added successfully."}))

@router.post("/addmealitemfromfoodcatalogperserving")
async def add_meal_item_from_food_catalog_per_serving(data: DailyMealRecordFromFoodCatalogServing):
    daily_meal = DailyMealRepository()
    daily_meal.add_meal_item_from_food_catelog_serving(
        meal_datetime=data.Datetime,
        food_id=data.FoodID,
        num_serving=data.Serving
    )
    return JSONResponse(content=jsonable_encoder({"message": f"Meal item from food ID '{data.FoodID}' (per serving) added successfully."}))

@router.get("/calculatedailynutrition/{date}")
async def calculate_daily_nutrition(date: datetime.date):
    daily_meal = DailyMealRepository()
    nutrition_summary = daily_meal.calulate_daily_nutrition(meal_date=date)
    return JSONResponse(content=jsonable_encoder({"nutrition_summary": nutrition_summary}))