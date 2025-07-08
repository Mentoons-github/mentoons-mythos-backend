import bcrypt from 'bcrypt'

export const passwordHash = async(password:string) => {
    const hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword
}

export const passwordCompare = async(password:string,hashedPassword:string) => {
    return await bcrypt.compare(password,hashedPassword)
}