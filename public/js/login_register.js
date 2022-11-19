// animation
const signUpButton = document.getElementById('signUp')
const signInButton = document.getElementById('signIn')
const container = document.getElementById('container')

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active')
})

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active')
})

// -----------------------^ transition handling ^-----------------------

// Regex Funcs
const containsNumbers = str => /\d/.test(str)
// Here ^ inside [] is somewhwere in the middle thus it doesnt need to be escaped
const containsSpecialChars = str => /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/.test(str)
const containsSpace = str => /[ ]/.test(str)
const containsUnderScore = str => /[_]/.test(str)

const validateName = name => !containsNumbers(name) && !containsSpecialChars(name) && !containsUnderScore(name)
const validateUserName = user => !containsSpace(user) && !containsSpecialChars(user) && !/^(\d|_)/.test(user)
const confirmPass = (pass, pass2) => pass === pass2
const validateNID = nid => nid.length > 3 //nid.length === 17 // CHANGE

// Here ^ and $ wrapping ensures that we are checking the whole string and not part of it
// ^ beginning and $ end. in some cases ^ means negation wrapped with [] ie [^ means negated set
// /s indicates a whitespace and with ^ it indicates no whitespace
// + is there to match more than one char which is [^/s]
// google allows a-z . 0-9 in their emails but . not in the first char
const validateEmail = email => /^[^.A-Z][^\s@A-Z]+@[^\s@A-Z]+\.[^\s@A-Z]+$/.test(email)
    && /^[^`!#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]+$/.test(email)

// Here (?=) means positive lookahead ie (?=.*\d) is trying to find if there is atleast one digit
// *. is used to be able to search for anything after which a num is present
// {8,32} means it can be min 8 to max 32
// (?!) => negetive lookahead
const passCheck = pass => /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%&?]{8,}$/.test(pass)

// Must start with 01 and succede with 9 digits. << I am somewhat of a Regex boss myself :3 >>
const validatePhoneNumber = phone => /^0?1[\d]{9}$/.test(phone)
const validateStudentId = sid => /^[12]\d{8}$/.test(sid)

// Actual validation

const validateRegisterOwner = () => {
    const username = document.Register.username
    const fullname = document.Register.name
    const pass = document.Register.pass
    const pass2 = document.Register.pass2
    const phone = document.Register.phone
    const email = document.Register.email
    const nid = document.Register.nid
    // TODO : figure out how to add +880 in the html (for tomorrow i feel sleepy)

    fullname.classList.remove('invalid')
    document.querySelector(`input[name='name']+span`).classList.add('hide')
    if (!validateName(fullname.value)) {
        fullname.classList.add('invalid')
        document.querySelector(`input[name='name']+span`).classList.remove('hide')
        return false
    }
    username.classList.remove('invalid')
    document.querySelector(`input[name='username']+span`).classList.add('hide')
    if (!validateUserName(username.value)) {
        username.classList.add('invalid')
        document.querySelector(`input[name='username']+span`).classList.remove('hide')
        return false
    }
    pass.classList.remove('invalid')
    pass2.classList.remove('invalid')
    document.querySelector(`input[name='pass']+span`).classList.add('hide')
    document.querySelector(`input[name='pass2']+span`).classList.add('hide')
    if (passCheck(pass.value)) {
        if (!confirmPass(pass.value, pass2.value)) {
            pass2.classList.add('invalid')
            document.querySelector(`input[name='pass2']+span`).classList.remove('hide')
            return false
        }
    } else {
        pass.classList.add('invalid')
        document.querySelector(`input[name='pass']+span`).classList.remove('hide')
        return false
    }
    phone.classList.remove('invalid')
    document.querySelector(`input[name='phone']+span`).classList.add('hide')
    if (!validatePhoneNumber(phone.value)) {
        phone.classList.add('invalid')
        document.querySelector(`input[name='phone']+span`).classList.remove('hide')
        return false
    }
    email.classList.remove('invalid')
    document.querySelector(`input[name='email']+span`).classList.add('hide')
    if (!validateEmail(email.value)) {
        email.classList.add('invalid')
        document.querySelector(`input[name='email']+span`).classList.remove('hide')
        return false
    }
    nid.classList.remove('invalid')
    document.querySelector(`input[name='nid']+span`).classList.add('hide')
    if (!validateNID(nid.value)) {
        nid.classList.add('invalid')
        document.querySelector(`input[name='nid']+span`).classList.remove('hide')
        return false
    }
    return true
}


const validateRegisterStudent = () => {
    const fullname = document.SReg.name
    const sid = document.SReg.studentID
    const pass = document.SReg.pass
    const pass2 = document.SReg.pass2
    const phone = document.SReg.phone
    const email = document.SReg.email
    const nid = document.SReg.nid

    fullname.classList.remove('invalid')
    document.querySelector(`input[name='name']+span`).classList.add('hide')
    if (!validateName(fullname.value)) {
        fullname.classList.add('invalid')
        document.querySelector(`input[name='name']+span`).classList.remove('hide')
        return false
    }
    sid.classList.remove('invalid')
    document.querySelector(`input[name='studentID']+span`).classList.add('hide')
    if (!validateStudentId(sid.value)) {
        sid.classList.add('invalid')
        document.querySelector(`input[name='studentID']+span`).classList.remove('hide')
        return false
    }
    pass.classList.remove('invalid')
    pass2.classList.remove('invalid')
    document.querySelector(`input[name='pass']+span`).classList.add('hide')
    document.querySelector(`input[name='pass2']+span`).classList.add('hide')
    if (passCheck(pass.value)) {
        if (!confirmPass(pass.value, pass2.value)) {
            pass2.classList.add('invalid')
            document.querySelector(`input[name='pass2']+span`).classList.remove('hide')
            return false
        }
    } else {
        pass.classList.add('invalid')
        document.querySelector(`input[name='pass']+span`).classList.remove('hide')
        return false
    }
    phone.classList.remove('invalid')
    document.querySelector(`input[name='phone']+span`).classList.add('hide')
    if (!validatePhoneNumber(phone.value)) {
        phone.classList.add('invalid')
        document.querySelector(`input[name='phone']+span`).classList.remove('hide')
        return false
    }
    email.classList.remove('invalid')
    document.querySelector(`input[name='email']+span`).classList.add('hide')
    if (!validateEmail(email.value)) {
        email.classList.add('invalid')
        document.querySelector(`input[name='email']+span`).classList.remove('hide')
        return false
    }
    nid.classList.remove('invalid')
    document.querySelector(`input[name='nid']+span`).classList.add('hide')
    if (!validateNID(nid.value)) {
        nid.classList.add('invalid')
        document.querySelector(`input[name='nid']+span`).classList.remove('hide')
        return false
    }
    return true
}