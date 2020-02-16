import Taro from '@tarojs/taro'
import { Block, View, Canvas, Image } from '@tarojs/components'
import { fillmultiLineText, drawRoundRect, fillText } from '../../utils/canvas'
import './index.styl'

const BG_LIST = [
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w1.jpg',
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w2.jpg',
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w3.jpg',
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w4.jpg',
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w5.jpg',
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w6.jpg',
  'https://fashion-1.oss-cn-shanghai.aliyuncs.com/w7.jpg',
]

// const BC_IMG = BG_LIST[new Date().getDay() || 0]

const BC_IMG = BG_LIST[6]


export const getDaliyPosterDate = (time) => {
  const DateIns = new Date()
  const weekArr = ['日', '一', '二', '三', '四', '五', '六']
  const year = `${DateIns.getFullYear()}`
  const day = DateIns.getDay()
  const date = DateIns.getDate()
  const todayInWeek = `星期${weekArr[day]}`
  const todayDate = date < 10 ? `0${date}` : date
  const todayMonth = DateIns.toDateString().split(' ')[1]
  return {
    year,
    todayMonth,
    todayInWeek,
    todayDate,
  }
}

export default class SharePoster extends Taro.Component {
  config = {
    component: true
  }

  static defaultProps = {
    info: {},
    type: '',
    source: '',
  }

  constructor(props) {
    super(props)
    const { windowWidth } = Taro.getSystemInfoSync()
    this.state = {
      canvasWidth: windowWidth,
      canvasHeight: Math.ceil((16 / 9) * windowWidth),
      imgFile: '',
      showCanvas: true,
      canvasImagesDownloading: [true, true, true],
    }
    this.bcImg = {}
    this.qrcode = {}
  }

  componentDidMount() {
    this.initImg()
  }

  show = () => {
    this.setState({
      showDialog: true,
    }, () => {
      this.init()
    })
  }

  hide = () => {
    Taro.hideLoading()
    this.setState({
      showDialog: false,
      imgFile: ''
    })
  }

  initImg = () => {
    const qrCode = "https://fashion-1.oss-cn-shanghai.aliyuncs.com/code.png"
    const { loadImgFail } = this.props

    Taro.getImageInfo({
      src: BC_IMG,
      success: res => {
        this.bcImg = res
      },
      fail: e => {
        loadImgFail()
      }
    })


    Taro.getImageInfo({
      src: qrCode,
      success: res => {
        this.qrcode = res
      },
      fail: e => {
        loadImgFail()
      }
    })
  }

  init = () => {
    Taro.showLoading({ title: '海报生成中' })
    const canvasInfo = {}
    canvasInfo.currentDate = "2019-12-01T20:48:59+0800"
    canvasInfo.appIdDesc = "扫码添加小程序"
    let { canvasImagesDownloading } = this.state
    canvasImagesDownloading[0] = false
    this.setState({
      canvasImagesDownloading
    }, () => {
      this.drawShareCanvas('poster-canvas', canvasInfo)
    })

  }

