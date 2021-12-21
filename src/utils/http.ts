import axios from 'axios'

// 构造Http类
class Http {
  public instance: any
  constructor() {
    // axios默认配置
    this.instance = axios.create({
      baseURL: 'http://192.168.1.109:3000/',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 请求拦截器，每次请求都会经过这个方法
    this.instance.interceptors.request.use(
      (config: any) => {
        // 可以判断是否携带cookie以及cookie是否过期
        return config
      },
      (error: any) => {
        // 错误抛出，由外层业务代码进行处理
        return Promise.reject(error)
      }
    )

    // 响应拦截器，每次响应都会先经过这个方法
    this.instance.interceptors.response.use(
      (response: any) => {
        if (response.status === 200) {
          return Promise.resolve(response)
        } else {
          return Promise.reject(response)
        }
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )
  }

  // 封装get方法
  get(url = {}, params = {}) {
    return new Promise((resolve, reject) => {
      this.instance
        .get(url, {
          params,
        })
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  // 封装post方法
  post(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      this.instance
        .post(url, params)
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

export default Http
