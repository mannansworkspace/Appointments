export const isAlphanumeric = (tovalidate) =>{
    const regex = /^[a-zA-Z0-9]*$/
    if(tovalidate.length && tovalidate.length > 0)
    {
        return regex.test(tovalidate)
    }return true
}