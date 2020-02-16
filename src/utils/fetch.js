import Taro from '@tarojs/taro'

const request = (method = 'GET') => ({ url, data }) => {
  if (method === 'GET') {
    url += '?'
    for (let key in data) {
      url = url + `${key}=${data[key]}`
    }
  }
  return new Promise((resolve, reject) => {
    Taro.request({
     method,
     url,
     data,
    })
      .then(({data: DATA}) => resolve(DATA.data))
      .catch(err => reject(err))
  })
}

export default {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
}
