class ValidationErrors {
  public REQUIRED = 'Campo obrigatório'

  public SIZE_ERROR = (value: string, size: number) => {
    return `${value} deve conter pelo menos ${size} caracteres`
  }

  public INVALID_VALUE = (value: string) => {
    return `${value} inválido`
  }
}

export const validationErrors = new ValidationErrors()
