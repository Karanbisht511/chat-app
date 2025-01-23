import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Common Interfaces
interface Icredentials {
  username: string;
  password: string;
}

interface IresetCred extends Icredentials {
  token: string;
}

interface IForgotPass {
  username: string;
  email: string;
}

interface Isignup extends IForgotPass {
  mobile: string;
}

export interface IResponseState<T> {
  response: T;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}

// Initial States
export const createResponseState = <T>(initialData: T): IResponseState<T> => ({
  response: initialData,
  status: "idle",
  error: null,
});

const initialState = {
  loginState: createResponseState({
    isUserAuthenticated: false,
    token: "",
    userInfo: {
      email: "",
      mobile: "",
      username: "",
    },
    username: "",
  }),
  forgotPasswordState: createResponseState({ message: "" }),
  resetPasswordState: createResponseState({ message: "" }),
  signupState: createResponseState({ message: "" }),
};

// Async Thunks
const api = axios.create({ baseURL: "http://localhost:9000/api/users" });

export const loginUser = createAsyncThunk(
  "login",
  async (payload: Icredentials) => {
    const response = await api.post("/login", payload);
    sessionStorage.setItem("JWTToken", response.data.token);
    sessionStorage.setItem("username", response.data.username);
    return response.data;
  }
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (payload: IForgotPass) => {
    const response = await api.post("/forgotPassword", payload);
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (payload: IresetCred) => {
    const { username, password, token } = payload;
    const response = await api.post(
      "/resetPassword",
      { username, password },
      { headers: { Authorization: token } }
    );
    return response.data;
  }
);

export const signup = createAsyncThunk("signup", async (payload: Isignup) => {
  const response = await api.post("/signup", payload);
  return response.data;
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginState.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginState.status = "success";
        state.loginState.response = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginState.status = "failed";
        if (action.error.message) state.loginState.error = action.error.message;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordState.status = "loading";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordState.status = "success";
        state.forgotPasswordState.response = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordState.status = "failed";
        if (action.error.message)
          state.forgotPasswordState.error = action.error.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordState.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordState.status = "success";
        state.resetPasswordState.response = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordState.status = "failed";
        if (action.error.message)
          state.resetPasswordState.error = action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.signupState.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.signupState.status = "success";
        state.signupState.response = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.signupState.status = "failed";
        if (action.error.message)
          state.signupState.error = action.error.message;
      });
  },
});

export default loginSlice.reducer;

// import axios from "axios";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// interface Icredentials {
//     username: string,
//     password: string
// }

// interface IresetCred {
//     username: string,
//     password: string,
//     token: string
// }

// interface IForgotPass {
//     username: string,
//     email: string
// }

// interface Isignup {
//     username: string,
//     password: string,
//     email: string,
//     mobile: string,
// }

// interface IloginState {
//     loginDetails: {
//         isUserAuthenticated: boolean;
//         token: string;
//         userInfo: {
//             email: string;
//             mobile: string;
//             username: string;
//         };
//         username: string;
//     };
//     status: string;
//     error: string;
// }

// interface IforgotPass {
//     Response: {
//         message: string
//     };
//     status: string;
//     error: string;
// }

// interface IresetPass {
//     Response: {
//         message: string
//     };
//     status: string;
//     error: string;
// }

// interface IsignupPass {
//     Response: {
//         message: string
//     };
//     status: string;
//     error: string;
// }

// const loginState: IloginState = {
//     loginDetails: {
//         isUserAuthenticated: false,
//         token: '',
//         userInfo: {
//             email: '',
//             mobile: '',
//             username: ''
//         },
//         username: ''
//     },
//     status: 'idle',
//     error: ''
// }

// const forgotPasswordState: IforgotPass = {
//     Response: {
//         message: ''
//     },
//     status: 'idle',
//     error: ''
// }

// const resetPasswordState: IresetPass = {
//     Response: {
//         message: ''
//     },
//     status: 'idle',
//     error: ''
// }

// const signupState: IsignupPass = {
//     Response: {
//         message: ''
//     },
//     status: 'idle',
//     error: ''
// }

// const initialState = {
//     loginState,
//     forgotPasswordState,
//     resetPasswordState,
//     signupState
// }

// export const loginUser = createAsyncThunk(
//     'login',
//     async (payload: Icredentials) => {
//         const loginRes = await axios.post('http://localhost:9000/api/users/login', payload);
//         console.log('Result:', loginRes.data);
//         sessionStorage.setItem('JWTToken', loginRes.data?.token)
//         sessionStorage.setItem('username', loginRes.data?.username)
//         return loginRes.data;
//     }
// )

// export const forgotPassword = createAsyncThunk(
//     'forgotPassword',
//     async (payload: IForgotPass) => {
//         const { username, email } = payload
//         const result = await axios.post('http://localhost:9000/api/users/forgotPassword',
//             {
//                 username, email
//             }
//         );
//         return result.data;
//     }
// )

// export const resetPassword = createAsyncThunk(
//     'resetPassword',
//     async (payload: IresetCred) => {
//         const { username, password, token } = payload
//         const result = await axios.post('http://localhost:9000/api/users/resetPassword',
//             {
//                 username, password
//             },
//             {
//                 headers: {
//                     Authorization: token
//                 }
//             }
//         );
//         return result.data;
//     }
// )

// export const signup = createAsyncThunk(
//     'signupPassword',
//     async (payload: Isignup) => {
//         const result = await axios.post('http://localhost:9000/api/users/signup',
//             payload
//         );
//         return result.data;
//     }
// )

// const loginSlice = createSlice({
//     name: 'login',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.pending, (state) => {
//                 state.loginState.status = 'loading'
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.loginState.status = 'success';
//                 state.loginState.loginDetails = action.payload;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.loginState.status = 'failed';
//                 if (action.error.message)
//                     state.loginState.error = action.error.message;
//             })
//             .addCase(forgotPassword.pending, (state) => {
//                 state.forgotPasswordState.status = 'loading'
//             })
//             .addCase(forgotPassword.fulfilled, (state, action) => {
//                 state.forgotPasswordState.status = 'success';
//                 state.forgotPasswordState.Response = action.payload;
//             })
//             .addCase(forgotPassword.rejected, (state, action) => {
//                 state.forgotPasswordState.status = 'failed';
//                 if (action.error.message)
//                     state.forgotPasswordState.error = action.error.message;
//             })
//             .addCase(resetPassword.pending, (state) => {
//                 state.resetPasswordState.status = 'loading'
//             })
//             .addCase(resetPassword.fulfilled, (state, action) => {
//                 state.resetPasswordState.status = 'success';
//                 state.resetPasswordState.Response = action.payload;
//             })
//             .addCase(resetPassword.rejected, (state, action) => {
//                 state.resetPasswordState.status = 'failed';
//                 if (action.error.message)
//                     state.resetPasswordState.error = action.error.message;
//             })
//             .addCase(signup.pending, (state) => {
//                 state.signupState.status = 'loading'
//             })
//             .addCase(signup.fulfilled, (state, action) => {
//                 state.signupState.status = 'success';
//                 state.signupState.Response = action.payload;
//             })
//             .addCase(signup.rejected, (state, action) => {
//                 state.signupState.status = 'failed';
//                 if (action.error.message)
//                     state.signupState.error = action.error.message;
//             })
//             ;
//     }
// });

// export default loginSlice.reducer;
