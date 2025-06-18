import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllCategories = createAsyncThunk("category-getAll", async () => {
    try {
        let res = await fetch('http://localhost:5000/categories/getallcategories')
        res = await res.json()
        return res
    }
    catch (error) {
        console.log(error);
    }
})

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        allCategories: [],
        status: null
    },
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCategories.fulfilled, (state, action) => {
            state.allCategories = action.payload
            state.status = "fulfilled"
        }).addCase(getAllCategories.rejected, (state, action) => {
            state.status = "failed!!"
        }).addCase(getAllCategories.pending, (state, action) => {
            state.status = "loading..."
        })
    }
})

export default categorySlice.reducer