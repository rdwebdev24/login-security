const assignWhiteSpace = (str) => {
    const replacedString = str.replace(/./g, () => " ");
   return replacedString;
}
module.exports = assignWhiteSpace