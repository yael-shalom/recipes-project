import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRecipes } from "../recipes/recipeSlice";
// import { useDispatch } from "react-redux";
// import { getAllRecipes } from "../recipes/recipeSlice";

const getTokenExpiration = (token) => {
    const payload = token.split('.')[1]; // החלק השני של ה-JWT
    const decodedPayload = JSON.parse(atob(payload)); // המר מ-base64url ל-JSON
    const expirationTime = decodedPayload.exp; // קח את תאריך התוקף
    const expirationDate = new Date().getTime() + expirationTime * 1000; // זמן פג תוקף

    return expirationDate;
};

export const addUser = createAsyncThunk("user-add", async (user, { dispatch }) => {
    const res = await fetch('http://localhost:5000/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })

    const data = await res.json();

    if (!res.ok)
        throw new Error(data);

    const currentUser = { _id: data.user._id, token: data.token, tokenExpiration: getTokenExpiration(data.token) };
    dispatch(updateCurrentUser(currentUser));

    return data;
});

export const login = createAsyncThunk("user-login", async (user, { dispatch }) => {
    try {
        const res = await fetch('http://localhost:5000/users/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (!res.ok)
            throw new Error(data);

        const currentUser = { _id: data._id, username: data.username, token: data.token, tokenExpiration: getTokenExpiration(data.token) };
        dispatch(updateCurrentUser(currentUser));

        return data
    }
    catch (error) {
        throw error
    }
});

export const logout = createAsyncThunk("user-logout", async (user, { dispatch }) => {
    dispatch(updateCurrentUser(null));
});

// const dispatch = useDispatch()

const userSlice = createSlice({
    name: 'users',
    initialState: {
        currentUser: null,
        allUsers: [],
        status: null
    },
    reducers: {
        setStatus(state, action) {
            state.status = null;
        },
        setUser(state, action) {
            if (action.payload) {
                localStorage.setItem('currentUser', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('currentUser');
            }

            state.currentUser = action.payload;
        },
        // getUserFromLocal(state, action) {
        //     const currentUser = localStorage.getItem('currentUser');
        //     state.currentUser = currentUser ? JSON.parse(currentUser) : null;
        // }
        // updateUser(state, action) {
        //     const i = state.allUsers.users.findIndex(r => r._id == action.payload._id)
        //     state.allUsers.users.splice(i, 1)
        //     state.allUsers.users.push(action.payload)
        // },
        // deleteUser(state, action) {
        //     state.allUsers.users = state.allUsers.users.filter(user => user._id !== action.payload)
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.allUsers = [...state.allUsers, action.payload]
            state.status = "fulfilled"
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            // if(state.currentUser?._id != currentUser._id)
            //     dispatch(getAllRecipes)
            state.currentUser = currentUser
        }).addCase(addUser.rejected, (state, action) => {
            state.status = "failed!!"
        }).addCase(addUser.pending, (state, action) => {
            state.status = "loading..."
        })

        builder.addCase(login.fulfilled, (state, action) => {
            state.allUsers = [...state.allUsers, action.payload]
            state.status = "fulfilled"
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            // if(state.currentUser?._id != currentUser._id)
            //     dispatch(getAllRecipes)
            state.currentUser = currentUser
        }).addCase(login.rejected, (state, action) => {
            state.status = "failed!!"
        }).addCase(login.pending, (state, action) => {
            state.status = "loading..."
        })
    }
});
export const updateCurrentUser = (currentUser) => async (dispatch) => {
    dispatch(userSlice.actions.setUser(currentUser));
    await dispatch(getAllRecipes());
};


export const { setStatus, setUser } = userSlice.actions

export default userSlice.reducer