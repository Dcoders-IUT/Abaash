const obj = {}

obj.globalConst = require('./globalConst')

obj.shuffle = (ara) => {
    const shuffled = ara
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
}

obj.genderText = (num) => {
    const temp = num !== 0

    obj.globalConst.genderList.forEach((gender) => {
        if (temp === gender.value) return gender.display
    })

    return ''
}

obj.flatGenderText = (num) => {
    const temp = num === 0 || num === 1 ? num : 2
    let ans = ''

    obj.globalConst.flatGenderList.forEach((gender) => {
        if (temp === gender.value) ans = gender.display
    })

    return ans
}

module.exports = obj
