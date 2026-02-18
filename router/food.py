from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from repository.food import FoodCatelog
from model.food import FoodProductDetail

router = APIRouter(
    prefix="/food",
    tags=["food"],
    responses={404: {"description": "Not found"}},
)

@router.post("/addfooditem")
async def add_food_item(data: FoodProductDetail):

    food_catalog = FoodCatelog()
    food_catalog.add_food_product(
        name=data.ProductName,
        brand=data.ProductBrand,
        calories=data.Calories,
        protein=data.Protein,
        fat=data.Fat,
        sat_fat=data.SatFat,
        sodium=data.Sodium,
        carbs=data.Carbs,
        sugar=data.Sugar,
        added_sugar=data.AddedSugar,
        serving_gram=data.PerServingGram,
        description=data.Description
    )
    return JSONResponse(content=jsonable_encoder({"message": f"Food item '{data.ProductName}' added successfully."}))

@router.get("/searchfooditem")
async def search_food_item(name: str):
    food_catalog = FoodCatelog()
    results = food_catalog.search_food_product(name=name.lower())
    food_items = [
        {
            "ProductName": row.ProductName,
            "ProductBrand": row.ProductBrand,
            "Calories": row.Calories,
            "Protein": row.Protein,
            "Fat": row.Fat,
            "SatFat": row.SatFat,
            "Sodium": row.Sodium,
            "Carbs": row.Carbs,
            "Sugar": row.Sugar,
            "AddedSugar": row.AddedSugar,
            "PerServingGram": row.PerServingGram,
            "Description": row.Description
        }
        for row in results
    ]
    return JSONResponse(content=jsonable_encoder({"results": food_items}))

@router.get("/searchfooditemID/{id}")
async def search_food_item_by_id(id: int):
    food_catalog = FoodCatelog()
    results = food_catalog.search_food_product_by_id(id=id)
    food_items = [
        {
            "ProductName": row.ProductName,
            "ProductBrand": row.ProductBrand,
            "Calories": row.Calories,
            "Protein": row.Protein,
            "Fat": row.Fat,
            "SatFat": row.SatFat,
            "Sodium": row.Sodium,
            "Carbs": row.Carbs,
            "Sugar": row.Sugar,
            "AddedSugar": row.AddedSugar,
            "PerServingGram": row.PerServingGram,
            "Description": row.Description
        }
        for row in results
    ]
    return JSONResponse(content=jsonable_encoder({"results": food_items}))

@router.get("/searchallfooditems")
async def search_all_food_items():
    food_catalog = FoodCatelog()
    results = food_catalog.search_all_food_products()
    food_items = [
        {
            "ProductID": row.ProductID,
            "ProductName": row.ProductName,
            "ProductBrand": row.ProductBrand,
            "Calories": row.Calories,
            "Protein": row.Protein,
            "Fat": row.Fat,
            "SatFat": row.SatFat,
            "Sodium": row.Sodium,
            "Carbs": row.Carbs,
            "Sugar": row.Sugar,
            "AddedSugar": row.AddedSugar,
            "PerServingGram": row.PerServingGram,
            "Description": row.Description
        }
        for row in results
    ]
    return JSONResponse(content=jsonable_encoder({"results": food_items}))