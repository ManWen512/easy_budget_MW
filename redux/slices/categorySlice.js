import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${mainUrl}/categories`);
      if (!response.ok) {
        const errorText = await response.text(); // or use response.json() if it's JSON
        throw new Error(errorText);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (newCategory, { dispatch, rejectWithValue }) => {
    try {
      const response = await authFetch(`${mainUrl}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorText = await response.text(); // or use response.json() if it's JSON
        throw new Error(errorText);
      }

      dispatch(fetchCategories()); // Refresh category list after adding
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Edit a category
export const editCategory = createAsyncThunk(
  "category/editCategory",
  async (updatedCategory, { dispatch, rejectWithValue }) => {
    try {
      if (!updatedCategory.id) {
        throw new Error("Category ID is required for editing.");
      }

      const response = await authFetch(`${mainUrl}/categories/${updatedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error("Failed to update category");

      dispatch(fetchCategories()); // Refresh category list after editing
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { dispatch, rejectWithValue }) => {
    try {
      const response = await authFetch(`${mainUrl}/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text(); // or use response.json() if it's JSON
        throw new Error(errorText);
      }

      dispatch(fetchCategories()); // Refresh category list after deleting
      return categoryId; // Return deleted category ID if needed
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {}, // No reducers needed since we handle everything with async thunks
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(editCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
