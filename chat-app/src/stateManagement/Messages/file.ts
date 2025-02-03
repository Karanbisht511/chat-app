import { api } from "../api";
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
  uploadState: createResponseState({ message: "", fileName: "" }),
  downloadState: createResponseState({ fileName: "" }),
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

    const result = await api.post("/messages/uploadFile", formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
      },
    });
    return result.data;
  }
);

export const fileDownload = createAsyncThunk(
  "fileDownload",
  async (input: { filename: string }) => {
    const response = await api.get(`/messages/download/${input.filename}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
        "Content-Type": "application/json",
      },
    });

    // Create blob URL from response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const blobUrl = window.URL.createObjectURL(blob);

    // Create and trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download =
      input.filename ||
      response.headers["content-disposition"]?.split("filename=")[1] ||
      "downloaded-file";

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    return {
      success: true,
      fileName: link.download,
      contentType: response.headers["content-type"],
    };
  }
);

const fileSlice = createSlice({
  name: "fileSlice",
  initialState,
  reducers: {
    cleanUpFileState: (state) => {
      state.downloadState.response = { fileName: "" };
      state.downloadState.error = null;
      state.downloadState.status = "idle";
      state.uploadState.response = { message: "", fileName: "" };
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
        state.uploadState.response.message = action.payload.message;
        state.uploadState.response.fileName = action.payload.fileName;
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
        state.downloadState.response.fileName = action.payload.fileName;
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
