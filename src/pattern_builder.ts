enum ImageFormat {
  Png = 'png',
  Jpeg = 'jpeg'
}

interface IResolution {
  width: number;
  height: number;
}

// экз-ры этого интерфейса и будем создавать
interface IImageConversion extends IResolution {
  format: ImageFormat
}

class ImageBuilder {
  private formats: ImageFormat[] = []
  private resolutions: IResolution[] = []

  addPng() {
    if (this.formats.includes(ImageFormat.Png)) {
      return this;
    }
    this.formats.push(ImageFormat.Png)
    return this;
  }

  addJpeg() {
    if (this.formats.includes(ImageFormat.Jpeg)) {
      return this;
    }
    this.formats.push(ImageFormat.Jpeg)
    return this;
  }

  addResolution(width: number, height: number) {
    this.resolutions.push({width, height});
    return this;
  }

  // Финальный метод
  build(): IImageConversion[] {
    const res: IImageConversion[] = []
    for (const r of this.resolutions) {
      for (const f of this.formats) {
        res.push({
          format: f,
          width: r.width,
          height: r.height
        })
      }
    }
    return res;
  }
}

// Usage

console.log(new ImageBuilder().addJpeg().addPng().addResolution(100,100).addResolution(200,200).build())



