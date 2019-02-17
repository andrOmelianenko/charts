import * as gm from 'gammacv';
import defaultStyles from './defaults';
import * as utils from './utils';

export const initCanvas = (styleSize, sourceCanvas) => {
  const size = styleSize || defaultStyles.size;
  const canvas = sourceCanvas || gm.canvasCreate();

  canvas.width = size[0] * window.devicePixelRatio;
  canvas.height = size[1] * window.devicePixelRatio;
  canvas.style.width = `${size[0]}px`;
  canvas.style.height = `${size[1]}px`;
  canvas.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);

  return {
    width: size[0],
    height: size[1],
    getContext: () => canvas.getContext('2d'),
  };
};

const calcData = (sourceCanvas, sourceTensors, styles, bottomPadding = 0) => {
  const {
    dataStyles,
    indent: styleIndent,
    size,
    legendGrid,
  } = styles;

  const canvas = initCanvas(size, sourceCanvas);

  const boundaries = {
    x: {
      min: Infinity,
      max: -Infinity,
    },
    y: {
      min: Infinity,
      max: -Infinity,
      roundedMin: null,
      roundedMax: null,
    },
  };

  const tensors = utils.manageTensors(sourceTensors);

  for (let i = 0; i < tensors.length; i += 1) {
    Object.keys(boundaries).forEach((key) => {
      const { min, max } = utils.findMinMax(key, tensors[i]);
      if (min < boundaries[key].min) boundaries[key].min = min;
      if (max > boundaries[key].max) boundaries[key].max = max;
    });
  }

  const sign = Math.sign(boundaries.y.min);

  boundaries.y.roundedMin = sign * Math.ceil(
    Math.abs((boundaries.y.min - 1) / legendGrid[0]),
  ) * legendGrid[0];
  boundaries.y.roundedMax = Math.ceil((boundaries.y.max + 1) / legendGrid[0]) * legendGrid[0];

  const { x, y } = boundaries;
  const tempYMin = (y.min < 0) ? y.min : 0;
  const chartScale = (y.max - tempYMin) * 100 / (y.roundedMax - (y.min < 0 ? y.roundedMin : tempYMin)); // eslint-disable-line
  const indent = styleIndent || defaultStyles.indent;
  const gridHeight = canvas.height - indent.yAxis * 2;
  const drawHeight = ((gridHeight - bottomPadding) * chartScale / 100);
  const xGrid = legendGrid ? legendGrid[1] : defaultStyles.legendGrid[1];
  const xStep = (canvas.width - indent.xAxis * 2) / xGrid;
  const tensorsData = new Array(tensors.length);

  for (let a = 0; a < tensors.length; a += 1) {
    const dataStyle = (dataStyles && dataStyles[a])
      ? Object.assign({}, dataStyles[a])
      : Object.assign({}, defaultStyles.dataStyle);

    if (!(dataStyles && dataStyles[a])) {
      const randColor = utils.getRandomColor();
      dataStyle.lineColor = randColor;
      dataStyle.pointColor = randColor;
      dataStyle.bgColor = utils.getRandomColor();
    }

    const normX = new Array(tensors[a].shape[0]);
    const normY = new Array(tensors[a].shape[0]);

    for (let i = 0; i < tensors[a].shape[0]; i += 1) {
      normX[i] = (tensors[a].get(i, 0) - x.min) / // eslint-disable-line
        (x.max - x.min) * (canvas.width - indent.xAxis * 2 - xStep);
      normY[i] = canvas.height - ((tensors[a].get(i, 1) - (y.min < 0 ? y.roundedMin : tempYMin)) / // eslint-disable-line
        (y.max - tempYMin) * drawHeight);
    }

    tensorsData[a] = {
      normX,
      normY,
      dataStyle,
    };
  }

  return {
    canvas,
    indent,
    xStep,
    boundaries,
    tensorsData,
    y0: canvas.height + y.roundedMin / (y.max - tempYMin) * drawHeight,
  };
};

export default calcData;
