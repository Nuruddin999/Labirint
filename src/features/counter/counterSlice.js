import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    initPoint: 0,
    currentPoint: 0,
    turns: ["up", "down", "left", "right"],
    randomTurns: [],
    stepConvertor: {
        up: -3,
        down: 3,
        left: -1,
        right: 1
    },
    endPoint: 0,
    isRight: false,
    isStart: false
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//     'counter/fetchCount',
//     async(amount) => {
//         const response = await fetchCount(amount);
//         // The value we return becomes the `fulfilled` action payload
//         return response.data;
//     }
// );

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        changeState: (state, action) => {
            let { field, value } = action.payload
            state[field] = value
        },
        setInit: (state, action) => {
            state.initPoint = action.payload
            state.currentPoint = action.payload
            state.isStart = true
        },
        setPointAndRandom: (state, action) => {
            let { current, random } = action.payload
            state.currentPoint += current
            state.randomTurns = random
        },
        clear: (state) => {
            state.currentPoint = 0
            state.randomTurns = []
            state.endPoint = 0
            state.initPoint = 0
            state.isRight = false
            state.isStart = false
        }

    },
});

export const { changeState, setInit, setPointAndRandom, clear } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state) => state.counter;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//         dispatch(incrementByAmount(amount));
//     }
// };

export default counterSlice.reducer;