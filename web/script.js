// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').textContent = dateTimeString;
}

// Global variable to track selected nutrition goal
let selectedNutritionGoal = 'RESTDAY';
let currentNutritionGoal = NUTRITION_GOALS_RESTDAY;
// Last fetched meals for fitness tab (used for CSV export)
let lastFetchedMeals = [];
// Track if runs are added
let runNutritionGoalsAdded = false;

// Select nutrition goal
function selectNutritionGoal(goalType, btn) {
    selectedNutritionGoal = goalType;

    // Update the current nutrition goal based on selection
    switch(goalType) {
        case 'RESTDAY':
            currentNutritionGoal = NUTRITION_GOALS_RESTDAY;
            break;
        case 'LEGDAY':
            currentNutritionGoal = NUTRITION_GOALS_LEGDAY;
            break;
        case 'UPPERBODYDAY':
            currentNutritionGoal = NUTRITION_GOALS_UPPERBODYDAY;
            break;
        case 'UPPERBODYINTENSEDAY':
            currentNutritionGoal = NUTRITION_GOALS_UPPERBODYINTENSEDAY;
            break;
        case 'RUNNINGDAY':
            currentNutritionGoal = NUTRITION_GOALS_RUNNINGDAY;
            break;
        default:
            currentNutritionGoal = NUTRITION_GOALS_RESTDAY;
    }

    // Reset run nutrition goals when switching
    if (runNutritionGoalsAdded) {
        runNutritionGoalsAdded = false;
        const addRunBtn = document.querySelector('.goal-button.optional');
        if (addRunBtn) addRunBtn.classList.remove('active');
    }

    // Update button styles
    const buttons = document.querySelectorAll('.goal-button:not(.optional)');
    buttons.forEach(button => button.classList.remove('active'));

    if (btn && btn.classList) {
        btn.classList.add('active');
    } else {
        // fallback: find by data-goal
        const found = Array.from(buttons).find(b => b.getAttribute('data-goal') === goalType);
        if (found) found.classList.add('active');
    }
}

// Switch between main tabs (Meal Tracker / Fitness Tracker)
function switchTab(tabName) {
    // Get the first tracker-box (main tabs container)
    const trackerBox = document.querySelector('.tracker-box');
    const tabButtons = trackerBox.querySelectorAll('.tab-button');
    const tabPanes = trackerBox.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => button.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    if (tabName === 'meal') {
        tabButtons[0].classList.add('active');
        document.getElementById('meal-tab').classList.add('active');
    } else if (tabName === 'fitness') {
        tabButtons[1].classList.add('active');
        document.getElementById('fitness-tab').classList.add('active');
    }
}

// Switch between food tabs (Custom / Catalog / Serving)
function switchFoodTab(tabName) {
    const tabButtons = document.querySelectorAll('.tracker-box:last-of-type .tab-button');
    const tabPanes = document.querySelectorAll('.tracker-box:last-of-type .tab-pane');
    
    tabButtons.forEach(button => button.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    if (tabName === 'custom') {
        tabButtons[0].classList.add('active');
        document.getElementById('custom-tab').classList.add('active');
    } else if (tabName === 'catalog') {
        tabButtons[1].classList.add('active');
        document.getElementById('catalog-tab').classList.add('active');
    } else if (tabName === 'serving') {
        tabButtons[2].classList.add('active');
        document.getElementById('serving-tab').classList.add('active');
    }
}

// Set current time to datetime input
function setCurrentTime(inputId) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const dateTimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById(inputId).value = dateTimeLocal;
}

// Convert datetime-local to ISO format
function toISOString(dateTimeLocal) {
    const date = new Date(dateTimeLocal);
    return date.toISOString();
}

// Show message
function showMessage(elementId, message, isSuccess) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = 'message ' + (isSuccess ? 'success' : 'error');
    
    setTimeout(() => {
        messageEl.className = 'message';
    }, 5000);
}

