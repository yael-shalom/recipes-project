import { Card, CardActions, CardContent, CardMedia, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe } from './recipeSlice';
import { Link, useNavigate } from 'react-router-dom';
import './SingleRecipe.css'
import { Button, Chip } from '@mui/material';
import { getDifficulty, minutesToHours } from './recipesService';

export default function SingleRecipe({ recipe }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.currentUser)

  const deleteHandler = () => {
    dispatch(deleteRecipe(recipe._id))
  };

  const editHandler = () => {
    navigate(`/update/${recipe._id}`);
  };

  return (
    <Card
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
    >
      <Box>
        <CardMedia
          sx={{ height: 140,  backgroundSize: !recipe.imagUrl ? "contain" : "cover" }}
          title={recipe.name}
          // image={recipe.imagUrl ? `${import.meta.env.VITE_API_URL}/images/${recipe.imagUrl}` : '/default-image.svg'}
          image={recipe.imagUrl ? `${recipe.imagUrl}` : '/default-image.svg'}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {recipe.name}
          </Typography>
          <Typography component='div' variant="body2" sx={{ color: 'text.secondary' }}>
            <div className="flex-row">
              <Chip label={minutesToHours(recipe?.preparationTime)} variant="outlined" sx={{ marginInline: '5px' }} />
              <Chip label={`${getDifficulty(recipe.difficulty)} `} variant="outlined" sx={{ marginInline: '5px' }} />
            </div>
          </Typography>
        </CardContent>
      </Box>
      <CardActions sx={{ justifyContent: 'space-between', mt: 'auto' }}>
        {recipe.user._id == currentUser?._id &&
          <DeleteIcon
            onClick={(event) => {
              event.stopPropagation();
              deleteHandler();
            }}
            sx={{ cursor: 'pointer' }}
          />
        }
        {recipe.user._id == currentUser?._id &&
          <EditNoteRoundedIcon
            onClick={(event) => {
              event.stopPropagation();
              editHandler();
            }}
            fontSize='large'
            sx={{ cursor: 'pointer', color: 'black' }}
          />
        }
      </CardActions>
    </Card>
  );
}