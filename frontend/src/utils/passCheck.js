
// Exporting the checkpassword function 
export default function checkPassword(password) {
    const minLength = 10;
    const minUppercase = 2;
    const minSpecialChars = 2;
    const minNumbers = 2;
  
    // Condition 1: Check minimum length
    if (password.length < minLength) {
      return false;
    }
  
    // Condition 2: Check minimum uppercase characters
    const uppercaseChars = password.match(/[A-Z]/g) || [];
    if (uppercaseChars.length < minUppercase) {
      return false;
    }
  
    // Condition 3: Check minimum special characters
    const specialChars = password.match(/[!@#$%^&*()\-=_+[\]{};':"\\|,.<>/?~]/g) || [];
    if (specialChars.length < minSpecialChars) {
      return false;
    }
  
    // Condition 4: Check minimum numbers
    const numbers = password.match(/[0-9]/g) || [];
    if (numbers.length < minNumbers) {
      return false;
    }
  
    // All conditions met
    return true;
  }