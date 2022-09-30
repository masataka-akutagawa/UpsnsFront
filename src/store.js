import { createStore} from 'vuex'
import { VuexPersistence } from 'vuex-persist'

const vuexPersist = new VuexPersistence({
    storage: sessionStorage
})

export default createStore({
    //どういうデータを保存するか
    state: {
        userData: {},
        isLoggedIn: { 
            name:"",
            password:"",
            isLogin:false
        },
        token: "",
        replyData: {},
        pageNumber:1,
    },
    //storeにあるデータを取ってくる
    getters: {
          isLoggedIn:(state)=>()=> {
            return state.isLoggedIn;
          },
          getUserId:(state)=>()=> {
            return state.userData.data.id;
          },
          getIsLogin:(state)=>()=> {
            return state.isLoggedIn.isLogin
          },
          getToken:(state)=>()=> {
            return state.token
          },
          getReply:(state)=>()=> {
            return state.replyData
          },
          getPageNumber: (state) =>()=> {
            return state.pageNumber
          },
        },
    //データを保存、変更、削除をする
    mutations: {
        RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION,
        login (state, isLoggedIn){
            state.isLoggedIn = isLoggedIn;
        },
        updateUserId(state, userId) {
            state.userId = userId;
        },
        insertUser(state, userData) {
            state.userData = userData;
        },
        setToken(state, token) {
            state.token = token;
        },
        setReplyId(state, reply) {
            state.replyData = reply;
        },
        updatePageNumber(state, pageNumber){
          state.pageNumber = pageNumber;
        },
    },
    plugins: [vuexPersist.plugin]
})