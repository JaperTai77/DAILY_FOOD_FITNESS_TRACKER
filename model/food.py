from pydantic import BaseModel, Field

class NutritionalBase(BaseModel):
    Calories: float = Field(..., description="Calories in the food product")
    Protein: float = Field(..., description="Protein content in grams")
    Fat: float = Field(..., description="Fat content in grams")
    SatFat: float = Field(..., description="Sat fat content in grams")
    Sodium: float = Field(..., description="Sodium content in milligrams")
    Carbs: float = Field(..., description="Carbohydrate content in grams")
    Sugar: float = Field(..., description="Sugar content in grams")
    AddedSugar: float = Field(..., description="Added sugar content in grams")
    Description: str = Field(..., description="Description of the food product")

class FoodProductDetail(NutritionalBase):
    ProductName: str = Field(..., description="Name of the food product")
    ProductBrand: str = Field(..., description="Brand of the food product")
    PerServingGram: float = Field(..., description="Serving size in grams")