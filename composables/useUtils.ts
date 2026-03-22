export const useUtils = () => {
  const idrFormatter = (num: number) =>  {
    return new Intl.NumberFormat("id-ID", {currency: "IDR"}).format(num)
  }

  const dateFormatter = (timestamp: string) => {
    const date = new Date(timestamp)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }

    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate
  }

  const generateCode = () => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let randomChar = ''
  
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomChar += characters.charAt(randomIndex)
    }
    const code = `${randomChar}-${Date.now()}`
    return code
  }

  return {  idrFormatter, dateFormatter, generateCode }
}
