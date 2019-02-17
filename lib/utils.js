export const isTensor2D = (shape) => {
  if (shape.length !== 2) {
    throw new Error(`Invalid rank, expected two-dimensional tensor
      for example - [100, 2]
      actually - [${shape}]`);
  }
  if (shape[1] !== 2) {
    throw new Error(`Invalid second shape argument
      expected - 2
      actually - ${shape[1]}`);
  }
};

export const findMinMax = (axis, tensor) => {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < tensor.shape[0]; i += 1) {
    const elem = tensor.get(i, axis === 'x' ? 0 : 1);

    if (elem < min) min = elem;
    if (elem > max) max = elem;
  }

  return { min, max };
};

export const degreesToRadians = degrees => (degrees * Math.PI) / 180;

export const calcStartAngle = (degrees, i) => {
  let startDeg = 0;
  for (let j = 0; j < i; j += 1) {
    startDeg += degrees[j];
  }
  return startDeg;
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const manageTensors = (sourceTensors) => {
  const arr = [];
  if (Array.isArray(sourceTensors)) {
    sourceTensors.forEach(elem => arr.push(elem));
  } else {
    arr.push(sourceTensors);
  }
  return arr;
};
