import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const checkTokenExpiration = () => {
    const tokenExpiration = JSON.parse(localStorage.getItem(`currentUser`)).tokenExpiration;
    if (tokenExpiration && new Date().getTime() > tokenExpiration) {
        localStorage.removeItem(`currentUser`);
        alert("Session expired. Please log in again.");
        // כאן תוכל להוסיף קוד להנחות את המשתמש להיכנס מחדש
    }
};

export const getAllRecipes = createAsyncThunk("recipe-getAll", async () => {
    const currentUser = JSON.parse(localStorage.getItem(`currentUser`));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/getallrecipes`, {
        method: `GET`,
        headers: {
            Authorization: `Bearer ` + currentUser?.token
        },
    })

    const data = await res.json();

    if (!res.ok)
        throw new Error(data);
    return data;
})

export const getRecipesByUser = createAsyncThunk("recipe-getByUser", async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/getRecipesByUser/` + id)
    const data = await res.json();

    if (!res.ok)
        throw new Error(data);
    return data;
})

export const addRecipe = createAsyncThunk("recipe-add", async (formData) => {
    const currentUser = JSON.parse(localStorage.getItem(`currentUser`));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/addRecipe`, {
        method: `POST`,
        headers: {
            Authorization: `Bearer ` + currentUser.token
        },
        body: formData
    })
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data);
    }

    return data;
})

export const updateRecipe = createAsyncThunk("recipe-update", async ({ formData, id }) => {
    const currentUser = JSON.parse(localStorage.getItem(`currentUser`));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/updateRecipes/${id}`, {
        method: `PUT`,
        headers: {
            Authorization: `Bearer ` + currentUser.token
        },
        body: formData
    })

    const data = await res.json();

    if (!res.ok)
        throw new Error(data);
    return data;
})

export const deleteRecipe = createAsyncThunk("recipe-delete", async (id) => {
    const currentUser = JSON.parse(localStorage.getItem(`currentUser`));
    const res = await fetch(`${import.meta.env.VITE_API_URL}/recipes/deleteRecipe/${id}`, {
        method: `DELETE`,
        headers: {
            Authorization: `Bearer ` + currentUser.token
        }
    })

    if (!res.ok)
        throw new Error(data);

    return id;
})

const recipeSlice = createSlice({
    name: `recipes`,
    initialState: {
        allRecipes: [],
        status: null,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getAllRecipes.fulfilled, (state, action) => {
            state.allRecipes = action.payload
            state.status = "fulfilled"
        }).addCase(getAllRecipes.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed!!"
        }).addCase(getAllRecipes.pending, (state, action) => {
            state.status = "loading..."
        })

        builder.addCase(getRecipesByUser.fulfilled, (state, action) => {
            state.allRecipes = action.payload
            state.status = "fulfilled"
        }).addCase(getRecipesByUser.rejected, (state, action) => {
            state.allRecipes = [];
            state.error = action.payload;
            state.status = "failed!!"
        }).addCase(getRecipesByUser.pending, (state, action) => {
            state.status = "loading..."
        })

        builder.addCase(addRecipe.fulfilled, (state, action) => {
            state.allRecipes = [...state.allRecipes, action.payload]
            state.status = "fulfilled"
        }).addCase(addRecipe.rejected, (state, action) => {
            state.allRecipes = [];
            state.error = action.payload;
            state.status = "failed!!"
        }).addCase(addRecipe.pending, (state, action) => {
            state.status = "loading..."
        })

        builder.addCase(deleteRecipe.fulfilled, (state, action) => {
            state.allRecipes = state.allRecipes.filter(recipe => recipe._id !== action.payload)
            state.status = "fulfilled"
        }).addCase(deleteRecipe.rejected, (state, action) => {
            state.allRecipes = [];
            state.error = action.payload;
            state.status = "failed!!"
        }).addCase(deleteRecipe.pending, (state, action) => {
            state.status = "loading..."
        })

        builder.addCase(updateRecipe.fulfilled, (state, action) => {
            const i = state.allRecipes.findIndex(r => r._id == action.payload._id)
            state.allRecipes.splice(i, 1)
            state.allRecipes.push(action.payload)
            state.status = "fulfilled"
        }).addCase(updateRecipe.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed!!"
        }).addCase(updateRecipe.pending, (state, action) => {
            state.status = "loading..."
        })


    }
})


export default recipeSlice.reducer