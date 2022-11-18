const linearRegression = require('ml-regression-multivariate-linear')

const obj = {}

obj.test = () => {
    const x = [
        [0, 0],
        [1, 2],
        [2, 3],
        [3, 4],
        [2, 4],
        [5, 4],
    ];
    // Y0 = X0 * 2, Y1 = X1 * 2, Y2 = X0 + X1
    const y = [
        [0, 0, 0],
        [2, 4, 3],
        [4, 6, 5],
        [6, 8, 7],
        [4, 8, 6],
        [10, 8, 9],
    ];
    const predictor = new linearRegression(x, y)
    return predictor
};

obj.model = (x, y) => {
    const predictor = new linearRegression(x, y)
    return predictor
};

module.exports = obj
