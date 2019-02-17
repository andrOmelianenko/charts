import * as gm from 'gammacv';
import * as utils from './utils';
import { initCanvas } from './calc_data';

const drawSegment = (ctx, degrees, fill, styles, centerX, outerRadius, radStep, index, tIndex) => {
  const { sampleBorder } = styles;

  ctx.save();

  const radius = outerRadius - radStep * tIndex;

  const startingAngle = utils.degreesToRadians(utils.calcStartAngle(degrees, index));
  const arcSize = utils.degreesToRadians(degrees[index]);
  const endingAngle = startingAngle + arcSize;

  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.arc(centerX, 0, radius, startingAngle, endingAngle, false);
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill();

  if (sampleBorder) {
    ctx.strokeStyle = sampleBorder;
    ctx.stroke();
  }

  ctx.restore();
};

const drawLabel = (canvas, ctx, fill, styles, shape, index) => {
  const {
    legendHeight,
    labelHeight,
    labels,
    font,
    legendFontSize,
    legendFontColor,
  } = styles;
  const start = -(canvas.width / 2);
  const width = canvas.width / shape;
  const labelIndent = width * 10 / 100;
  const yIndent = -canvas.height / 2 + legendHeight / 2;

  ctx.save();
  ctx.rotate(90 * Math.PI / 180);

  gm.canvasDrawRect(canvas, {
    ax: start + width * index + labelIndent,
    ay: yIndent,
    bx: start + width * index + width - labelIndent,
    by: yIndent,
    cx: start + width * index + width - labelIndent,
    cy: yIndent + labelHeight,
    dx: start + width * index + labelIndent,
    dy: yIndent + labelHeight,
  }, fill, 1, false, true);

  ctx.fillStyle = legendFontColor;
  ctx.font = `${legendFontSize}pt ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(
    labels[index].toUpperCase(),
    start + width * index + width / 2,
    yIndent + labelHeight + 4,
  );
  ctx.restore();
};

const canvasDrawPie = (sourceCanvas, sourceTensors, styles) => {
  const {
    dataStyles,
    legendHeight,
    size,
  } = styles;

  const tensors = utils.manageTensors(sourceTensors);

  const canvas = initCanvas(size, sourceCanvas);

  const fill = new Array(tensors[0].shape[0]);

  const centerX = canvas.height > canvas.width
    ? 0
    : -legendHeight;

  const outerRadius = (canvas.height < canvas.width
    ? canvas.height
    : canvas.width
  ) / 2 - legendHeight;
  const radStep = outerRadius * 100 / tensors.length / 100;

  for (let s = 0; s < tensors[0].shape[0]; s += 1) {
    fill[s] = (dataStyles && dataStyles[s]) ? dataStyles[s].bgColor : utils.getRandomColor();
  }

  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-90 * Math.PI / 180);

  for (let i = 0; i < tensors.length; i += 1) {
    const tensor = tensors[i];
    const degrees = new Array(tensor.shape[0]);
    let sum = 0;

    for (let t = 0; t < tensor.shape[0]; t += 1) {
      sum += Math.abs(tensor.get(t, 1));
    }

    for (let k = 0; k < tensor.shape[0]; k += 1) {
      degrees[k] = ((Math.abs(tensor.get(k, 1)) * 100 / sum) * 360) / 100;
    }

    for (let a = 0; a < tensor.shape[0]; a += 1) {
      drawSegment(ctx, degrees, fill[a], styles, centerX, outerRadius, radStep, a, i);

      if (styles.labels[a] && i === 0) {
        drawLabel(canvas, ctx, fill[a], styles, tensor.shape[0], a);
      }
    }
  }
};

export default canvasDrawPie;
