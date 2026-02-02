from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from router import food, daily_meal
from core.config import Variable

app = FastAPI(
    title="Daily Food and Fitness Tracker API",
    description="API for tracking daily food intake and fitness activities.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    # allow_origins=[Variable.FRONTEND_URL],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(food.router, responses={404: {"description": "Not found"}})
app.include_router(daily_meal.router, responses={404: {"description": "Not found"}})

@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Status</title>
        <style>
            body {
                background-color: #121212;
                color: #E0F7FA;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                text-align: center;
            }
            .status-container {
                padding: 2rem;
                border-radius: 8px;
                background-color: rgba(255, 255, 255, 0.05);
            }
            h1 {
                color: #A5D6A7;
                margin-bottom: 0.5rem;
            }
            .status {
                font-size: 1.5rem;
                font-weight: bold;
                color: #CE93D8;
            }
        </style>
    </head>
    <body>
        <div class="status-container">
            <h1>Service Status</h1>
            <p class="status">All systems operational</p>
            <p>Last checked: <span id="timestamp"></span></p>
            <p><a href="/docs" style="color:#81D4FA;text-decoration:underline;">API Documentation</a></p>
        </div>

        <script>
            document.getElementById('timestamp').textContent = new Date().toLocaleString();
        </script>
    </body>
    </html>
    """