import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import './Recipes.css';
import GradientCircularProgress from '../common/GradientProgress'
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import SingleRecipe from './SingleRecipe';
import { getDifficulty } from './recipesService';

const Recipes = ({ initialRecipes }) => {
    const { id: ownerId } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [recipesList, setRecipesList] = useState(initialRecipes)
    const status = useSelector((state) => state.recipes.status);
    const search = searchParams.get('search') ? searchParams.get('search') : '';
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const hasDifficulty = difficulty ? true : false
    const hasCategory = category ? true : false


    useEffect(() => {
        if (ownerId != undefined) {
            setRecipesList(initialRecipes.filter(rec => rec.user._id == ownerId));
        }
        else {
            setRecipesList(initialRecipes)
        }
    }, [ownerId, initialRecipes]);

    const filteredRecipes = recipesList?.filter(rec => rec.name?.includes(search) && (!hasCategory || rec.categories?.includes(category)) && (!hasDifficulty || getDifficulty(rec.difficulty) == difficulty));
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
