const bloodgroupList = [
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

const genderList = [
    { value: 1, display: 'Male' },
    { value: 0, display: 'Female' },
];

const flatGenderList = [
    { value: 1, display: 'For Bachelors' },
    { value: 0, display: 'For Bachelorettes' },
    { value: 2, display: 'Gender Not Determined Yet' },
];

module.exports = { bloodgroupList, genderList, flatGenderList };