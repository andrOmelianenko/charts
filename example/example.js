import * as gm from 'gammacv';
import * as chart from '../lib';

const plotCanvas = document.getElementById('plot');
const scatterCanvas = document.getElementById('scatter');
const histogramCanvas = document.getElementById('histogram');
const pieCanvas = document.getElementById('pie');

const dimension = 3;
const samplesCount = 7;
const tensorArray = [];

const plotStyles = {
  dataStyles: [
    {
      lineWidth: 2,
      lineColor: 'rgba(20, 110, 255, 0.2)',
      pointSize: 5,
      pointColor: '#146eff',
      pointBorder: '#ffffff',
    }, {
      lineWidth: 2,
      lineColor: 'rgba(252, 208, 15, 0.2)',
      pointSize: 5,
      pointColor: 'rgb(252, 208, 15)',
      pointBorder: '#ffffff',
    }, {
      lineWidth: 2,
      lineColor: 'rgba(168, 168, 168, 0.2)',
      pointSize: 5,
      pointColor: 'rgb(168, 168, 168)',
      pointBorder: '#ffffff',
    },
  ],
  showRulerY: false,
  font: 'Open Sans',
  legendGrid: [6, 7],
  legendFontSize: 10,
  legendFontColor: 'rgba(7, 15, 82, 0.8)',
  legendGuidesColor: 'rgba(7, 15, 82, 0.1)',
  legendRulerColor: 'rgba(7, 15, 82, 0.4)',
  indent: {
    xAxis: 40,
    yAxis: 22,
    xMark: 15,
    yMark: 6,
  },
  xAxisLabels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  showMinY: true,
};

const scatterStyles = {
  dataStyles: [
    {
      pointSize: 5,
      pointColor: '#146eff',
      pointBorder: '#ffffff',
    }, {
      pointSize: 5,
      pointColor: 'rgb(252, 208, 15)',
      pointBorder: '#ffffff',
    }, {
      pointSize: 5,
      pointColor: 'rgb(168, 168, 168)',
      pointBorder: '#ffffff',
    },
  ],
  showRulerY: false,
  font: 'Open Sans',
  legendGrid: [3, 10],
  legendFontSize: 10,
  legendFontColor: 'rgba(7, 15, 82, 0.8)',
  legendGuidesColor: 'rgba(7, 15, 82, 0.1)',
  legendRulerColor: 'rgba(7, 15, 82, 0.4)',
  indent: {
    xAxis: 40,
    yAxis: 22,
    xMark: 15,
    yMark: 6,
  },
  showMinY: false,
};

const histStyles = {
  dataStyles: [
    {
      bgColor: '#146eff',
    }, {
      bgColor: 'rgb(252, 208, 15)',
    }, {
      bgColor: 'rgb(168, 168, 168)',
    }, {
      bgColor: 'rgb(100, 168, 168)',
    },
  ],
  showRulerY: false,
  font: 'Open Sans',
  legendGrid: [6, samplesCount],
  legendFontSize: 10,
  legendFontColor: 'rgba(7, 15, 82, 0.8)',
  legendGuidesColor: 'rgba(7, 15, 82, 0.1)',
  legendRulerColor: 'rgba(7, 15, 82, 0.4)',
  indent: {
    xAxis: 40,
    yAxis: 22,
    xMark: 15,
    yMark: 6,
  },
  xAxisLabels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  showMinY: true,
};

const pieStyles = {
  dataStyles: [
    {
      bgColor: '#146eff',
    }, {
      bgColor: 'rgb(252, 208, 15)',
    }, {
      bgColor: 'rgb(168, 168, 168)',
    },
  ],
  sampleBorder: '#ffffffff',
  font: 'Open Sans',
  legendFontSize: 10,
  legendFontColor: 'rgba(7, 15, 82, 0.8)',
  legendHeight: 40,
  labelHeight: 15,
  labels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  size: [500, 500],
};

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

for (let a = 0; a < dimension; a += 1) {
  const tensor = new gm.Tensor('float32', [samplesCount, 2]);

  for (let i = 0; i < samplesCount; i += 1) {
    tensor.set(i, 0, i);
    tensor.set(i, 1, randomInteger(-10, 10));
  }

  tensorArray.push(tensor);
}

const singeTensor = new gm.Tensor('float32', [samplesCount, 2]);

for (let i = 0; i < samplesCount; i += 1) {
  singeTensor.set(i, 0, i);
  singeTensor.set(i, 1, randomInteger(0, 10));
}

chart.canvasDrawPlot(plotCanvas, tensorArray, plotStyles);
chart.canvasDrawScatter(scatterCanvas, singeTensor, scatterStyles);
chart.canvasDrawHist(histogramCanvas, tensorArray, histStyles);
chart.canvasDrawPie(pieCanvas, tensorArray, pieStyles);
