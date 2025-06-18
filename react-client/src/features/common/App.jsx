import './App.css'
import Recipes from '../recipes/Recipes'
import Home from './Home'
import RecipeForm from '../recipes/RecipeForm'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import ShowRecipe from '../recipes/ShowRecipe'
import Header from './Header'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRecipes } from '../recipes/recipeSlice'
import { useEffect } from 'react'
import Login from '../users/login'
import { getAllCategories } from '../categories/categorySlice'

function App() {
	const dispatch = useDispatch();
	const allRecipes = useSelector((state) => state.recipes.allRecipes)

	const withHeader = (component) => {
		return (<>
			<Header />
			{component}
		</>);
	};

	useEffect(() => {
		dispatch(getAllRecipes())
		dispatch(getAllCategories())
	}, [])

	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={withHeader(<Home />)}></Route >
				{/* <Route path='/register' element={<Register />}></Route> */}
				<Route path='/recipes' element={withHeader(<Recipes initialRecipes={allRecipes} />)}></Route>
				<Route path='recipes/owner/:id' element={withHeader(<Recipes initialRecipes={allRecipes} />)}></Route>
				<Route path='/add' element={<RecipeForm />}></Route>
				<Route path='/update/:id' element={<RecipeForm />}></Route>
				<Route path='/recipes/:id' element={<ShowRecipe />}></Route>
				<Route path='/login' element={<Login />}></Route>
			</Routes >
		</>
	)
}

export default App
