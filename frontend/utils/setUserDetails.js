let user = { name: undefined };
export const setUserDetails = (u) => {
    user.name = u;
}

export const getUserDetails = () => {
    return user.name;
}