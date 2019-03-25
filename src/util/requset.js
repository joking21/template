import axios from "axios";
import { Notification } from 'element-ui';
import store from '../store';
import router from '../router';
// charset=UTF-8
axios.defaults.headers.common['Content-Type'] = "application/json";
function success(msg) {
    Notification({
        title: '成功',
        message: msg,
        type: 'success',
        duration: 3000,
    });
}
function failer(msg) {
    Notification({
        title: '错误',
        dangerouslyUseHTMLString: true,
        message: msg,
        type: 'error',
        duration: 3000,
    });
}
export function post(url, para, successFun, errorFun) {
    if (store.state.token) {
        axios.defaults.headers.common["token"] = store.state.token;
    }
    axios.post(url, para)
        .then(function (response) {
            if (response.data.code === 200) {
                success(response.data.msg);
                if (successFun) successFun(response.data.data);
            } 
            else if(response.data.code === 401){
                failer(response.data.msg);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                store.commit("changeLogin");
                router.push({ path: "/login" });
            }
            else {
                if (errorFun) errorFun();
                failer(response.data.msg);
            }
        })
        .catch(function (error) {
            failer(error);
        });
}

export function get(url, para, successFun, errorFun) {
    if (store.state.token) {
        axios.defaults.headers.common["token"] = store.state.token;
    }
    axios.get(url, {
        params: para
    })
        .then(function (response) {
            if (response.data.code === 200) {
                if (successFun) successFun(response.data.data);
            }
            else if(response.data.code === 401){
                failer(response.data.msg);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                store.commit("changeLogin");
                router.push({ path: "/login" });
            }
            else {
                if (errorFun) errorFun();
                failer(response.data.msg);
            }
        })
        .catch(function (error) {
            failer(error);
        });
}
