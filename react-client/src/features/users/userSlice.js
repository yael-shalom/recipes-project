import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRecipes } from "../recipes/recipeSlice";

const getTokenExpiration = (token) => {
    const payload = token.split(`.`)[1]; // החלק השני של ה-JWT
    const decodedPayload = JSON.parse(atob(payload)); // המר מ-base64url ל-JSON
    const expirationTime = decodedPayload.exp; // קח את תאריך התוקף
    const expirationDate = new Date().getTime() + expirationTime * 1000; // זמן פג תוקף

    return expirationDate;
};

export const addUser = createAsyncThunk("user-add", async (user, { dispatch }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/signup`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(user)
    })

    const data = await res.json();

    if (!res.ok)
        throw new Error(data);

    const currentUser = { ...data, tokenExpiration: getTokenExpiration(data.token) };
    dispatch(updateCurrentUser(currentUser));

    return data;
});

export const login = createAsyncThunk("user-login", async (user, { dispatch }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/signin`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok)
        throw new Error(data);

    const currentUser = { ...data, tokenExpiration: getTokenExpiration(data.token) };
    dispatch(updateCurrentUser(currentUser));

    return data;
});

export const logout = createAsyncThunk("user-logout", async (user, { dispatch }) => {
    dispatch(updateCurrentUser(null));
});

const userSlice = createSlice({
    name: `users`,
    initialState: {
        currentUser: null,
        status: null,
        error: null
    },
    reducers: {
        setStatus(state, action) {
            state.status = null;
        },
        setUser(state, action) {
            if (action.payload) {
                localStorage.setItem(`currentUser`, JSON.stringify(action.payload));
            } else {
                localStorage.removeItem(`currentUser`);
            }

            state.currentUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.status = "fulfilled"
        }).addCase(addUser.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed!!"
        }).addCase(addUser.pending, (state, action) => {
            state.status = "loading..."
        })

        builder.addCase(login.fulfilled, (state, action) => {
            state.status = "fulfilled"
        }).addCase(login.rejected, (state, action) => {
            state.error = action.payload;
            state.status = "failed!!";
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