  drawShareCanvas = (canvasId, canvasInfo) => {
    const { info } = this.props

    const ctx = Taro.createCanvasContext(canvasId, this.$scope)
    const { canvasWidth, canvasHeight } = this.state
    const todayInfo = getDaliyPosterDate(canvasInfo.currentDate)

    ctx.setFontSize(10)
    const tipWidth = ctx.measureText(canvasInfo.appIdDesc).width * 0.9
    const _rw = canvasWidth / 270
    const _rh = canvasHeight / 480
    ctx.scale(_rw, _rh)
    ctx.setTextBaseline('top')
    // 背景图、头像、二维码
    ctx.drawImage(this.bcImg.path, 0, 0, 270, 480)

    const contentLen = info.content.length
    // card
    ctx.setFillStyle('rgba(255, 255, 255, 0.90)')

    drawRoundRect(ctx, 12, 150, 246, contentLen > 30 ? 170 : 140, 8, 'fill')
    ctx.setFillStyle('rgba(255, 255, 255, 1.0)')
    drawRoundRect(ctx, 12, 340, 246, 82, 8, 'fill')

    ctx.drawImage(this.qrcode.path, 171, 344, 72, 72)
    ctx.save()
    ctx.setFillStyle('#2F3742')
    ctx.setTextAlign('center')
    const topY = contentLen < 20 ? 195 : 180  
    fillmultiLineText({
      ctx,
      x: 131,
      y: topY,
      maxWidth: 216,
      txt: info.content,
      originBold: false,
      bold: true,
      fontSize: 20
    })

    ctx.setStrokeStyle('rgba(255, 255, 255, 0.6)')
    ctx.strokeRect(12, 12, 74, 30)
    ctx.moveTo(50, 17)
    ctx.lineTo(50, 37)
    ctx.stroke()

    ctx.setTextAlign('left')
    ctx.setStrokeStyle('rgba(255, 73, 98, 0.3)')
    fillText(ctx, '负负得正!干了这碗毒鸡汤', 22, 385, true, 12, '#2F3742')

    fillText(ctx, todayInfo.todayDate, 17, 13, true, 24, 'white')
    fillText(ctx, `${todayInfo.todayMonth}.`, 57, 16, true, 10, 'white')
    fillText(ctx, todayInfo.year, 57, 26, true, 10, 'white')
    if (canvasInfo.appIdDesc !== undefined) {
      fillText(ctx, `${canvasInfo.appIdDesc} >`, 52, 362, true, 9, '#2F5AFF')
      ctx.setStrokeStyle('rgba(47, 90, 255, 0.45)')
      drawRoundRect(ctx, 45, 358, Math.round(tipWidth + 6 + 14), 19, 10, 'stroke', {
        tl: true,
        tr: true,
        br: true,
        bl: true
      })
    }
    // draw使用回调会导致绘图错乱
    ctx.draw(false, () => {
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          canvasId,
          quality: 1,
          success: res => {
            const canvasImg = res.tempFilePath
            this.setState({
              imgFile: canvasImg
            }, () => {
              Taro.hideLoading()
            })
          },
          fail: e => {
            console.log('drawShareE', e)
            this.hide()
          }
        }, this.$scope)
      }, 200)
    })
  }

  previewPhoto = () => {
    const { imgFile } = this.state
    if (imgFile !== '') Taro.previewImage({ urls: [imgFile] })
  }

  savePhoto = () => {
    Taro.canvasToTempFilePath({
      canvasId: 'poster-canvas',
      quality: 1,
      success: res => {
        this.setState({
          imgFile: res.tempFilePath
        })
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
             Taro.showToast({
               title: '保存成功，快去分享吧'
             })
          },
          fail: res2 => {
            Taro.showToast({
              title: '保存失败'
            })
          }
        })
      }
    }, this.$scope)
  }

  sharePhoto = () => {
    Taro.showLoading()
  }

  render() {
    const { showDialog, showCanvas, canvasWidth, canvasHeight, imgFile } = this.state

    return (
      <Block>
        {showDialog && (
          <View className={'share-poster ' + (showDialog ? 'show' : '')}>
            <Canvas
              canvasId='poster-canvas'
              className='poster-canvas'
              hidden={!showCanvas}
              style={'width:' + canvasWidth + 'px;height:' + canvasHeight + 'px'}
            />
            <View className='box'>
              <View className='box-wrap'>
                <View className='img-wrap'>
                  <Image
                    className='canvas-img'
                    src={imgFile}
                    onClick={this.previewPhoto}
                  />
                  <View className='close' onClick={this.hide} />
                  {imgFile !== '' && (
                    <View className='footer-btn'>
                      <View className='btn-save' onClick={this.savePhoto}>
                        保存到相册
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
      </Block>
    )
  }
}
