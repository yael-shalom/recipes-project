import { useEffect, useState } from "react";
import {
	Box, TextField, Button, Typography, Chip, IconButton, MenuItem, Switch, FormControlLabel, Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid2
} from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import { addRecipe, updateRecipe } from "./recipeSlice";
import { useDispatch, useSelector } from "react-redux";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getAllCategories } from "../categories/categorySlice";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import './RecipeForm.css'
import { UploadRounded } from "@mui/icons-material";


export default function RecipeForm() {
	const dispatch = useDispatch()
	const categoriesList = useSelector((state) => state.categories.allCategories);
	const recipes = useSelector((state) => state.recipes.allRecipes)
	const status = useSelector((state) => state.recipes.status)
	const categoriesNames = categoriesList.map(cat => cat.description)
	const formData = new FormData();
	const { id } = useParams();
	const [file, setFile] = useState(null);

	const [showDialog, setShowDialog] = useState(false);
	const [dialogText, setDialogText] = useState('');
	const [dialogType, setDialogType] = useState(false);

	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getAllCategories())
		if (id)
			insertExistsValues()

	}, [dispatch, id])

	const openDialog = () => {
		setShowDialog(true);
	};

	const onDialogSubmit = (event) => {
		event.preventDefault();

		const newLines = dialogText.split('\n').filter(x => x.trim() !== '');
		setForm({
			...form,
			preparationInstruction: [...form.preparationInstruction, ...newLines]
		});
		setDialogText('');
		setShowDialog(false);
	}

	const insertExistsValues = async () => {
		const recipe = recipes.find(rec => rec._id == id)
		form.name = recipe?.name
		form.description = recipe.description
		form.categories = recipe.categories
		form.preparationTime = recipe.preparationTime
		form.difficulty = recipe.difficulty
		form.layersArray = recipe.layersArray
		form.preparationInstruction = recipe.preparationInstruction
		form.isPrivate = recipe.isPrivate
		if (recipe.imagUrl) {
			const imgFile = await downloadImageAsFile(`${recipe.imagUrl}`);
			setFile(imgFile);
		}
	}

	const [form, setForm] = useState({
		name: "",
		description: "",
		categories: [],
		preparationTime: "",
		difficulty: 3,
		layersArray: [{ description: "", ingredients: [""] }],
		preparationInstruction: [""],
		isPrivate: false,
	});

	const [errors, setErrors] = useState({});
	const [categoryInput, setCategoryInput] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const handleFile = (event) => {
		const selectedFile = event.target.files[0];
		setFile(selectedFile);
	}

	const handlePasteImageUrl = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setImageUrl(text);
			const proxyUrl = `${import.meta.env.VITE_API_URL}/proxy?url=${encodeURIComponent(text)}`;
			const file = await downloadImageAsFile(proxyUrl);
			setFile(file);
		} catch (err) {
			console.error('Failed to read clipboard contents: ', err);
		}
	};

	const handleImageUrlChange = (event) => {
		setImageUrl(event.target.value);
	};

	const handleImageUrlSubmit = () => {
		if (imageUrl) {
			const proxyUrl = `${import.meta.env.VITE_API_URL}/proxy?url=${encodeURIComponent(imageUrl)}`;
			downloadImageAsFile(proxyUrl).then(file => {
				setFile(file);
				setImageUrl(""); // לנקות את השדה אחרי שהקובץ נוסף
			});
		}
	};

	const removeFile = () => {
		setFile(null);
	};

	// כללי
	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		setForm({ ...form, [name]: type === "checkbox" ? checked : value });
	};

	// קטגוריות - בחירה מרשימה
	const handleCategorySelect = (e) => {
		const value = e.target.value;
		if (value && !form.categories?.includes(value)) {
			setForm({ ...form, categories: [...form.categories, value] });
		}
	};

	// קטגוריות - הוספה חופשית
	const handleAddCategory = () => {
		const val = categoryInput.trim();
		if (val && !form.categories?.includes(val)) {
			setForm({ ...form, categories: [...form.categories, val] });
			setCategoryInput("");
		}
	};

	const handleDeleteCategory = cat =>
		setForm({ ...form, categories: form.categories.filter(c => c !== cat) });

	// הכנה/הוראות כולל דינמי
	const handlePreparationChange = (i, value) => {
		const arr = [...form.preparationInstruction];
		arr[i] = value;
		setForm({ ...form, preparationInstruction: arr });
	};
	const addPreparationStep = () =>
		setForm({ ...form, preparationInstruction: [...form.preparationInstruction, ""] });
	const removePreparationStep = i =>
		setForm({ ...form, preparationInstruction: form.preparationInstruction.filter((_, idx) => idx !== i) });

	// ליירס דינמי
	const handleLayerDescription = (idx, value) => {
		const arr = [...form.layersArray];
		arr[idx].description = value;
		setForm({ ...form, layersArray: arr });
	};
	const handleLayerIngredient = (layerIdx, ingIdx, value) => {
		const arr = [...form.layersArray];
		arr[layerIdx].ingredients[ingIdx] = value;
		setForm({ ...form, layersArray: arr });
	};
	const addLayer = () => setForm({ ...form, layersArray: [...form.layersArray, { description: "", ingredients: [""] }] });
	const removeLayer = idx => setForm({ ...form, layersArray: form.layersArray.filter((_, i) => i !== idx) });
	const addLayerIngredient = (layerIdx) => {
		const arr = [...form.layersArray];
		arr[layerIdx].ingredients.push("");
		setForm({ ...form, layersArray: arr });
	};
	const removeLayerIngredient = (layerIdx, ingIdx) => {
		const arr = [...form.layersArray];
		arr[layerIdx].ingredients.splice(ingIdx, 1);
		setForm({ ...form, layersArray: arr });
	};

	// ולידציה
	const validate = () => {
		let temp = {};
		temp.name = form.name ? "" : "נדרש";
		temp.categories = form.categories.length ? "" : "נדרש לבחור קטגוריה אחת לפחות";
		temp.preparationTime = form.preparationTime && Number(form.preparationTime) > 0 ? "" : "נדרש";
		temp.difficulty = form.difficulty >= 1 && form.difficulty <= 5 ? "" : "מ-1 עד 5";
		temp.layersArray = form.layersArray.some(l => !l.description.trim() || l.ingredients.some(i => !i.trim()))
			? "יש למלא תיאור ורכיבים בכל שכבה"
			: "";
		temp.preparationInstruction = form.preparationInstruction.some(i => !i.trim())
			? "יש למלא את כל שלבי ההכנה"
			: "";
		setErrors(temp);
		return Object.values(temp).every(x => x === "");
	};

	// שליחה
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			formData.append('name', form.name)
			formData.append('description', form.description)
			form.categories.forEach(cat => formData.append('categories', cat));
			formData.append('preparationTime', form.preparationTime)
			formData.append('difficulty', form.difficulty)
			form.layersArray.forEach((layer, idx) => {
				formData.append(`layersArray[${idx}][description]`, layer.description);
				layer.ingredients.forEach((ing, ingIdx) => {
					formData.append(`layersArray[${idx}][ingredients][${ingIdx}]`, ing);
				});
			});
			form.preparationInstruction.forEach(prep => formData.append('preparationInstruction', prep))
			formData.append('isPrivate', form.isPrivate)

			if (file)
				formData.append('image', file)
			if (id) {
				dispatch(updateRecipe({ formData, id }))
			}
			else {
				dispatch(addRecipe(formData))
			}
			if (status == 'fulfilled')
				navigate(-1)
			setErrors({});
		}
	};

	const downloadImageAsFile = async (imageUrl) => {
		const response = await fetch(imageUrl);
		const blob = await response.blob();
		const file = new File([blob], "image.png", { type: blob.type });
		return file;
	};

	return (<>
		<Dialog fullWidth open={showDialog} onClose={() => setShowDialog(false)}>
			<DialogTitle>הקש את שלבי ההכנה</DialogTitle>
			<DialogContent>
				<div>
					<TextField
						id="text"
						label="שלבי הכנה"
						multiline
						rows={12}
						variant="outlined"
						fullWidth
						onChange={ev => setDialogText(ev.target.value)}
						sx={{ marginTop: '5px' }}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={onDialogSubmit}
					fullWidth
					sx={{
						bgcolor: "var(--primary-color)",
						color: "#fff",
						fontWeight: 700,
						fontSize: "1.09rem",
						mt: 2,
						"&:hover": { bgcolor: "#ff8270" },
					}}
				>
					הוסף
				</Button>
			</DialogActions>
		</Dialog>
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				maxWidth: 730,
				mx: "auto",
				mt: 5,
				p: 4,
				borderRadius: 3,
				background: "content-box",
				boxShadow: '1px 1px 8px 2px #00000033'
			}}
		>
			<Grid2 container spacing={2} direction='column'>
				<Grid2 gridColumn="span 12">
					<TextField
						label="שם המתכון"
						name="name"
						value={form.name}
						onChange={handleChange}
						fullWidth
						error={!!errors.name}
						helperText={errors.name}
					/>
				</Grid2>

				<Grid2>
					<TextField
						label="תיאור כללי"
						name="description"
						value={form.description}
						onChange={handleChange}
						fullWidth
						multiline
						minRows={2}
					/>
				</Grid2>

				{/* קטגוריות */}
				<Grid2>
					<Typography fontWeight={500} fontSize="1rem" mb={1}>
						קטגוריות
					</Typography>
					<Grid2 container spacing={1} alignItems="center">
						<Grid2>
							<TextField
								select
								label="בחר קטגוריה"
								value=""
								onChange={handleCategorySelect}
								sx={{ minWidth: 160 }}
							>
								<MenuItem value="" disabled>
									בחר מהרשימה
								</MenuItem>
								{categoriesNames.filter(opt => !form.categories?.includes(opt)).map((opt) => (
									<MenuItem key={opt} value={opt}>{opt}</MenuItem>
								))}
							</TextField>
						</Grid2>
						<Grid2>
							<TextField
								label="הוסף קטגוריה חדשה"
								value={categoryInput}
								onChange={e => setCategoryInput(e.target.value)}
								onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
								sx={{ minWidth: 160 }}
							/>
						</Grid2>
						<Grid2>
							<IconButton onClick={handleAddCategory} color="primary">
								<AddCircleOutline />
							</IconButton>
						</Grid2>
					</Grid2>
					<Grid2 mb={1}>
						{form.categories.map((cat, i) => (
							<Chip
								key={cat}
								label={cat}
								onDelete={() => handleDeleteCategory(cat)}
								color="secondary"
								sx={{ bgcolor: "var(--primary-color)", color: "#fff", fontWeight: 600, mr: 1, mb: 1, direction: "ltr" }}
							/>
						))}
					</Grid2>
					{errors.categories && (
						<Typography color="error" fontSize="0.9em">{errors.categories}</Typography>
					)}
				</Grid2>

				<Grid2 container spacing={2}>
					<Grid2>
						<TextField
							label="זמן הכנה (בדקות)"
							name="preparationTime"
							type="number"
							value={form.preparationTime}
							onChange={handleChange}
							error={!!errors.preparationTime}
							helperText={errors.preparationTime}
						/>
					</Grid2>

					<Grid2>
						<TextField
							label="דרגת קושי"
							name="difficulty"
							type="number"
							value={form.difficulty}
							onChange={handleChange}
							error={!!errors.difficulty}
							helperText={errors.difficulty}
						/>
					</Grid2>
				</Grid2>

				{/* כפתורי העלאת תמונה בשורה חדשה */}
				<Grid2 container spacing={2} mt={2}>
					{!file && (
						<>
							<Grid2>
								<Button
									component="label"
									role={undefined}
									variant="contained"
									tabIndex={-1}
									startIcon={<CloudUploadIcon />}
									sx={{ backgroundColor: "var(--primary-color)", height: "54px" }}
								>
									העלאת תמונה
									<input
										type="file"
										onChange={handleFile}
										style={{ display: 'none' }} // הסתר את הכניסה
										multiple
									/>
								</Button>
							</Grid2>
							<Grid2>
								<Button
									onClick={handlePasteImageUrl}
									variant="contained"
									sx={{ backgroundColor: "var(--primary-color)", height: "54px" }}
								>
									הדבק כתובת URL
								</Button>
							</Grid2>
						</>
					)}
				</Grid2>

				{file && (
					<Grid2 container className="image-container" style={{ marginTop: '16px' }} height={200} alignContent='center' justifyContent='flex-start'>
						<img
							src={URL.createObjectURL(file)}
							alt="Uploaded"
							className="uploaded-image"
							style={{ width: 'auto', height: '100%', objectFit: 'cover' }}
						/>
						<IconButton
							className="remove-icon"
							onClick={removeFile}
						>
							<CloseIcon />
						</IconButton>
					</Grid2>
				)}

				<Grid2>
					<Typography fontWeight={500} fontSize="1rem" mb={1}>
						שכבות / חלקי מתכון
					</Typography>
					{form.layersArray.map((layer, layerIdx) => (
						<Box key={layerIdx} mb={2} p={2} sx={{ border: "1px solid #eee", borderRadius: 2, background: "#fff9f7" }}>
							<Grid2 container alignItems="center" mb={1}>
								<Grid2>
									<TextField
										label={`תיאור שכבה ${layerIdx + 1}`}
										value={layer.description}
										onChange={e => handleLayerDescription(layerIdx, e.target.value)}
										fullWidth
										sx={{ mr: 2, width: "600px" }}
									/>
								</Grid2>
								{form.layersArray.length > 1 && (
									<Grid2>
										<IconButton onClick={() => removeLayer(layerIdx)} color="error" size="small">
											<RemoveCircleOutline />
										</IconButton>
									</Grid2>
								)}
								{layerIdx === form.layersArray.length - 1 && (
									<Grid2>
										<IconButton onClick={addLayer} color="primary" size="small">
											<AddCircleOutline />
										</IconButton>
									</Grid2>
								)}
							</Grid2>
							{layer.ingredients.map((ing, ingIdx) => (
								<Grid2 key={ingIdx} container alignItems="center" mb={1}>
									<Grid2>
										<TextField
											label={`רכיב ${ingIdx + 1}`}
											value={ing}
											onChange={e => handleLayerIngredient(layerIdx, ingIdx, e.target.value)}
											fullWidth
											sx={{ width: "580px" }}
										/>
									</Grid2>
									{layer.ingredients.length > 1 && (
										<Grid2>
											<IconButton onClick={() => removeLayerIngredient(layerIdx, ingIdx)} color="error" size="small">
												<RemoveCircleOutline />
											</IconButton>
										</Grid2>
									)}
									{ingIdx === layer.ingredients.length - 1 && (
										<Grid2>
											<IconButton onClick={() => addLayerIngredient(layerIdx)} color="primary" size="small">
												<AddCircleOutline />
											</IconButton>
										</Grid2>
									)}
								</Grid2>
							))}
						</Box>
					))}
					{errors.layersArray && (
						<Typography color="error" fontSize="0.9em">{errors.layersArray}</Typography>
					)}
				</Grid2>

				{/* שלבי הכנה */}
				<Grid2 gridColumn="span 12">
					<Typography fontWeight={500} fontSize="1rem" mb={1}>
						שלבי הכנה
						<IconButton onClick={openDialog}>
							<UploadRounded />
						</IconButton>
					</Typography>
					{form.preparationInstruction.map((step, i) => (
						<Grid2 key={i} container alignItems="center" mb={1}>
							<Grid2>
								<TextField
									label={`שלב ${i + 1}`}
									value={step}
									onChange={e => handlePreparationChange(i, e.target.value)}
									fullWidth
									sx={{ width: "620px" }}
									error={!!errors.preparationInstruction && !step}
								/>
							</Grid2>
							{form.preparationInstruction.length > 1 && (
								<Grid2>
									<IconButton onClick={() => removePreparationStep(i)} color="error" size="small">
										<RemoveCircleOutline />
									</IconButton>
								</Grid2>
							)}
							{i === form.preparationInstruction.length - 1 && (
								<Grid2>
									<IconButton onClick={addPreparationStep} color="primary" size="small">
										<AddCircleOutline />
									</IconButton>
								</Grid2>
							)}
						</Grid2>
					))}
					{errors.preparationInstruction && (
						<Typography color="error" fontSize="0.9em">{errors.preparationInstruction}</Typography>
					)}
				</Grid2>

				{/* פרטיות */}
				<Grid2 gridColumn="span 12">
					<FormControlLabel
						control={
							<Switch
								checked={form.isPrivate}
								onChange={e => setForm({ ...form, isPrivate: e.target.checked })}
								color="primary"
							/>
						}
						label="הפוך את המתכון לפרטי"
						sx={{ mr: 1 }}
					/>
				</Grid2>

				<Grid2 gridColumn="span 12">
					<Button
						variant="contained"
						type="submit"
						fullWidth
						sx={{
							bgcolor: "var(--primary-color)",
							color: "#fff",
							fontWeight: 700,
							fontSize: "1.09rem",
							mt: 2,
							"&:hover": { bgcolor: "#ff8270" }
						}}
					>
						שמור מתכון
					</Button>
				</Grid2>
			</Grid2>
		</Box>
	</>);
}