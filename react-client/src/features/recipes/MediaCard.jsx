import { Card, CardActions, CardContent, CardMedia, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRecipe } from './recipeSlice';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { Link, useNavigate } from 'react-router-dom';
import './MediaCard.css'
import { Button, Chip } from '@mui/material';

export default function MediaCard({ recipe }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.users.currentUser)

  const deleteHandler = () => {
    dispatch(deleteRecipe(recipe._id))
  };

  const editHandler = () => {
    navigate(`/update/${recipe._id}`);
  };

  const difficulty = (diff) => {
    if (diff == 5)
      return 'קשה'
    if (diff > 2 && diff < 5)
      return 'בינוני'
    return 'קל'
  }

  return (
    <Card
      onClick={() => navigate(`/recipes/${recipe._id}`)}
      sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
    >
      <Box>
        <CardMedia
          sx={{ height: 140 }}
          title={recipe.name}
          image={`http://localhost:5000/images/${recipe.imagUrl}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
            {recipe.name}
          </Typography>
          <Typography component='div' variant="body2" sx={{ color: 'text.secondary' }}>
            <div className="flex-row">
              <Chip label={`${recipe.preparationTime} דקות`} variant="outlined" sx={{ marginInline: '5px' }} />
              <Chip label={`${difficulty(recipe.difficulty)} `} variant="outlined" sx={{ marginInline: '5px' }} />
            </div>
          </Typography>
        </CardContent>
      </Box>
      <CardActions sx={{ justifyContent: 'space-between', mt: 'auto' }}>
        {recipe.user._id == currentUser?._id &&
          <DeleteIcon
            onClick={(event) => {
              event.stopPropagation(); // מונע את הניווט
              deleteHandler();
            }}
            sx={{ cursor: 'pointer' }}
          />
        }
        {recipe.user._id == currentUser?._id &&
          <EditNoteRoundedIcon
            onClick={(event) => {
              event.stopPropagation(); // מונע את הניווט
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