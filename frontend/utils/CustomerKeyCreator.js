export const createKey = (customerName) => {
    return customerName.replace(/\s+/g, '').toLowerCase()
}