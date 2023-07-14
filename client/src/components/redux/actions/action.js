//middleware
//in redux store one can do synchronous updates only
//MW helps to use it asynchronously  "redux-thunk"

const backend = "http://localhost:8005";

export const getProducts = () => async (dispatch) => {
    try {
        const data = await fetch(`${backend}/getproducts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const res = await data.json();
        dispatch({ type: "SUCCESS_GET_PRODUCT", payload: res });
    }
    catch (error) {
        dispatch({ type: "FAIL_GET_PRODUCT", payload: error.response });
    }
}