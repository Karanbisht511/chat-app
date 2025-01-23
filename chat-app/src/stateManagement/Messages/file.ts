import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createResponseState } from "../Authentication/Authentication";

interface IfileData {
  fileName: string;
  message?: string;
  from: string;
  toSend: string;
  file: File;
}

const initialState = {
  uploadState: createResponseState(""),
  downloadState: createResponseState(""),
};

export const fileUpload = createAsyncThunk(
  "fileUpload",
  async (input: IfileData) => {
    const formData = new FormData();
    formData.append("file", input.file);
    formData.append("fileName", input.fileName);
    formData.append("message", input.fileName);
    formData.append("from", input.from);
    formData.append("toSend", input.toSend);

    const result = await axios.post(
      "http://localhost:9000/api/messages/uploadFile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
        },
      }
    );
    return result.data.message;
  }
);

export const fileDownload = createAsyncThunk(
  "fileDownload",
  async (input: { filename: string }) => {
    const result = await axios.get(
      `http://localhost:9000/api/messages/download/${input.filename}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
        },
      }
    );
    return window.URL.createObjectURL(result.data.message);
  }
);

const fileSlice = createSlice({
  name: "fileSlice",
  initialState,
  reducers: {
    cleanUpFileState: (state) => {
      state.downloadState.response ="";
      state.downloadState.error = null;
      state.downloadState.status = "idle";
      state.uploadState.response = "";
      state.uploadState.status = "idle";
      state.uploadState.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fileUpload.pending, (state) => {
        state.uploadState.status = "loading";
      })
      .addCase(fileUpload.fulfilled, (state, action) => {
        state.uploadState.status = "success";
        state.uploadState.response = action.payload;
      })
      .addCase(fileUpload.rejected, (state, action) => {
        state.uploadState.status = "failed";
        if (action.error.message)
          state.uploadState.error = action.error.message;
      })
      .addCase(fileDownload.pending, (state) => {
        state.downloadState.status = "loading";
      })
      .addCase(fileDownload.fulfilled, (state, action) => {
        state.downloadState.status = "success";
        state.downloadState.response = action.payload;
      })
      .addCase(fileDownload.rejected, (state, action) => {
        state.downloadState.status = "failed";
        if (action.error.message)
          state.downloadState.error = action.error.message;
      });
  },
});

export default fileSlice.reducer;
export const { cleanUpFileState } = fileSlice.actions;
