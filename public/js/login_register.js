const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// -----------------------^ No clue what is happening up there ^-----------------------

// Regex Funcs
const containsNumbers = (str) => /\d/.test(str);
// Here ^ inside [] is somewhwere in the middle thus it doesnt need to be escaped
const containsSpecialChars = (str) => /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/.test(str);
const containsSpace = (str) => /[ ]/.test(str);
const containsUnderScore = (str) => /[_]/.test(str);

const validateName = (name) => !containsNumbers(name) && !containsSpecialChars(name) && !containsUnderScore;
const validateUserName = (user) => !containsSpace(user) && !containsSpecialChars(user) && !/^\d/.test(user) && !/^[_]/.test(user);
const confirmPass = (pass, pass2) => pass === pass2;
const validateNID = (nid) => length(nid) === 17;

// Here ^ and $ wrapping ensures that we are checking the whole string and not part of it
// ^ beginning and $ end. in some cases ^ means negation wrapped with [] ie [^ means negated set
// /s indicates a whitespace and with ^ it indicates no whitespace
// + is there to match more than one char which is [^/s]
// google allows a-z . 0-9 in their emails but . not in the first char
const validateEmail = (email) => /^[^.][^\s@A-Z]+@[^\s@A-Z]+\.[^\s@A-Z]+$/.test(email)
    && /^[^`!#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]+$/.test(email);

// Here (?=) means positive lookahead ie (?=.*\d) is trying to find if there is atleast one digit
// *. is used to be able to search for anything after which a num is present
// {8,32} means it can be min 8 to max 32
// (?!) => negetive lookahead
const passCheck = (pass) => /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!@#$%&?]{8,}$/.test(pass);

// Must start with 01 and succede with 9 digits. << I am somewhat of a Regex boss myself :3 >>
const validatePhoneNumber = (phone) => /^01[\d]{9}$/.test(phone);

const validateRegisterOwner = () => {
    const username = document.Register.username.value;
    const fullname = document.Register.name.value;
    const pass = document.Register.pass.value;
    const pass2 = document.Register.pass2.value;
    const phone = document.Register.phone.value;
    const email = document.Register.email.value;
    const nid = document.Register.nid.value;

    // TODO : figure out how to add +880 in the html (for tomorrow i feel sleepy)

    if (!validateName(fullname)) return false;
    if (!validateUserName(username)) return false;
    if (!validateEmail(email)) return false;
    if (!validateNID(nid)) return false;
    if (!validatePhoneNumber(phone)) return false;
    if (passCheck(pass)) {
        if (confirmPass(pass, pass2)) return false;
    }

    return true;
};
