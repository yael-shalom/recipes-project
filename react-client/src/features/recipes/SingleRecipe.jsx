import React, { useState } from 'react';
import './SingleRecipe.css'; // קובץ CSS לעיצוב

const SingleRecipe = ({ recipe }) => {
    const [completedIngredients, setCompletedIngredients] = useState([]);
    const [completedInstructions, setCompletedInstructions] = useState([]);

    const toggleIngredient = (ingredient) => {
        if (completedIngredients.includes(ingredient)) {
            setCompletedIngredients(completedIngredients.filter((item) => item !== ingredient));
        } else {
            setCompletedIngredients([...completedIngredients, ingredient]);
        }
    };

    const toggleInstruction = (index) => {
        if (completedInstructions.includes(index)) {
            setCompletedInstructions(completedInstructions.filter((step) => step !== index));
        } else {
            setCompletedInstructions([...completedInstructions, index]);
        }
    };

    return (
        <div className="recipe-container">
            <h1>{recipe.name}</h1>
            <img src={recipe.image} alt={recipe.name} className="recipe-image" />
            <div className="recipe-details">
                <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} minutes</p>
                <p><strong>Cook Time:</strong> {recipe.cookTimeMinutes} minutes</p>
                <p><strong>Servings:</strong> {recipe.servings}</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
                <p><strong>Calories Per Serving:</strong> {recipe.caloriesPerServing}</p>
                <p><strong>Rating:</strong> {recipe.rating} ({recipe.reviewCount} reviews)</p>
            </div>
            <div className="recipe-section">
                <h2>Ingredients</h2>
                <div className="list-container">
                    {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="list-item">
                            <input
                                type="checkbox"
                                checked={completedIngredients.includes(ingredient)}
                                onChange={() => toggleIngredient(ingredient)}
                            />
                            <span className={completedIngredients.includes(ingredient) ? 'completed' : ''}>
                                {ingredient}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="recipe-section">
                <h2>Instructions</h2>
                <div className="list-container">
                    {recipe.instructions.map((instruction, index) => (
                        <div key={index} className="list-item">
                            <input
                                type="checkbox"
                                checked={completedInstructions.includes(index)}
                                onChange={() => toggleInstruction(index)}
                            />
                            <span className={completedInstructions.includes(index) ? 'completed' : ''}>
                                {instruction}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SingleRecipe;