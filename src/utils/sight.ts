import axios from 'axios'

// 构造获取景点的API类

class GetSight {
  public instance: any
  // 默认配置
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:2333',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: any) => {
        return config
      },
      (err: any) => {
        return Promise.reject(err)
      }
    )
    // 响应拦截器
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

  public get(url: string, params: any = {}): any {
    return new Promise((resolve, reject) => {
      this.instance
        .get(url, {
          params,
        })
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }
}

export default GetSight
