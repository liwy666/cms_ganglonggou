import axios from 'axios';
import Qs from 'qs'
import {Message} from 'element-ui';

axios.defaults.timeout = 0;
axios.defaults.baseURL = process.env.VUE_APP_MODE === 'production' ? 'https://api.ganglonggou.com/api/v1/cms'
    : 'https://test-api.ganglonggou.com/api/v1/cms';


//http request 拦截器
axios.interceptors.request.use(
    config => {
        config.validateStatus = function (status) {
            return status >= 200 && status <= 400; // 默认的
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.error_code !== undefined) {
            Message.error(response.data.msg);
            return false;
        } else {
            return response.data;
        }
    },
    error => {
        Message.error('发生未知错误：' + error);
        return false;
    }
);


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装单个图片上传方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function imgUpload(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, Qs.stringify(data), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .then(response => {
                resolve(response);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}