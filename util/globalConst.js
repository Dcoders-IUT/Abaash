const obj = {};

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
];

obj.genderList = [
    { value: 1, display: 'Boy' },
    { value: 0, display: 'Girl' },
];

obj.flatGenderList = [
    { value: 1, display: 'Boys' },
    { value: 0, display: 'Girls' },
    { value: 2, display: 'Not Determined Yet' },
];

module.exports = obj;