// Handle Custom Meal Form Submission
document.getElementById('custom-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    const data = {
        ItemName: document.getElementById('custom-itemname').value,
        ServingGrams: parseFloat(document.getElementById('custom-serving').value),
        Calories: parseFloat(document.getElementById('custom-calories').value),
        Protein: parseFloat(document.getElementById('custom-protein').value),
        Fat: parseFloat(document.getElementById('custom-fat').value),
        TransFat: parseFloat(document.getElementById('custom-transfat').value),
        Sodium: parseFloat(document.getElementById('custom-sodium').value),
        Carbs: parseFloat(document.getElementById('custom-carbs').value),
        Sugar: parseFloat(document.getElementById('custom-sugar').value),
        AddedSugar: parseFloat(document.getElementById('custom-addedsugar').value),
        Description: document.getElementById('custom-description').value || 'N/A',
        Datetime: toISOString(document.getElementById('custom-datetime').value)
    };
    
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/dailymeal/adddailymeal`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('custom-message', result.message || 'Meal added successfully!', true);
            e.target.reset();
        } else {
            showMessage('custom-message', result.message || 'Failed to add meal', false);
        }
    } catch (error) {
        showMessage('custom-message', 'Error: ' + error.message, false);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// Handle Food Catalog Form Submission
document.getElementById('catalog-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    const data = {
        FoodID: parseInt(document.getElementById('catalog-foodid').value),
        ServingGrams: parseFloat(document.getElementById('catalog-serving').value),
        Datetime: toISOString(document.getElementById('catalog-datetime').value)
    };
    
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/dailymeal/addmealitemfromfoodcatalog`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('catalog-message', result.message || 'Meal item added successfully!', true);
            e.target.reset();
        } else {
            showMessage('catalog-message', result.message || 'Failed to add meal item', false);
        }
    } catch (error) {
        showMessage('catalog-message', 'Error: ' + error.message, false);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// Handle Per Serving Form Submission
document.getElementById('serving-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    const data = {
        FoodID: parseInt(document.getElementById('serving-foodid').value),
        Serving: parseFloat(document.getElementById('serving-count').value),
        Datetime: toISOString(document.getElementById('serving-datetime').value)
    };
    
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/dailymeal/addmealitemfromfoodcatalogperserving`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('serving-message', result.message || 'Meal item added successfully!', true);
            e.target.reset();
        } else {
            showMessage('serving-message', result.message || 'Failed to add meal item', false);
        }
    } catch (error) {
        showMessage('serving-message', 'Error: ' + error.message, false);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// Handle Nutrition Date Form Submission
document.getElementById('nutrition-date-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-load');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    
    const dateInput = document.getElementById('nutrition-date').value;
    
    // Convert local date to GMT date string (YYYY-MM-DD format)
    const localDate = new Date(dateInput + 'T00:00:00');
    const gmtDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    const gmtDateString = gmtDate.toISOString().split('T')[0];
    
    console.log('Selected date:', dateInput);
    console.log('GMT date string:', gmtDateString);
    console.log('API URL:', `${CONFIG.BACKEND_URL}/dailymeal/calculatedailynutrition/${gmtDateString}`);
    
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/dailymeal/calculatedailynutrition/${gmtDateString}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.nutrition_summary) {
            displayNutritionData(data.nutrition_summary);
        } else {
            document.getElementById('nutrition-display').innerHTML = `<p class="no-data">Failed to load nutrition data. Status: ${response.status}</p>`;
        }
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        document.getElementById('nutrition-display').innerHTML = '<p class="no-data">Error: ' + error.message + '</p>';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Load';
    }
});

// Handle Fitness Date Form Submission
document.getElementById('fitness-date-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.btn-load');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';

    const dateInput = document.getElementById('fitness-date').value;
    const localDate = new Date(dateInput + 'T00:00:00');
    const gmtDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    const gmtDateString = gmtDate.toISOString().split('T')[0];

    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}/dailymeal/getmealsbydate/${gmtDateString}`, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });

        const result = await response.json();

        if (response.ok && result.meals) {
            lastFetchedMeals = result.meals;
            displayMealsTable(result.meals);
            // show download button when meals exist
            const dl = document.getElementById('download-csv-btn');
            if (dl) dl.style.display = (result.meals && result.meals.length) ? 'inline-block' : 'none';
        } else {
            document.getElementById('fitness-display').innerHTML = `<p class="no-data">Failed to load meals. Status: ${response.status}</p>`;
        }
    } catch (error) {
        console.error('Error fetching meals:', error);
        document.getElementById('fitness-display').innerHTML = `<p class="no-data">Error: ${error.message}</p>`;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Load';
    }
});

