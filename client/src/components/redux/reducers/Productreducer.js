const products = []

export const getProductsreducer = (state = { products }, action) => {
    switch (action.type) {
        case "SUCCESS_GET_PRODUCT":
            return { products: action.payload }
        case "FAIL_GET_PRODUCT":
            return { products: action.payload }
        default: return state;
    }
}   