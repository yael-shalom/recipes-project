import { useDispatch, useSelector } from 'react-redux';
import './ShowRecipe.css'
import Chip from '@mui/material/Chip';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid2, List, ListItem, ListItemText } from '@mui/material';
import { useState, useEffect, Fragment } from 'react';
import { useRef } from 'react';
import PrintIcon from '@mui/icons-material/Print';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { deleteRecipe, getAllRecipes } from './recipeSlice';
import { getDifficulty, minutesToHours } from './recipesService';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog';

const ShowRecipe = () => {
	const { id } = useParams();
	const [height, setHeight] = useState(0);
	const recipesList = useSelector((state) => state.recipes.allRecipes);
	const currentUser = useSelector((state) => state.users.currentUser);
	const recipe = recipesList.find(rec => rec._id == id);
	const headerRef = useRef();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [layersArrayCheck, setLayersArrayCheck] = useState([]);
	const [instructionsArray, setInstructionsArray] = useState(new Array(recipe?.preparationInstruction.length).fill(false))
	const [openDialog, setOpenDialog] = useState(false);

	useEffect(() => {
		setHeight(headerRef.current.offsetTop + headerRef.current.offsetHeight);
	}, [recipesList]);

	useEffect(() => {
		if (!recipesList)
			dispatch(getAllRecipes());
	}, []);

	useEffect(() => {
		if (recipe?.layersArray) {
			const initialLayersCheck = recipe.layersArray.map(layer => new Array(layer.ingredients.length).fill(false));
			setLayersArrayCheck(initialLayersCheck);
		}
	}, [recipe]);

	const deleteHandler = () => setOpenDialog(true);
	const handleDialogClose = () => setOpenDialog(false);
	const handleConfirmDelete = () => {
		dispatch(deleteRecipe(recipe._id));
		setOpenDialog(false);
	};

	const editHandler = () => {
		navigate(`/update/${recipe._id}`);
	};

	const changeState = (indexL, indexI) => {
		const copy = [...layersArrayCheck];
		copy[indexL][indexI] = !copy[indexL][indexI];
		setLayersArrayCheck(copy);
	};

	const changeInstructionState = (index) => {
		const copy = [...instructionsArray]
		copy[index] = !copy[index]
		setInstructionsArray(copy)
	}

	return (
		<Grid2 container direction="column" className='show-recipe' sx={{ justifyContent: "center", alignItems: "center" }}>
			<Grid2>
				<PrintIcon className='no-print' onClick={() => { window.print(); }} sx={{ cursor: "pointer", position: "fixed", insetInlineEnd: "15px", top: '20px', zIndex: '1000' }} />
				<div className="overlay" style={{ backgroundImage: `url(${recipe?.imagUrl})`, height: height }}></div>
				<div ref={headerRef}>
					<h1>{recipe?.name}</h1>
					<pre className='description'>{recipe?.description}</pre>
					<Grid2 className="containCat" size={12}>
						{recipe?.categories.map((cat) => <Chip key={cat} label={`${cat}`} variant="outlined" sx={{ marginInline: '5px' }} />)}
						<Chip label={minutesToHours(recipe?.preparationTime)} variant="outlined" sx={{ marginInline: '5px' }} />
						<Chip label={`${getDifficulty(recipe?.difficulty)} `} variant="outlined" sx={{ marginInline: '5px' }} />
					</Grid2>
				</div>
			</Grid2>
			<Grid2 size={10}>
				<div className="ingredients">
					<h2>אז מה צריך בשביל להתחיל?</h2>
					{recipe?.layersArray.map((layer, indexL) => (
						<Fragment key={layer._id}>
							<h3>{layer.description}</h3>
							<List>
								{layer.ingredients.map((ingredient, indexI) => (
									<ListItem key={indexI}
										style={{ textAlign: 'right', cursor: 'pointer', textDecorationLine: layersArrayCheck[indexL]?.[indexI] ? 'line-through' : 'none' }}
										onClick={() => changeState(indexL, indexI)}
									>
										<CheckIcon sx={{ width: '20px', marginInlineEnd: '8px' }} />
										<ListItemText primary={`${ingredient}`} />
									</ListItem>
								))}
							</List>
						</Fragment>
					))}
				</div>
				<h2>אופן הכנה</h2>
				<List className="instructions">
					{recipe?.preparationInstruction.map((instruction, index) => (
						<ListItem key={index} style={{ textAlign: 'right', cursor: 'pointer', textDecorationLine: instructionsArray[index] ? 'line-through' : 'none' }}
							onClick={() => changeInstructionState(index)}>
							<ListItemText primary={`${index + 1}. ${instruction}`} />
						</ListItem>
					))}
				</List>
				<pre style={{ fontWeight: "bold" }}>    <i>נוסף ע"י: {recipe?.user.name}</i></pre>
				<p style={{ fontSize: '30px', textAlign: 'center', fontWeight: 'bold' }}>בתאבון!!!</p>
				{recipe?.user._id === currentUser?._id && <Grid2 container alignItems='center' spacing={2} className="recipe-actions">
					<DeleteIcon className='no-print' onClick={deleteHandler} sx={{ cursor: 'pointer' }} />
					<EditNoteRoundedIcon className='no-print' onClick={editHandler} fontSize='large' sx={{ cursor: 'pointer', color: 'black' }} />
				</Grid2>}
			</Grid2>
			<ConfirmDeleteDialog
				open={openDialog}
				onClose={handleDialogClose}
				onConfirm={handleConfirmDelete}
				recipeName={recipe?.name}
			/>
		</Grid2>
	);
}

export default ShowRecipe;
