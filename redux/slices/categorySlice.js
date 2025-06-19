import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const mainUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${mainUrl}/category/all`);
      if (!response.ok) throw new Error("Failed to fetch categories");
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
      const response = await fetch(`${mainUrl}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error("Failed to add category");

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

      const response = await fetch(`${mainUrl}/category?id=${updatedCategory.id}`, {
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
      const response = await fetch(`${mainUrl}/category?id=${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

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
