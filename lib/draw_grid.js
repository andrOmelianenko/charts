import * as gm from 'gammacv';
import defaultStyles from './defaults';

/**
 *
 * @param {string} axis
 * @param {object} canvas
 * @param {array} tensorArray
 * @param {object} styles
 */
const drawGrid = (
  axis,
  canvas,
  {
    min, max, roundedMin, roundedMax,
  },
  styles,
  bottomPadding = 0,
  xGuides = true,
) => {
  const {
    font,
    legendFontSize,
    legendFontColor,
    legendRulerColor,
    legendGuidesColor,
    xAxisLabels,
    showRulerY,
    indent: styleIndent,
    legendGrid,
    showMinY,
  } = styles;

  const isXAxis = axis === 'x';
  const isYAxis = axis === 'y';

  const axisGrid = legendGrid
    ? legendGrid[isXAxis ? 1 : 0]
    : defaultStyles.legendGrid[isXAxis ? 1 : 0];

  const indent = styleIndent || defaultStyles.indent;

  const axisStep = ((isXAxis ? canvas.width : canvas.height - bottomPadding) - indent[`${axis}Axis`] * 2) / axisGrid;

  const countedMaxY = min < 0 ? roundedMax - roundedMin : roundedMax;
  const legendStep = (isYAxis ? countedMaxY : max) / (isXAxis ? axisGrid - 1 : axisGrid);

  const precision = legendStep.toString().split('.')[1];
  const digits = precision ? precision.length : 0;

  const axisLegendValues = new Array(axisGrid);
  let tempLegendValue = min < 0 ? roundedMin : 0;

  for (let i = 0; i < axisGrid; i += 1) {
    let val = 0;

    if (i === 0) {
      val = min < 0 ? roundedMin : 0;
    } else {
      tempLegendValue += legendStep;
      val = tempLegendValue;
    }

    axisLegendValues[i] = (val.toFixed(digits >= 2 ? 2 : digits));
  }

  for (let i = 0; i < axisGrid; i += 1) {
    const tempX = isXAxis
      ? axisStep * i + indent.xAxis
      : indent.xAxis;
    const tempY = isXAxis
      ? canvas.height - indent.yAxis
      : canvas.height - (axisStep * i + indent.yAxis);

    if ((showRulerY && isYAxis) || isXAxis) {
      /* draw rulers */
      gm.canvasDrawLine(canvas, [
        tempX,
        isXAxis ? tempY : tempY - bottomPadding,
        isXAxis ? tempX + axisStep : tempX,
        isXAxis ? tempY : tempY - axisStep - bottomPadding,
      ], legendRulerColor);

      /* draw division marks */
      gm.canvasDrawLine(canvas, [
        tempX,
        isXAxis ? tempY : tempY - bottomPadding,
        isXAxis ? tempX : indent.xAxis - 10,
        isXAxis ? canvas.height - indent.yAxis + 10 : tempY - bottomPadding,
      ], legendRulerColor);

      /* draw last mark */
      if (i === axisGrid - 1) {
        gm.canvasDrawLine(canvas, [
          isXAxis ? tempX + axisStep : tempX,
          isXAxis ? tempY : tempY - axisStep - bottomPadding,
          isXAxis ? tempX + axisStep : indent.xAxis - 10,
          isXAxis ? canvas.height - indent.yAxis + 10 : tempY - axisStep - bottomPadding,
        ], legendRulerColor);
      }
    }

    /* draw guides */
    if ((isYAxis && i !== 0) || (isXAxis && xGuides)) {
      gm.canvasDrawLine(canvas, [
        isXAxis ? tempX + axisStep / 2 : tempX,
        isXAxis ? tempY : tempY - bottomPadding,
        isXAxis ? tempX + axisStep / 2 : canvas.width - indent.xAxis,
        isXAxis ? indent.yAxis : tempY - bottomPadding,
      ], legendGuidesColor);
    }

    /* draw last Y guide */
    if (i === axisGrid - 1 && isYAxis) {
      gm.canvasDrawLine(canvas, [
        tempX,
        tempY - axisStep - bottomPadding,
        canvas.width - indent.xAxis,
        tempY - axisStep - bottomPadding,
      ], legendGuidesColor);
    }

    const ctx = canvas.getContext('2d');
    const markTxt = (xAxisLabels && xAxisLabels[i] && isXAxis)
      ? xAxisLabels[i].toUpperCase()
      : axisLegendValues[i];

    ctx.beginPath();
    ctx.fillStyle = legendFontColor;
    ctx.font = `${legendFontSize}pt ${font}`;
    ctx.textAlign = isXAxis ? 'center' : 'end';
    ctx.textBaseline = 'middle';

    if (!showMinY && i === 0 && isYAxis) {
      continue;
    } else {
      ctx.fillText(
        markTxt,
        isXAxis ? tempX + axisStep / 2 : indent.xAxis - indent.yMark,
        isXAxis ? canvas.height - indent.yAxis + indent.xMark : tempY - bottomPadding,
      );
    }

    if (i === axisGrid - 1 && isYAxis) {
      ctx.fillText(
        roundedMax,
        indent.xAxis - indent.yMark,
        tempY - axisStep - bottomPadding,
      );
    }
  }
};

export default drawGrid;
