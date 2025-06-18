import * as React from 'react';
import { useSelector } from 'react-redux';
import './ShowRecipe.css'
import Chip from '@mui/material/Chip';
import { AddCircleOutline } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Grid2, List, ListItem, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import PrintIcon from '@mui/icons-material/Print';
import CheckIcon from '@mui/icons-material/Check';

const ShowRecipe = () => {
	const { id } = useParams();
	const [height, setHeight] = useState(0);
	const recipesList = useSelector((state) => state.recipes.allRecipes);
	const recipe = recipesList.find(rec => rec._id == id);
	const headerRef = useRef();

	useEffect(() => {
		setHeight(headerRef.current.offsetTop + headerRef.current.offsetHeight);
	}, [])


	const difficulty = (diff) => {
		if (diff == 5)
			return 'קשה'
		if (diff > 2 && diff < 5)
			return 'בינוני'
		return 'קל'
	}

	return (
		<Grid2 container
			direction="column"
			sx={{
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Grid2>
				<PrintIcon className='print-icon' onClick={() => { window.print(); }} sx={{ cursor: "pointer", position: "fixed", left: "15px", top: '20px', zIndex: '1000' }} />
				<div className="overlay" style={{ backgroundImage: `url(http://localhost:5000/images/${recipe.imagUrl})`, height: height }}></div>
				<div ref={headerRef}>
					<h1>{recipe.name}</h1>
					<p className='description'>{recipe.description}</p>
					<Grid2 className="containCat" size={12}>
						{recipe.categories.map((cat) => <Chip key={cat} label={`${cat}`} variant="outlined" sx={{ marginInline: '5px' }} />)}
						<Chip label={`${recipe.preparationTime} דקות`} variant="outlined" sx={{ marginInline: '5px' }} />
						<Chip label={`${difficulty(recipe.difficulty)} `} variant="outlined" sx={{ marginInline: '5px' }} />
					</Grid2>
				</div>
			</Grid2>
			<Grid2 size={10}>
				<div className="ingredients">
					<h2>אז מה צריך בשביל להתחיל?</h2>
					{recipe.layersArray.map(layer => <React.Fragment key={layer._id}>
						<h3>{layer.description}</h3>
						{/* <ul>{layer.ingredients.map(ing => <li key={ing}>{ing}</li>)}</ul> */}
						<List>
							{layer.ingredients.map((ingredient, index) => (
								<ListItem key={index} style={{ textAlign: 'right' }}>
									<CheckIcon sx={{width: '20px', marginLeft: '8px'}}/>
									<ListItemText primary={`${ingredient}`} />
								</ListItem>
							))}
						</List>
					</React.Fragment>)}
				</div>
				<h2>אופן הכנה</h2>
				<List className="instructions">
					{recipe.preparationInstruction.map((instruction, index) => (
						<ListItem key={index} style={{ textAlign: 'right' }}>
							<ListItemText primary={`${index + 1}. ${instruction}`} />
						</ListItem>
					))}
				</List>
				<p style={{fontSize: '30px', textAlign: 'center', fontWeight: 'bold'}}>בתאבון!!!</p>
			</Grid2>
		</Grid2>
	);
}

export default ShowRecipe;