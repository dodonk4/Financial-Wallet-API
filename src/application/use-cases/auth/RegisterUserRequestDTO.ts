export interface RegisterUserRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  document: {
    type: string;
    number: string;
  };
  birthDate: string;
}