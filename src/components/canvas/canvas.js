import Tools from '../tools/tools.js';

const tools = new Tools();
export default class Canvas {
  constructor(cursor, cellSize) {
    this.cursor = cursor;
    this.draw = false;
    this.cellSize = cellSize;
    this.canvas = document.getElementById('main_canv');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = tools.colors.mainColor();

    this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
    this.canvas.addEventListener('mouseup', e => this.onMouseUp(e));
    this.canvas.addEventListener('mouseleave', e => this.onMouseLeave(e));
    this.canvas.addEventListener('mouseover', e => this.onMouseOver(e));
    this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
    this.canvas.addEventListener('click', e => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    const activeTool = document.querySelector('.active-tool');
    const x = e.offsetX;
    const y = e.offsetY;
    this.cursor.setCursor(x, y);
    if (activeTool.classList.contains('eraser')) {
      this.ctx.clearRect(
        this.cursor.cursorPosition.left * this.cellSize,
        this.cursor.cursorPosition.top * this.cellSize,
        this.cellSize * this.cursor.cursorSize,
        this.cellSize * this.cursor.cursorSize,
      );
      e.stopPropagation();
    } else if (activeTool.classList.contains('pen')) {
      this.ctx.fillStyle = tools.colors.mainColor();
      this.ctx.fillRect(
        this.cursor.cursorPosition.left * this.cellSize,
        this.cursor.cursorPosition.top * this.cellSize,
        this.cellSize * this.cursor.cursorSize,
        this.cellSize * this.cursor.cursorSize,
      );
      e.stopPropagation();
    }
  }

  onMouseDown(e) {
    e.preventDefault();
    this.draw = true;
    const activeTool = document.querySelector('.active-tool');
    if (activeTool.classList.contains('bucket')) {
      const x = e.offsetX;
      const y = e.offsetY;

      const pixel = this.ctx.getImageData(x, y, 1, 1);
      const { data } = pixel;
      const rgbaCanvas = data.slice(0, -1).join(', ');

      const rgba = tools.fill.hexToRgbA(tools.colors.mainColor());

      const colorFill = {};
      colorFill.r = +rgba[0];
      colorFill.g = +rgba[1];
      colorFill.b = +rgba[2];
      colorFill.a = +rgba[3] || 255;

      const rgbaCurrent = rgba.slice(0, 3).join(', ');

      if (rgbaCanvas !== rgbaCurrent) {
        tools.fill.floodFill(e.offsetX, e.offsetY, colorFill);
      }
      e.stopPropagation();
    }
    if (activeTool.classList.contains('pipette')) {
      const x = e.layerX;
      const y = e.layerY;
      const pixel = this.ctx.getImageData(x, y, 1, 1);
      const { data } = pixel;
      const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
      const mainColorElement = document.querySelector('#color-main');
      if (rgba !== 'rgba(0, 0, 0, 0)') {
        mainColorElement.value = tools.fill.rgbaToHex(rgba);
      }
      e.stopPropagation();
    }
  }

  onMouseUp(e) {
    e.preventDefault();
    this.draw = false;
    const activeFrame = document.querySelector('.frame.active');
    const frames = document.querySelectorAll('.frame');
    if (activeFrame) {
      activeFrame.setAttribute('src', this.canvas.toDataURL());
      localStorage.setItem('framesList', JSON.stringify(frames));
    }
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.cursor.hideCursor();
    this.draw = false;
  }

  onMouseOver(e) {
    if (e.target.id === 'cursor') {
      return;
    }

    e.preventDefault();
    this.cursor.showCursor();
    const x = e.offsetX;
    const y = e.offsetY;
    this.cursor.setCursor(x, y);
    if (e.buttons) {
      this.draw = true;
    }
  }

  onMouseMove(e) {
    e.preventDefault();
    const x = e.offsetX;
    const y = e.offsetY;
    const activeTool = document.querySelector('.active-tool');
    this.cursor.setCursor(x, y);
    if (!this.draw) {
      return;
    }
    if (activeTool.classList.contains('eraser')) {
      this.ctx.clearRect(
        this.cursor.cursorPosition.left * this.cellSize,
        this.cursor.cursorPosition.top * this.cellSize,
        this.cellSize * this.cursor.cursorSize,
        this.cellSize * this.cursor.cursorSize,
      );
      e.stopPropagation();
    } else if (activeTool.classList.contains('pen')) {
      this.ctx.fillStyle = tools.colors.mainColor();
      this.ctx.fillRect(
        this.cursor.cursorPosition.left * this.cellSize,
        this.cursor.cursorPosition.top * this.cellSize,
        this.cellSize * this.cursor.cursorSize,
        this.cellSize * this.cursor.cursorSize,
      );
      e.stopPropagation();
    }
  }

  getCanvas() {
    const obj = {};
    obj.canvas = this.canvas;
    obj.ctx = obj.canvas.getContext('2d');

    return obj;
  }

  clearCanvas() {
    this.getCanvas().ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCanvasSize() {
    this.select = document.querySelector('#canvas-size');
    this.option = this.select.options[this.select.selectedIndex].value;
    return this.option;
  }
}
