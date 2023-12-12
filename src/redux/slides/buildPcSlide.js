import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    buildpcItems: [],
    buildpcItemsSelected: [],
    shippingAddress: {
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
    isSuccessbuildpc: false
}

export const buildpcSlide = createSlice({
    name: 'buildpc',
    initialState,
    reducers: {
        addbuildpcProduct: (state, action) => {
            const { buildpcItem } = action.payload
            const itembuildpc = state?.buildpcItems?.find((item) => item?.product === buildpcItem.product)
            if (itembuildpc) {
                if (itembuildpc.amount <= itembuildpc.countInstock) {
                    itembuildpc.amount += buildpcItem?.amount
                    state.isSuccessbuildpc = true
                    state.isErrorbuildpc = false  
                }
            } else {
                state.buildpcItems.push(buildpcItem)
            }
        },
        resetbuildpc: (state) => {
            state.isSuccessbuildpc = false
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itembuildpc = state?.buildpcItems?.find((item) => item?.product === idProduct)
            const itembuildpcSelected = state?.buildpcItemsSelected?.find((item) => item?.product === idProduct)
            itembuildpc.amount++
            if (itembuildpcSelected) {
                itembuildpcSelected.amount++
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itembuildpc = state?.buildpcItems?.find((item) => item?.product === idProduct)
            const itembuildpcSelected = state?.buildpcItemsSelected?.find((item) => item?.product === idProduct)
            itembuildpc.amount--
            if (itembuildpcSelected) {
                itembuildpcSelected.amount--
            }
        },
        removebuildpcProduct: (state, action) => {
            const { idProduct } = action.payload
            const itembuildpc = state?.buildpcItems?.filter((item) => item?.product !== idProduct)
            const itembuildpcSelected = state?.buildpcItemsSelected?.filter((item) => item?.product !== idProduct)

            state.buildpcItems = itembuildpc
            state.buildpcItemsSelected = itembuildpcSelected
        },
        removeAllbuildpcProduct: (state, action) => {
            const { listChecked } = action.payload

            const itembuildpcs = state?.buildpcItems?.filter((item) => !listChecked.includes(item.product))
            const itembuildpcSelected = state?.buildpcItemsSelected?.filter((item) => !listChecked.includes(item.product))

            state.buildpcItems = itembuildpcs
            state.buildpcItemsSelected = itembuildpcSelected
        },
        selectedbuildpc: (state, action) => {
            const { listChecked } = action.payload
            const buildpcSelected = []
            state.buildpcItems.forEach((buildpc) => {
                if (listChecked.includes(buildpc.product)) {
                    buildpcSelected.push(buildpc)
                };
            });
            state.buildpcItemsSelected = buildpcSelected
        }
    },
})

// Action creators are generated for each case reducer function
export const { addbuildpcProduct, resetbuildpc, increaseAmount, decreaseAmount, removebuildpcProduct, removeAllbuildpcProduct, selectedbuildpc } = buildpcSlide.actions

export default buildpcSlide.reducer