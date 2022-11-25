const obj = {}

userData = require('./userData')
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

obj.userExists = (session) => !userData.missing(session)

obj.academicInfo = (studentID) => {
    let temp = Math.floor(studentID/10000000)
    const batch = 2000+temp

    temp = Math.floor((studentID%100000)/1000)
    let dept;
    if(temp === 11) dept = "Mechanical Engineering"
    if(temp === 41) dept = "CSE"
    if(temp === 42) dept = "Software Engineering"

    temp = Math.floor((studentID%1000)/100)
    const section = temp

    return { batch, dept, section }
}

module.exports = obj
