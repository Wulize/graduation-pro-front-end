export default function press(base64: string,rate:number) {
  const image: any = new Image()
  const canvas: any = document.createElement('canvas')
  image.src = base64
  let result: string = ''
  return new Promise((resolve: any, reject: any) => {
    image.onload = (e: any) => {
      const width = image.width
      const height = image.height
      const ratio = (width < height ? width / height : height / width) / rate
      canvas.width = width * ratio
      canvas.height = height * ratio
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(
        image,0,0,width,height,0,0,width * ratio,height * ratio
      )
      result = canvas.toDataURL('image/jpeg', 0.8)
      resolve(result)
    }
  })
}
