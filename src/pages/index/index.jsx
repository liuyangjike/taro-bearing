/* eslint-disable react/sort-comp */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Canvas } from '@tarojs/components'
import request from '../../utils/fetch'
import { getWordList, addMesCount, getOpenIdByCode } from '../../constants'
import './index.styl'

const LIMIT = 50
const MES_TIME_LIST = [10, 100, 230, 380, 600, 900, 1200] // 触发订阅提示
const TEML_LIST = [
  '1fok9V5SyJFHWyscnOUIWXpNO4fjN6Oyz-vs5jcScHQ',
  '1fok9V5SyJFHWyscnOUIWbBXcnGTCMY73xZ8d9dBNyE',
  '1fok9V5SyJFHWyscnOUIWZ2qqyHZrZg08w7jJlTEpho'
]
const TIMES = [40, 130, 250, 400, 600, 800, 1000] // 触发订阅


let OPEN_ID = ''

function getInitial() {
  return parseInt(Taro.getStorageSync('initial')) || 0
}

function getPageNo(index) {
  return Math.floor(index / LIMIT) + 1
}

function getRest(initial) {
  return initial % LIMIT
}

export default class Index extends Component {

  config = {
    navigationBarBackgroundColor: '#0E82FF',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '又来了一碗',
    backgroundColor: '#f7f8fa',
    backgroundColorTop: '#0E82FF',
    backgroundColorBottom: '#f7f8fa',
    enablePullDownRefresh: true,
  }

  constructor() {
    this.state = {
      initial: getInitial(),
      current: {},
      wordList: [],
      total: parseInt(Taro.getStorageSync('total')) || 0,
      hasPoster: true,
      isLoading: true
    }
    this.sharePosterRef = el => this.sharePoster = el
    this.OPEN_ID = ''

  }
  
  componentWillMount () {
    // this.fetchData()
  }
  
  componentDidMount () {
    // this.getOpenIdByCode()
    this.drawBearing()
  }
  
  componentWillUnmount () { }
  
  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage() {
    return {
      title: '又来了一碗',
      path: '/pages/index/index'
    }
  }


  onPullDownRefresh() {

  }

  drawBearing = () => {

    function drawRoundedRect(ctx, x, y, width, height, d, r, ball, fill, stroke) {
      ctx.beginPath() // draw top and top right corner 

      // outer
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
      ctx.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
      ctx.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
      ctx.arcTo(x, y, x + r, y, r)

      ctx.moveTo(x , y + (height - d) / 2)
      ctx.lineTo(x + width , y + (height - d) / 2)
      ctx.moveTo(x , y + (height - d) / 2 + d)
      ctx.lineTo(x + width , y + (height - d) / 2 + d)

      // ball
      const x2 = x + width/ 2
      const y2 =  y + (height - d) / 4
      ctx.moveTo( x2 + ball , y2)
      ctx.arc(x2, y2, ball, 0, 2 * Math.PI)
      const x3 = x + width/ 2
      const y3 =  y + height - (height - d) / 4
      ctx.moveTo( x3 + ball , y3)
      ctx.arc(x3, y3, ball, 0, 2 * Math.PI)

      // line
      const x4 = x
      const y4 =  y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)
      ctx.moveTo( x4 , y4)
      ctx.lineTo( x4 + width/2 - ball* Math.sin(Math.PI / 4) , y4)
      ctx.moveTo( x4 + width/2 + ball* Math.sin(Math.PI / 4), y4)
      ctx.lineTo( x4 + width, y4)

      const x5 = x
      const y5 =  y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
      ctx.moveTo( x5 , y5)
      ctx.lineTo( x5 + width/2 - ball* Math.sin(Math.PI / 4) , y5)
      ctx.moveTo( x5 + width/2 + ball* Math.sin(Math.PI / 4), y5)
      ctx.lineTo( x5 + width, y5)


      const x6 = x
      const y6 =  y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
      ctx.moveTo( x6 , y6)
      ctx.lineTo( x6 + width/2 - ball* Math.sin(Math.PI / 4) , y6)
      ctx.moveTo( x6 + width/2 + ball* Math.sin(Math.PI / 4), y6)
      ctx.lineTo( x6 + width, y6)

      const x7 = x
      const y7 =  y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4)
      ctx.moveTo( x7 , y7)
      ctx.lineTo( x7 + width/2 - ball* Math.sin(Math.PI / 4) , y7)
      ctx.moveTo( x7 + width/2 + ball* Math.sin(Math.PI / 4), y7)
      ctx.lineTo( x7 + width, y7)

