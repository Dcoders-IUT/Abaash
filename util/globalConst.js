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
    { value: 1, display: 'Male' },
    { value: 0, display: 'Female' },
];

obj.flatGenderList = [
    { value: 1, display: 'For Bachelors' },
    { value: 0, display: 'For Bachelorettes' },
    { value: 2, display: 'Gender Not Determined Yet' },
];

obj.roomTypeList = [
    { value: 1, display: 'Bedroom', table: 'bedroom' },
    { value: 2, display: 'Dining Room', table: null },
    { value: 3, display: 'Living Room', table: 'livingroom' },
    { value: 4, display: 'Kitchen', table: 'kitchen' },
    { value: 5, display: 'Bathroom', table: 'bathroom' },
    { value: 6, display: 'Balcony', table: null },
    { value: 7, display: 'Store Room', table: null },
    { value: 8, display: 'Extra Room', table: null },
];

obj.flooringList = [
    { value: 1, display: 'Plain' },
    { value: 1.05, display: 'Mosaic' },
    { value: 1.15, display: 'Tiles' },
];

module.exports = obj;
