// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: 'Query';
    hello: string;
    welcome: string;
    user: IUser | null;
    currentUser: IUser | null;
  }

  interface IHelloOnQueryArguments {
    name?: string | null;
  }

  interface IWelcomeOnQueryArguments {
    name?: string | null;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: number;
  }

  interface IMutation {
    __typename: 'Mutation';
    register: Array<IError | null> | null;
    login: IUser;
    logout: ISuccessMessage;
  }

  interface IRegisterOnMutationArguments {
    name: string;
    email: string;
    password: string;
  }

  interface ILoginOnMutationArguments {
    email?: string | null;
    password?: string | null;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }

  interface ISuccessMessage {
    __typename: 'SuccessMessage';
    message: string;
  }
}

// tslint:enable
