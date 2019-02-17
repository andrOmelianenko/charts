import * as gm from 'gammacv';
import * as utils from './utils';
import drawGrid from './draw_grid';
import calcData from './calc_data';

const canvasDrawHist = (sourceCanvas, sourceTensors, styles) => {
  const data = calcData(sourceCanvas, sourceTensors, styles);
  const {
    canvas,
    indent,
    xStep,
    boundaries,
    tensorsData,
    y0,
  } = data;

  Object.keys(boundaries).forEach((key) => {
    drawGrid(key, canvas, boundaries[key], styles, 0, false);
  });

  const tensors = utils.manageTensors(sourceTensors);

  for (let i = 0; i < tensors.length; i += 1) {
    utils.isTensor2D(tensors[i].shape);

    const {
      normY,
      dataStyle,
    } = tensorsData[i];
    const columnWidth = xStep / tensors.length;

    for (let a = 0; a < tensors[i].shape[0]; a += 1) {
      gm.canvasDrawLine(canvas, [
        indent.xAxis + xStep * a + columnWidth / 2 + columnWidth * i,
        normY[a] - indent.yAxis,
        indent.xAxis + xStep * a + columnWidth / 2 + columnWidth * i,
        y0 - indent.yAxis,
      ], dataStyle.bgColor, columnWidth);
    }
  }
};

export default canvasDrawHist;
