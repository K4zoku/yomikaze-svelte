import type Login from "./Login";

export default interface Register extends Login {
    fullname: string;
    confirmPassword: string;
    email: string;
    birthday: string | Date
}