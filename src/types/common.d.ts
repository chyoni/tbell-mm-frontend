export interface IResponse {
  ok: boolean;
  errorMessage?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface IErrorResponse {
  code: string;
  response: {
    data: IResponse;
    status: number;
  };
}
