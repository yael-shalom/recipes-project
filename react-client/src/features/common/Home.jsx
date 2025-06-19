import { useSelector } from 'react-redux';
import './Home.css'
import Recipes from '../recipes/Recipes';

const Home = () => {
    const recipesList = useSelector((state) => state.recipes.allRecipes);
    const lastRecipes = recipesList
                            .toSorted((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                            .slice(0, 4);

    return (
        <>
            <h1>חדש באתר</h1>
            <Recipes initialRecipes={lastRecipes} />
        </>
    );
}

export default Home;