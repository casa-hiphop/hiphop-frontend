export interface IOrderBy<T> {
  orderBy: T
  direction: 'asc' | 'desc'
}

export enum OrderByEnum {
  ASC = 'asc', 
  DESC = 'desc'
}