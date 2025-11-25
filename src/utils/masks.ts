const formatDocumento = (value: string) => {
  if (value) {
    const cleanedValue = value?.replace(/\D/g, '')
    const isCNPJ = cleanedValue?.length > 11

    const match = cleanedValue?.match(
      isCNPJ
        ? /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/
        : /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/,
    )

    if (match) {
      const formattedValue = isCNPJ
        ? `${match[1] || ''}${match[2] ? `.${match[2]}` : ''}${match[3] ? `.${match[3]}` : ''
        }${match[4] ? `/${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`
        : `${match[1] || ''}${match[2] ? `.${match[2]}` : ''}${match[3] ? `.${match[3]}` : ''
        }${match[4] ? `-${match[4]}` : ''}`

      return formattedValue
    } else {
      return cleanedValue
    }
  }

  return ''
}

const formatTelefone = (value: string) => {
  if (value) {
    const cleanedValue = value?.replace(/\D/g, '')

    const isCelular = cleanedValue?.length === 11
    const match = cleanedValue?.match(
      isCelular
        ? /^(\d{0,2})(\d{0,5})(\d{0,4})$/
        : /^(\d{0,2})(\d{0,4})(\d{0,4})$/,
    )

    if (match) {
      const formattedValue = `${match[1] ? `(${match[1]}` : ''}${match[2] ? `) ${match[2]}` : ''
        }${match[3] ? ` ${match[3]}` : ''}`

      return formattedValue
    } else {
      return cleanedValue
    }
  }

  return ''
}

const formatCEP = (value: string) => {
  if (value) {
    const cleanedValue = value.replace(/\D/g, '')

    const match = cleanedValue.match(/^(\d{5})(\d{0,3})$/)

    if (match) {
      return `${match[1]}${match[2] ? `-${match[2]}` : ''}`
    } else {
      return cleanedValue
    }
  }

  return ''
}

function cleanMask(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '')
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}

function formatCurrency(value: string | number): string {
  const numeric = Number(value.toString().replace(/\D/g, "")) / 100
  return numeric.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function currencyStringToCents(value: string): number {
  const numericString = value
    .replace(/\D/g, '') // Remove tudo que não for número

  return parseInt(numericString, 10)
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours && remainingMinutes) {
    return `${hours}h ${remainingMinutes}min`
  } else if (hours) {
    return `${hours}h`
  } else {
    return `${remainingMinutes}min`
  }
}

function formatDateToKey(date: Date) {
  return date.toISOString().split('T')[0]
}

function formatDateToYMD(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatHour(valor: string) {
  valor = valor.replace(/\D/g, '')

  valor = valor.slice(0, 4)

  let horas = ''
  let minutos = ''

  if (valor.length >= 3) {
    horas = valor.slice(0, 2)
    minutos = valor.slice(2, 4)

    if (parseInt(horas) > 23) {
      horas = '23'
    }

    if (parseInt(minutos) > 59) {
      minutos = '59'
    }

    return `${horas}:${minutos}`
  }

  return valor.length >= 2 ? valor.slice(0, 2) + ':' : valor
}

export {
  formatDocumento,
  formatTelefone,
  formatCEP,
  cleanMask,
  truncateText,
  formatCurrency,
  formatDuration,
  currencyStringToCents,
  formatDateToKey,
  formatDateToYMD,
  formatHour
}