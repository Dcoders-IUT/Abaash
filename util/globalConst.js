const obj = {}

obj.bloodgroupList = [
    { value: ' ', display: "I don't know" },
    { value: 'A+', display: 'A+' },
    { value: 'A-', display: 'A-' },
    { value: 'B+', display: 'B+' },
    { value: 'B-', display: 'B-' },
    { value: 'AB+', display: 'AB+' },
    { value: 'AB-', display: 'AB-' },
    { value: 'O+', display: 'O+' },
    { value: 'O-', display: 'O-' },
]

obj.genderList = [
    { value: 1, display: 'Male' },
    { value: 0, display: 'Female' },
]

obj.flatGenderList = [
    { value: 1, display: 'Male' },
    { value: 0, display: 'Female' },
    { value: 2, display: 'Not Determined Yet' },
]

module.exports = obj
