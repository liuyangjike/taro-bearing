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

      // d
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

    // 使用 wx.createContext 获取绘图上下文 context
    var context = Taro.createCanvasContext('bearing')

    context.setStrokeStyle("#111")
    context.setLineWidth(1)
    // context.rect(0, 0, 70, 220)
    drawRoundedRect(context, 100, 200, 70, 220, 80, 5, 20, false, true)
    // context.stroke()
    // context.draw()
 
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
