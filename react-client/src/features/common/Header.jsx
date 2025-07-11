import { useSelector } from "react-redux";
import { Autocomplete, Chip, Divider, IconButton, InputBase, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { difficulties } from "../recipes/recipesService";

const Header = () => {
    const categoriesList = useSelector((state) => state.categories.allCategories);

    const navigate = useNavigate()
    const location = useLocation();
    const [params] = useSearchParams();


    const buildQueryParams = (params) => {
        const query = new URLSearchParams(params).toString();
        return query ? `?${query}` : '';
    };

    const navigateWithFilters = (newParams) => {
        const search = params.get('search')
        const category = params.get('category')
        const difficulty = params.get('difficulty')
        let currentParams = {}
        if (search)
            currentParams.search = search
        if (category)
            currentParams.category = category
        if (difficulty)
            currentParams.difficulty = difficulty
        currentParams = { ...currentParams, ...newParams }

        const query = buildQueryParams(currentParams);
        navigate(`${location.pathname}${query}`);
    };

    const filterByCategory = (category) => {
        navigateWithFilters({ category: category.description });
    };

    const searchByName = (event) => {
        navigateWithFilters({ search: event.target.value });
    };

    const filterByDifficulty = (dif) => {
        navigateWithFilters({ difficulty: dif });
    };


    return (<>
        <div className="homeText">
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "70%", marginInline: "auto", paddingRight: "15px" }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="מה תרצו להכין היום?"
                    inputProps={{ 'aria-label': 'search recipe' }}
                    onInput={(event) => searchByName(event)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            <div className="categories flex-center">{categoriesList.map(cat => {
                return <Chip className='chip' key={cat._id} label={cat.description} sx={{ cursor: "pointer", backgroundColor: cat.description == params.get('category') && 'var(--primary-color)' }}
                    clickable onClick={() => { filterByCategory(cat) }}></Chip>;
            })}
                <Chip className='chip'
                    label='ביטול סינון'
                    sx={{ cursor: "pointer" }}
                    clickable
                    onClick={() => navigate(location.pathname)}>
                </Chip>
            </div>
            <div className="difficulty flex-center">
                {
                    difficulties.map(dif => <Chip key={dif} className='chip' variant="outlined" label={dif} sx={{ cursor: "pointer", backgroundColor: dif == params.get('difficulty') && 'var(--primary-color)' }}
                        clickable onClick={() => { filterByDifficulty(dif) }}></Chip>)
                }
            </div>
        </div>
    </>);
}

export default Header;