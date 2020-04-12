import Cursor from './cursor/cursor.js';
import Canvas from './canvas/canvas.js';
import Preview from './preview/preview.js';
import Frames from './frames/frames.js';
import ExportGif from './export/exportGif.js';

export default function init() {
  const width = 768;
  const canvasSizeElement = document.querySelector('#canvas-size');
  const fullScreenPreview = document.querySelector('#fullScreen');
  const saveButton = document.querySelector('#saveButton');
  const canvasSize = 32;
  const cellSize = width / canvasSize;
  const cursor = new Cursor(canvasSize, cellSize);
  const canvas = new Canvas(cursor, cellSize);
  const preview = new Preview();
  const frames = new Frames(canvas);
  const utils = new ExportGif();

  fullScreenPreview.addEventListener('click', () => preview.fullScreen(preview.getPreview()));

  const resizeCanvas = () => {
    canvas.canvasSize = canvasSizeElement.options[canvasSizeElement.selectedIndex].value;
    canvas.cellSize = width / canvas.canvasSize;
    cursor.size = canvas.canvasSize;
    cursor.cellSize = canvas.cellSize;
    cursor.hideCursor();
    cursor.setCursorSize(1);
  };

  cursor.hideCursor();
  cursor.setCursorSize(1);
  frames.addFrame();
  preview.showRate();
  preview.startAnimation(0);

  Array.from(document.getElementsByClassName('pen-size-option')).forEach(item => {
    item.addEventListener('click', e => {
      const newSize = parseInt(e.target.attributes['data-size'].value, 10);
      if (newSize && [1, 2, 3, 4].some(s => s === newSize)) {
        cursor.setCursorSize(newSize);
      }
    });
  });

  saveButton.addEventListener('click', utils.saveGif);
  canvasSizeElement.addEventListener('change', () => resizeCanvas());
}
