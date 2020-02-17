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

    function drawLineWithArrow(ctx, x1, y1, x2, y2, direction) {
      // direction  1: 右;2:左;3:上;4:下
      const GAP = 30
      const reserve = 4
      const arrowRadius = 8
      const angle = Math.PI / 12
      let x3, y3, x4, y4, x5, y5, x6, y6

      switch (direction) {
        case 1:
          x3 = x1 + GAP * direction
          y3 = y1
          x4 = x3 - reserve
          y4 = y3
          x5 = x2 + GAP * direction
          y5 = y2
          x6 = x5 - reserve
          y6 = y5
          break;
        default:
          break;
      }
      ctx.beginPath()

      ctx.moveTo(x1, y1)
      ctx.lineTo(x3, y3)

      ctx.moveTo(x4, y4)

      ctx.lineTo(x4 - arrowRadius * Math.sin(angle), y4 + arrowRadius * Math.cos(angle))
      ctx.lineTo(x4 + arrowRadius * Math.sin(angle), y4 + arrowRadius * Math.cos(angle))
      ctx.lineTo(x4, y4)
      context.fillStyle = "#555"
      ctx.stroke()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(x2, y2)
      ctx.lineTo(x5, y5)

      ctx.moveTo(x6, y6)

      ctx.lineTo(x6 - arrowRadius * Math.sin(angle), y6 - arrowRadius * Math.cos(angle))
      ctx.lineTo(x6 + arrowRadius * Math.sin(angle), y6 - arrowRadius * Math.cos(angle))
      ctx.lineTo(x6, y6)

      ctx.lineTo(x4, y4)

      ctx.fill()
      
    }

  function drawRoundedRect2(ctx, x, y, width, height, d, r, ball, fill, stroke) {
    const bearing = [
      {
        x: x,  //0
        y: y + r  //0
      },
      {
        x: x,  //1
        y: y   //1
      },
      {
        x: x + r,  //2
        y: y   //2
      },
      {
        x: x + width,  //3
        y: y   //3
      },
      {
        x: x + width,  //4
        y: y + r   //4
      },
      {
        x: x + width,  //5
        y: y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)   //5
      },
      {
        x: x + width/2 + ball* Math.sin(Math.PI / 4),  //6
        y: y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)   //6
      },
      {
        x: x + width/2,   //7
        y: y + (height - d) / 4 //7
      },
      {
        x: x ,   //8
        y: y + (height - d) / 4 - ball * Math.cos(Math.PI / 4)    //8
      },
      {
        x: x ,   //9
        y: y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)    //9
      },
      {
        x: x + width/2 - ball* Math.sin(Math.PI / 4),   //10
        y: y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)    //10
      },
      {
        x: x + width,   //11
        y: y + (height - d) / 4 + ball * Math.cos(Math.PI / 4)    //11
      },
      {
        x: x + width,   //12
        y: y + (height - d) / 2    //12
      },
      {
        x: x ,   //13
        y: y + (height - d) / 2    //13
      },
      {
        x: x ,   //14
        y: y + height - (height - d) / 2    //14
      },
      {
        x: x + width ,   //15
        y: y + height - (height - d) / 2    //15
      },
      {
        x: x + width ,   //16
        y: y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4) //16
      },
      {
        x: x + width/2 + ball* Math.sin(Math.PI / 4),    //17
        y: y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4) //17
      },
      {
        x: x + width/2,    //18
        y: y + height - (height - d) / 4//18
      },
      {
        x: x ,    //19
        y: y + height - (height - d) / 4 - ball * Math.cos(Math.PI / 4) //18
      },
      {
        x: x ,    //20
        y: y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4) //20
      },
      {
        x: x + width/2 - ball* Math.sin(Math.PI / 4),     //21
        y: y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4) //21
      },
      {
        x: x + width,     //22
        y: y + height - (height - d) / 4 + ball * Math.cos(Math.PI / 4) //22
      },
      {
        x: x + width,     //23
        y: y + height//23
      },
      {
        x: x + width - r ,     //24
        y: y + height  //24
      },
      {
        x: x,     //25
        y: y + height  //25
      },
      {
        x: x,     //26
        y: y + height - r  //26
      }
    ]

    // outer 上
    ctx.moveTo(bearing[0].x, bearing[0].y)
    ctx.arcTo(bearing[1].x, bearing[1].y, bearing[2].x, bearing[2].y, r); // draw right side and bottom right corner 
    ctx.arcTo(bearing[3].x, bearing[3].y, bearing[4].x, bearing[4].y, r); // draw right side and bottom right corner 
    ctx.lineTo(bearing[5].x, bearing[5].y)
    ctx.lineTo(bearing[6].x, bearing[6].y)
    ctx.arc(bearing[7].x, bearing[7].y, ball, - Math.PI / 4, - Math.PI * 3 / 4, true)
    ctx.lineTo(bearing[8].x, bearing[8].y)
    ctx.lineTo(bearing[0].x, bearing[0].y)
    ctx.fill()

    // inner 上
    ctx.moveTo(bearing[9].x, bearing[9].y)
    ctx.lineTo(bearing[10].x, bearing[10].y)
    ctx.arc(bearing[7].x, bearing[7].y, ball, Math.PI * 3 / 4, Math.PI / 4, true)
    ctx.lineTo(bearing[11].x, bearing[11].y)
    ctx.lineTo(bearing[12].x, bearing[12].y)
    ctx.lineTo(bearing[13].x, bearing[13].y)
    ctx.lineTo(bearing[9].x, bearing[9].y)
    ctx.fill()

    // inner 下
    ctx.moveTo(bearing[14].x, bearing[14].y)
    ctx.lineTo(bearing[15].x, bearing[15].y)
    ctx.lineTo(bearing[16].x, bearing[16].y)
    ctx.lineTo(bearing[17].x, bearing[17].y)
    ctx.arc(bearing[18].x, bearing[18].y, ball, - Math.PI  / 4, - Math.PI * 3 / 4, true)
    ctx.lineTo(bearing[19].x, bearing[19].y)
    ctx.lineTo(bearing[14].x, bearing[14].y)
    ctx.fill()

    // outer 下
    ctx.moveTo(bearing[20].x, bearing[20].y)
    ctx.lineTo(bearing[21].x, bearing[21].y)
    ctx.arc(bearing[18].x, bearing[18].y, ball, Math.PI * 3 / 4,  Math.PI / 4, true)
    ctx.lineTo(bearing[22].x, bearing[22].y)
    ctx.arcTo(bearing[23].x, bearing[23].y, bearing[24].x, bearing[24].y, r); // draw right side and bottom right corner 
    ctx.arcTo(bearing[25].x, bearing[25].y, bearing[26].x, bearing[26].y, r); // draw right side and bottom right corner 
    ctx.lineTo(bearing[20].x, bearing[20].y)
    ctx.fill()

    //闭合
    ctx.moveTo(bearing[8].x, bearing[8].y)
    ctx.lineTo(bearing[9].x, bearing[9].y)
    ctx.moveTo(bearing[5].x, bearing[5].y)
    ctx.lineTo(bearing[11].x, bearing[11].y)
    ctx.moveTo(bearing[19].x, bearing[19].y)
    ctx.lineTo(bearing[20].x, bearing[20].y)
    ctx.moveTo(bearing[16].x, bearing[16].y)
    ctx.lineTo(bearing[22].x, bearing[22].y)
    ctx.moveTo(bearing[13].x, bearing[13].y)
    ctx.lineTo(bearing[14].x, bearing[14].y)
    ctx.moveTo(bearing[12].x, bearing[12].y)
    ctx.lineTo(bearing[15].x, bearing[15].y)
    ctx.moveTo(bearing[10].x, bearing[10].y)
    ctx.arc(bearing[7].x, bearing[7].y, ball,  Math.PI * 3 / 4, - Math.PI * 3 / 4, false)
    ctx.moveTo(bearing[6].x, bearing[6].y)
    ctx.arc(bearing[7].x, bearing[7].y, ball,  - Math.PI / 4, Math.PI  / 4, false)
    ctx.moveTo(bearing[21].x, bearing[21].y)
    ctx.arc(bearing[18].x, bearing[18].y, ball, Math.PI * 3 / 4, - Math.PI * 3 / 4, false)
    ctx.moveTo(bearing[17].x, bearing[17].y)
    ctx.arc(bearing[18].x, bearing[18].y, ball,  - Math.PI / 4, Math.PI  / 4, false)
    ctx.stroke()


    // 尺寸

    ctx.stroke()
    ctx.closePath()

    drawLineWithArrow(ctx, bearing[12].x, bearing[12].y, bearing[15].x, bearing[15].y, 1)

    ctx.stroke()
    ctx.draw()
  }



    // 使用 wx.createContext 获取绘图上下文 context
    var context = Taro.createCanvasContext('bearing')

    context.setLineWidth(1)
    context.setStrokeStyle("#111")

    context.fillStyle = "#66bbdd"
    // context.rect(0, 0, 70, 220)
    drawRoundedRect2(context, 100, 200, 70, 220, 80, 5, 20, false, true)
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