      if (fill) { ctx.fill() }
      if (stroke) { ctx.stroke() }
      ctx.draw()
  }


  function drawRoundedRect1(ctx, x, y, width, height, d, r, ball, fill, stroke) {
    ctx.beginPath() // draw top and top right corner 
    // outer

    // 1. outer 上半
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
    const x1 = x + width
    const y1 = y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x1 , y1)

    const x2 = x + width/2 + ball* Math.sin(Math.PI / 4)
    const y2 = y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x2 , y2)

    const x3 = x + width/ 2
    const y3 =  y + (height - d) / 4
    ctx.arc(x3, y3, ball, -Math.PI / 4, - Math.PI * 3 / 4, true)

    const x4 = x
    const y4 = y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x4 , y4)

    const x5 = x
    const y5 = y + r
    ctx.lineTo(x5 , y5)

    ctx.arcTo(x , y, x + r, y, r); // draw bottom and bottom left corner 
    context.setStrokeStyle("#111")

    ctx.fillStyle = "#66bbdd"
    ctx.fill()

     // 2. inner 上半
    const x6 = x + width
    const y6 = y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.moveTo(x6, y6)

    const x7 = x + width/2 + ball* Math.sin(Math.PI / 4)
    const y7 = y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x7 , y7)

    const x8 = x + width/ 2
    const y8 =  y + (height - d) / 4
    ctx.arc(x8, y8, ball, - Math.PI *  7/ 4, - Math.PI * 5 / 4, false)

    const x9 = x
    const y9 = y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x9 , y9)

    const x10 = x
    const y10 = y + (height - d) / 2 
    ctx.lineTo(x10 , y10)

    const x11 = x + width
    const y11 = y + (height - d) / 2
    ctx.lineTo(x11 , y11)

    const x12 = x + width
    const y12 = y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x12 , y12)
    ctx.fill()


    // 4. inner 下半
    const x14 = x + width
    const y14 = y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.moveTo(x14, y14)

    const x15 = x + width/2 + ball* Math.sin(Math.PI / 4)
    const y15 = y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x15 , y15)

    const x16 = x + width/ 2
    const y16 =  y + height - (height - d) / 4
    ctx.arc(x16, y16, ball, - Math.PI / 4, - Math.PI * 3 / 4, true)

    const x17 = x 
    const y17 = y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x17 , y17)

    const x18 = x 
    const y18 = y + height - (height - d) / 2
    ctx.lineTo(x18 , y18)

    const x19 = x + width
    const y19 = y + height - (height - d) / 2
    ctx.lineTo(x19 , y19)

    const x20 = x + width
    const y20 = y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x20 , y20)
    ctx.fill()

    // 5. outer 下半
    const x21 = x + width
    const y21 = y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.moveTo(x21, y21)

    const x22 = x + width/2 + ball* Math.sin(Math.PI / 4)
    const y22 = y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x22 , y22)

    const x23 = x + width/ 2
    const y23 =  y + height - (height - d) / 4
    ctx.arc(x23, y23, ball, Math.PI / 4, Math.PI * 3 / 4, false)

    const x24 = x 
    const y24 = y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    ctx.lineTo(x24 , y24)

    ctx.arcTo(x , y + height, x + r, y + height, r); // draw right side and bottom right corner 
    ctx.arcTo(x + width , y + height, x + width, y + height - r, r); // draw right side and bottom right corner 
    ctx.lineTo(x21 , y21)
    ctx.fill()

    // // 3. 闭合线
    ctx.moveTo(x1, y1)
    ctx.lineTo(x6 , y6)

    ctx.moveTo(x4, y4)
    ctx.lineTo(x9 , y9)

    ctx.moveTo(x14, y14)
    ctx.lineTo(x21 , y21)

    ctx.moveTo(x17, y17)
    ctx.lineTo(x24 , y24)

    ctx.moveTo(x11, y11)
    ctx.lineTo(x19 , y19)

    ctx.moveTo(x10, y10)
    ctx.lineTo(x18 , y18)

    ctx.moveTo(x2, y2)
    ctx.arc(x3, y3, ball, - Math.PI / 4, Math.PI  / 4, false)

    const x13 = x + width/2 - ball* Math.sin(Math.PI / 4)
    const y13 = y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)

    ctx.moveTo(x13, y13)
    ctx.arc(x3, y3, ball, - Math.PI * 3 / 4, Math.PI * 3 / 4, true)


    ctx.moveTo(x15, y15)
    ctx.arc(x16, y16, ball, - Math.PI / 4, Math.PI  / 4, false)

    const x25 = x + width/2 - ball* Math.sin(Math.PI / 4)
    const y25 = y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    ctx.moveTo(x25, y25)
    ctx.arc(x16, y16, ball, - Math.PI * 3 / 4, Math.PI * 3 / 4, true)




    // const x19 = x + width
    // const y19 = y + height - (height - d) / 2
    // ctx.lineTo(x19 , y19)

    // const x20 = x + width
    // const y20 = y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4)
    // ctx.lineTo(x20 , y20)
    // ctx.fill()



 
    //  const x9 = x
    //  const y9 = y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    //  ctx.lineTo(x9 , y9)
 
    //  const x10 = x
    //  const y10 = y + (height - d) / 2 
    //  ctx.lineTo(x10 , y10)
 
    //  const x11 = x + width
    //  const y11 = y + (height - d) / 2
    //  ctx.lineTo(x11 , y11)
 
    //  const x12 = x + width
    //  const y12 = y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)
    //  ctx.lineTo(x12 , y12)
    //  ctx.fill()








    ctx.stroke()




    ctx.draw()

}

    // 使用 wx.createContext 获取绘图上下文 context
    var context = Taro.createCanvasContext('bearing')

    context.setStrokeStyle("#111")
    context.setLineWidth(1)
    // context.rect(0, 0, 70, 220)
    drawRoundedRect1(context, 100, 200, 70, 220, 80, 5, 20, false, true)
    // context.stroke()
    // context.draw()
    // context.fill()

 
  }

  fetchData = () => {
    const { initial, total: num } = this.state
    let page = getPageNo(initial)
    if (num && page * LIMIT >= num) {
      page = 1
    }
    try {
      request.get({
        url: getWordList,
        data: {
          size: LIMIT,
          page
        }
      })
        .then(res => {
          const { list, total } = res
          list.forEach((item, index) => {
            item.index = index
          })
          this.setState({
            wordList: list,
            current: list[getRest(initial)],
            isLoading: false,
            total,
            initial: 0
          })
          Taro.setStorageSync('total', total)
        })
    } catch (err) {
      Taro.showToast({
        title: '网路不给力',
        icon: 'none',
        duration: 2000
      })
    }
  }

  loadImgFail = () => {
    this.setState({
      hasPoster: false
    })
  }
  showToast = () => {
    Taro.showToast({
      title: '点击左下角,开启订阅消息,会推送最新的毒鸡汤',
      duration: 4000,
      icon: 'none'
    })
  }

  handleMes = () => {
    // 微信订阅消息机制
    Taro.requestSubscribeMessage({
      tmplIds: TEML_LIST,
      success (res) {
        const addData = TEML_LIST.map((item, index) => {
          return {
            type: index,
            openId: OPEN_ID,
            make: res[item] === 'accept',
            temlId: item
          }
        })
        request.post({
          url: addMesCount,
          data: {
            list: addData
          }
        })
      }
    })
  }

  render () {
    const { current, isLoading } = this.state
    return (
      <View className='container'>
        <Canvas style='width: 300px; height: 600px;' canvasId='bearing' />
      </View>
    )
  }
}
