import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authFetch from "../lib/authFetch";
import { add } from "date-fns";

const accUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchChatHistory = createAsyncThunk(
  "aiChat/fetchChatHistory",
  async ()=> {
    const response = await authFetch(`${accUrl}/ai/chat/history`);
    return await response.json();
  }
);

export const addChat = createAsyncThunk(
    "aiChat/addChat",
    async( newChat , rejectWithValue ) => {
        try{
            const response = await authFetch(`${accUrl}/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(newChat),
            });
            if (!response.ok) {
                const errorText = await response.text(); // or use response.json() if it's JSON
                throw new Error(errorText);
              }
            return await response.json();
        }catch (error){
            return rejectWithValue({message})
        }
    }
)

const aiChatSlice = createSlice({
    name: "aiChat",
    initialState: {
        status: 'idle',
        error: null,
        newChat: null,
        history: [],
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
         .addCase(fetchChatHistory.pending, (state)=> {
            state.status = "loading";
         })
         .addCase(fetchChatHistory.fulfilled, (state, action)=>{
            state.status = "succeeded";
            state.history = action.payload;
         })
         .addCase(fetchChatHistory.rejected, (state, action)=>{
            state.status = "failed";
            state.error = action.error.message || "Rate Limit error ";;
         })
         .addCase(addChat.pending, (state)=> {
            state.status = "loading";
         })
         .addCase(addChat.fulfilled, (state, action) => {
            state.status ="succeeded";
            state.newChat = action.payload;
         })
         .addCase(addChat.rejected, (state,action ) =>{
            state.status = "failed";
            state.error = action.error.message || "Rate Limit error ";
         })
    }
})

export default aiChatSlice.reducer;