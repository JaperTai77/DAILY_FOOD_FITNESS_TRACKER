# Daily Food & Fitness Tracker

A app to track your daily meals and view nutrition totals.

- **Backend**: FastAPI (connects to Azure SQL / MS SQL)
- **Frontend**: HTML / CSS / JavaScript (`web/` folder)

---

## Features

- Add a custom meal
- Add a meal item from the Food Catalog
- View daily nutrition summary 
- View meals for a date (and download as CSV)
- Manage Food Catalog
- OpenAPI docs at **`/docs`**

---

## File Structure

```text
.
├── main.py                 # FastAPI app main file
├── core/                   # App config (env variables)
├── utility/                # Shared helpers (SQL connection)
├── model/                  # Pydantic request models
├── repository/             # Database SQL queries
├── router/                 # API routes
├── web/                    # Frontend
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── nutrition-goals.js
│   └── config.js           # Backend URL
├── .env.sample             # Example env file
├── requirements.txt        # Python dependencies
└── pyproject.toml
```

---

## Getting Started

### SQL Database (Azure)

Create a Azure SQL database. Refer to [link](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-offer?view=azuresql).

Run following query to create required tables.
```sql
CREATE TABLE [dbo].[FoodProductDetail](
	[ProductID] [int] IDENTITY(1,1) NOT NULL,
	[ProductName] [nvarchar](100) NULL,
	[ProductBrand] [nvarchar](20) NULL,
	[Calories] [decimal](18, 2) NULL,
	[Protein] [decimal](18, 2) NULL,
	[Fat] [decimal](18, 2) NULL,
	[SatFat] [decimal](18, 2) NULL,
	[Sodium] [decimal](18, 2) NULL,
	[Carbs] [decimal](18, 2) NULL,
	[Sugar] [decimal](18, 2) NULL,
	[AddedSugar] [decimal](18, 2) NULL,
	[LoadDate] [datetime2](7) NULL,
	[PerServingGram] [int] NULL,
	[Description] [nvarchar](100) NULL,
 CONSTRAINT [PK_FoodProductDetail] PRIMARY KEY CLUSTERED ([ProductID] ASC)
);


CREATE TABLE [dbo].[DailyMealItem](
	[MealDateTime] [date] NOT NULL,
	[ItemName] [nvarchar](100) NULL,
	[ServingGrams] [decimal](18, 2) NULL,
	[Calories] [decimal](18, 2) NULL,
	[Protein] [decimal](18, 2) NULL,
	[Fat] [decimal](18, 2) NULL,
	[SatFat] [decimal](18, 2) NULL,
	[Sodium] [decimal](18, 2) NULL,
	[Carbs] [decimal](18, 2) NULL,
	[Sugar] [decimal](18, 2) NULL,
	[AddedSugar] [decimal](18, 2) NULL,
	[Description] [nvarchar](100) NULL
);

```

### Backend (FastAPI)

#### Prerequisites

- Python **3.14+**
- Access to an **Azure SQL / MS SQL** database

#### Setup (copy/paste)

```bash
# Create a virtual environment
python -m venv .venv

# Activate env (macOS / Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.sample .env
```

#### Configure environment variables

Open `.env` and set your values:

```env
debug=False

AZURE_SQL_HOST=...
AZURE_SQL_USERNAME=...
AZURE_SQL_PASSWORD=...
SQL_DATABASE=...

FRONTEND_URL=http://localhost:3000
```

#### Run the backend server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8082
```

Available at:

- API status page: `http://localhost:8082/`
- API docs (Swagger): `http://localhost:8082/docs`

---

### Frontend (Static Web)

```bash
# In a NEW terminal
cd web
python -m http.server 3000
```

Available at:

- `http://localhost:3000`

---

## API Endpoints

Base URL (local): `http://localhost:8082`

### Food Catalog

| Method | Path | Description |
|---|---|---|
| POST | `/food/addfooditem` | Add a new food item to the catalog |
| GET | `/food/searchfooditem?name={foodname}` | Search food items by name (top 15) |
| GET | `/food/searchfooditemID/{id}` | Search food item by ID |
| GET | `/food/searchallfooditems` | Get all food items |


### Daily Meal

| Method | Path | Description |
|---|---|---|
| POST | `/dailymeal/adddailymeal` | Add a custom meal item |
| POST | `/dailymeal/addmealitemfromfoodcatalog` | Add meal item from Food Catalog (by grams) |
| POST | `/dailymeal/addmealitemfromfoodcatalogperserving` | Add meal item from Food Catalog (by servings) |
| GET | `/dailymeal/calculatedailynutrition/{date}` | Get nutrition total for a date (`YYYY-MM-DD`) |
| GET | `/dailymeal/getmealsbydate/{date}` | Get all meals for a date (`YYYY-MM-DD`) |