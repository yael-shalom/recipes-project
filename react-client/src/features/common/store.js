import { configureStore } from "@reduxjs/toolkit";
import recipe from '../recipes/recipeSlice'
import user, { updateCurrentUser } from '../users/userSlice'
import category from '../categories/categorySlice'

export const store = configureStore({
    reducer: {
        recipes: recipe,
        users: user,
        categories: category
    }
});

(() => {
    let currentUser = localStorage.getItem('currentUser');
    currentUser = currentUser ? JSON.parse(currentUser) : null;
    store.dispatch(updateCurrentUser(currentUser));
})();