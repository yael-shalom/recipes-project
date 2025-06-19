import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import './Recipes.css';
import GradientCircularProgress from '../common/GradientProgress'
import { useParams } from 'react-router-dom';
import SingleRecipe from './SingleRecipe';

const Recipes = ({ initialRecipes }) => {
    const userId = useParams();
    const params = new URLSearchParams(window.location.search);
    const [recipesList, setRecipesList] = useState(initialRecipes)
    const status = useSelector((state) => state.recipes.status);
    const search = params.get('search') ? params.get('search') : '';
    const category = params.get('category')
    const difficulty = params.get('difficulty')
    const hasDifficulty = difficulty ? true : false
    const hasCategory = category ? true : false

    const getDifficulty = (diff) => {
        if (diff == 5)
            return 'קשה'
        if (diff > 2 && diff < 5)
            return 'בינוני'
        return 'קל'
    }

    useEffect(() => {
        if (userId.id != undefined) {
            setRecipesList(initialRecipes.filter(rec => rec.user._id == userId.id));
        }
        else {
            setRecipesList(initialRecipes)
        }
    }, [userId])

    const filteredRecipes = recipesList?.filter(rec => rec.name.includes(search) && (!hasCategory || rec.categories.includes(category)) && (!hasDifficulty || getDifficulty(rec) == difficulty));
    return (<div className='recipes'>
        <div className='flex-col'>
            {status == "loading..." && <GradientCircularProgress />}

            {status != "loading..." && recipesList?.length > 0 && (
                <ul>{filteredRecipes.map(item => <li key={item._id}><SingleRecipe recipe={item} /></li>)}</ul>
            )}

            {status != "loading..." && recipesList?.length == 0 && <p style={{ textAlign: "center" }}>אין מתכונים...</p>}

            {status == "failed!!" && <p>שגיאה בטעינת המתכונים 😞</p>}
        </div>
    </div>);
};

export default Recipes;
