export default class Fill {
  constructor() {
    this.canvas = document.getElementById('main_canv');
    this.ctx = this.canvas.getContext('2d');
  }

  getPixelPos(x, y) {
    return (y * this.canvas.width + x) * 4;
  }

  matchStartColor(data, pos, startColor) {
    return (
      data[pos] === startColor.r &&
      data[pos + 1] === startColor.g &&
      data[pos + 2] === startColor.b &&
      data[pos + 3] === startColor.a
    );
  }

  colorPixel(data, pos, color) {
    data[pos] = color.r || 0;
    data[pos + 1] = color.g || 0;
    data[pos + 2] = color.b || 0;
    data[pos + 3] = Object.prototype.hasOwnProperty.call(color, 'a') ? color.a : 255;
  }

  floodFill(startX, startY, fillColor) {
    const dstImg = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const dstData = dstImg.data;

    const startPos = this.getPixelPos(startX, startY);
    const startColor = {
      r: dstData[startPos],
      g: dstData[startPos + 1],
      b: dstData[startPos + 2],
      a: dstData[startPos + 3],
    };
    const todo = [[startX, startY]];

    while (todo.length) {
      const pos = todo.pop();
      const x = pos[0];
      let y = pos[1];
      let currentPos = this.getPixelPos(x, y);

      while (y >= 0 && this.matchStartColor(dstData, currentPos, startColor)) {
        y -= 1;
        currentPos -= this.canvas.width * 4;
      }

      currentPos += this.canvas.width * 4;
      y += 1;
      let reachLeft = false;
      let reachRight = false;

      while (y < this.canvas.height - 1 && this.matchStartColor(dstData, currentPos, startColor)) {
        y += 1;
        this.colorPixel(dstData, currentPos, fillColor);

        if (x > 0) {
          if (this.matchStartColor(dstData, currentPos - 4, startColor)) {
            if (!reachLeft) {
              todo.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < this.canvas.width - 1) {
          if (this.matchStartColor(dstData, currentPos + 4, startColor)) {
            if (!reachRight) {
              todo.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        currentPos += this.canvas.width * 4;
      }
    }

    this.ctx.putImageData(dstImg, 0, 0);
  }

  hexToRgbA(hex) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255];
  }

  rgbaToHex(rgb) {
    let rgba = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    const hex = (rgba && rgba.length === 4) ? "#" +
      ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2) +
      ("0" + parseInt(rgba[3], 10).toString(16)).slice(-2) : '';
    return hex;
  }
}