// Display nutrition data
function displayNutritionData(data) {
    const displayEl = document.getElementById('nutrition-display');
    
    const nutritionMapping = {
        'TotalCalories': 'calories',
        'TotalProtein': 'protein',
        'TotalFat': 'fat',
        'TotalTransFat': 'SatFat',
        'TotalSodium': 'sodium',
        'TotalCarbs': 'carbs',
        'TotalSugar': 'sugar',
        'TotalAddedSugar': 'addedSugar'
    };
    
    let html = '<div class="nutrition-grid">';
    
    for (const [apiKey, goalKey] of Object.entries(nutritionMapping)) {
        const value = data[apiKey] || 0;
        const goal = currentNutritionGoal[goalKey];
        
        if (!goal) continue;
        
        // Determine progress status
        let status = 'below';
        let percentage = (value / goal.recommended) * 100;
        
        if (value >= goal.recommended && value <= goal.maximum) {
            status = 'met';
            percentage = Math.min(100, percentage);
        } else if (value > goal.maximum) {
            status = 'exceeded';
            percentage = Math.min(100, (value / goal.maximum) * 100);
        }
        
        html += `
            <div class="nutrition-item">
                <div class="nutrition-item-header">
                    <span class="nutrition-name">${goal.name}</span>
                    <span class="nutrition-value">${value.toFixed(1)}<span class="nutrition-unit">${goal.unit}</span></span>
                </div>
                <div class="nutrition-goals">Goal: ${goal.recommended}${goal.unit} | Max: ${goal.maximum}${goal.unit}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar ${status}" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    displayEl.innerHTML = html;
}

// Render meals table for fitness tab
function displayMealsTable(meals) {
    const displayEl = document.getElementById('fitness-display');
    if (!meals || meals.length === 0) {
        displayEl.innerHTML = '<p class="no-data">No meals found for this date.</p>';
        return;
    }

    let html = '<div class="meals-table-wrap"><table class="meals-table"><thead><tr>' +
        '<th>Time</th><th>Item</th><th>Serving (g)</th><th>Calories</th><th>Protein</th><th>Fat</th><th>Sat Fat</th><th>Sodium</th><th>Carbs</th><th>Sugar</th><th>Added Sugar</th></tr></thead><tbody>';

    meals.forEach(m => {
        const dt = m.MealDateTime || '';
        html += `<tr>
            <td>${dt}</td>
            <td>${m.ItemName || ''}</td>
            <td>${m.ServingGrams ?? 0}</td>
            <td>${m.Calories ?? 0}</td>
            <td>${m.Protein ?? 0}</td>
            <td>${m.Fat ?? 0}</td>
            <td>${m.SatFat ?? 0}</td>
            <td>${m.Sodium ?? 0}</td>
            <td>${m.Carbs ?? 0}</td>
            <td>${m.Sugar ?? 0}</td>
            <td>${m.AddedSugar ?? 0}</td>
        </tr>`;
    });

    html += '</tbody></table></div>';
    displayEl.innerHTML = html;
}

// Download last fetched meals as CSV
function downloadMealsCSV() {
    if (!lastFetchedMeals || lastFetchedMeals.length === 0) {
        alert('No meals to download.');
        return;
    }

    const headers = ['MealDateTime','ItemName','ServingGrams','Calories','Protein','Fat','SatFat','Sodium','Carbs','Sugar','AddedSugar','Description'];

    const escapeCell = (val) => {
        if (val === null || val === undefined) return '';
        const s = String(val);
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    };

    let csv = headers.join(',') + '\n';
    lastFetchedMeals.forEach(row => {
        const line = headers.map(h => escapeCell(row[h] ?? '')).join(',');
        csv += line + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const datePart = (document.getElementById('fitness-date') && document.getElementById('fitness-date').value) || '';
    a.download = `meals_${datePart || 'export'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Set today's date as default
function setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    document.getElementById('nutrition-date').value = dateString;
    const fitnessInput = document.getElementById('fitness-date');
    if (fitnessInput) fitnessInput.value = dateString;
}

// Add function to update nutrition goals with additional run values.
function addRunNutritionGoals() {
    const button = document.querySelector('.goal-button.optional');
    
    if (runNutritionGoalsAdded) {
        // Remove run nutrition goals
        currentNutritionGoal.calories.recommended -= ADD_RUN_NUTRITION_GOALS.calories.add;
        currentNutritionGoal.protein.recommended -= ADD_RUN_NUTRITION_GOALS.protein.add;
        currentNutritionGoal.carbs.recommended -= ADD_RUN_NUTRITION_GOALS.carbs.add;
        currentNutritionGoal.calories.maximum -= ADD_RUN_NUTRITION_GOALS.calories.add;
        currentNutritionGoal.protein.maximum -= ADD_RUN_NUTRITION_GOALS.protein.add;
        currentNutritionGoal.carbs.maximum -= ADD_RUN_NUTRITION_GOALS.carbs.add;
        
        runNutritionGoalsAdded = false;
        button.classList.remove('active');
    } else {
        // Add run nutrition goals
        currentNutritionGoal.calories.recommended += ADD_RUN_NUTRITION_GOALS.calories.add;
        currentNutritionGoal.protein.recommended += ADD_RUN_NUTRITION_GOALS.protein.add;
        currentNutritionGoal.carbs.recommended += ADD_RUN_NUTRITION_GOALS.carbs.add;
        currentNutritionGoal.calories.maximum += ADD_RUN_NUTRITION_GOALS.calories.add;
        currentNutritionGoal.protein.maximum += ADD_RUN_NUTRITION_GOALS.protein.add;
        currentNutritionGoal.carbs.maximum += ADD_RUN_NUTRITION_GOALS.carbs.add;
        
        runNutritionGoalsAdded = true;
        button.classList.add('active');
    }
    
    // Refresh the nutrition display if it's currently showing
    const displayEl = document.getElementById('nutrition-display');
    if (displayEl && !displayEl.querySelector('.no-data')) {
        // If we have nutrition data displayed, re-render it
        const nutritionItems = displayEl.querySelectorAll('.nutrition-item');
        if (nutritionItems.length > 0) {
            // Trigger a refresh by clicking the load button
            const nutritionForm = document.getElementById('nutrition-date-form');
            if (nutritionForm) {
                nutritionForm.dispatchEvent(new Event('submit'));
            }
        }
    }
}

// Initialize
updateDateTime();
setInterval(updateDateTime, 1000); // Update every second
setTodayDate(); // Set today's date in nutrition tracker
