import * as gm from 'gammacv';
import * as utils from './utils';
import drawGrid from './draw_grid';
import defaultStyles from './defaults';
import calcData from './calc_data';

const canvasDrawScatter = (sourceCanvas, sourceTensors, styles) => {
  const { bottomPadding } = defaultStyles;
  const data = calcData(sourceCanvas, sourceTensors, styles, bottomPadding);
  const {
    canvas,
    indent,
    xStep,
    boundaries,
    tensorsData,
  } = data;

  Object.keys(boundaries).forEach((key) => {
    drawGrid(key, canvas, boundaries[key], styles, bottomPadding);
  });

  const tensors = utils.manageTensors(sourceTensors);

  for (let i = 0; i < tensors.length; i += 1) {
    utils.isTensor2D(tensors[i].shape);

    const {
      normX,
      normY,
      dataStyle,
    } = tensorsData[i];

    for (let a = 0; a < tensors[i].shape[0]; a += 1) {
      gm.canvasFillCircle(canvas, [
        normX[a] + indent.xAxis + xStep / 2,
        normY[a] - bottomPadding - indent.yAxis,
      ], dataStyle.pointSize, dataStyle.pointColor);

      if (dataStyle.pointBorder) {
        gm.canvasDrawCircle(canvas, [
          normX[a] + indent.xAxis + xStep / 2,
          normY[a] - bottomPadding - indent.yAxis,
        ], dataStyle.pointSize + 1, dataStyle.pointBorder);
      }
    }
  }
};

export default canvasDrawScatter;
