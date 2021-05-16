export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Represents untyped JSON */
  JSON: any;
};

export type Credential = {
  __typename?: 'Credential';
  accessToken: Scalars['String'];
  client: Scalars['String'];
  expiry: Scalars['Int'];
  tokenType: Scalars['String'];
  uid: Scalars['String'];
};


export type Mutation = {
  __typename?: 'Mutation';
  userLogin?: Maybe<UserLoginPayload>;
  userLogout?: Maybe<UserLogoutPayload>;
  userResendConfirmation?: Maybe<UserResendConfirmationPayload>;
  userSendPasswordReset?: Maybe<UserSendPasswordResetPayload>;
  userSendPasswordResetWithToken?: Maybe<UserSendPasswordResetWithTokenPayload>;
  userSignUp?: Maybe<UserSignUpPayload>;
  userUpdatePassword?: Maybe<UserUpdatePasswordPayload>;
  userUpdatePasswordWithToken?: Maybe<UserUpdatePasswordWithTokenPayload>;
};


export type MutationUserLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUserResendConfirmationArgs = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationUserSendPasswordResetArgs = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationUserSendPasswordResetWithTokenArgs = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationUserSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  confirmSuccessUrl?: Maybe<Scalars['String']>;
};


export type MutationUserUpdatePasswordArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  currentPassword?: Maybe<Scalars['String']>;
};


export type MutationUserUpdatePasswordWithTokenArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  resetPasswordToken: Scalars['String'];
};

export type Pkorg = {
  __typename?: 'Pkorg';
  evaluation?: Maybe<PkorgEvaluation>;
  sessionUser?: Maybe<PkorgSessionUser>;
};


export type PkorgEvaluationArgs = {
  evaluationPath: Scalars['String'];
};

export type PkorgEvaluation = {
  __typename?: 'PkorgEvaluation';
  result: Scalars['JSON'];
};

export type PkorgSessionUser = {
  __typename?: 'PkorgSessionUser';
  email: Scalars['String'];
  forename: Scalars['String'];
  surname: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  pkorg?: Maybe<Pkorg>;
  userCheckPasswordToken: User;
  userConfirmAccount: User;
};


export type QueryPkorgArgs = {
  sessionToken: Scalars['String'];
  baseUrl: Scalars['String'];
  userAgent?: Maybe<Scalars['String']>;
};


export type QueryUserCheckPasswordTokenArgs = {
  resetPasswordToken: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
};


export type QueryUserConfirmAccountArgs = {
  confirmationToken: Scalars['String'];
  redirectUrl: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of UserLogin */
export type UserLoginPayload = {
  __typename?: 'UserLoginPayload';
  authenticatable: User;
  credentials: Credential;
};

/** Autogenerated return type of UserLogout */
export type UserLogoutPayload = {
  __typename?: 'UserLogoutPayload';
  authenticatable: User;
};

/** Autogenerated return type of UserResendConfirmation */
export type UserResendConfirmationPayload = {
  __typename?: 'UserResendConfirmationPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserSendPasswordReset */
export type UserSendPasswordResetPayload = {
  __typename?: 'UserSendPasswordResetPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserSendPasswordResetWithToken */
export type UserSendPasswordResetWithTokenPayload = {
  __typename?: 'UserSendPasswordResetWithTokenPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserSignUp */
export type UserSignUpPayload = {
  __typename?: 'UserSignUpPayload';
  authenticatable: User;
  /** Authentication credentials. Null if after signUp resource is not active for authentication (e.g. Email confirmation required). */
  credentials?: Maybe<Credential>;
};

/** Autogenerated return type of UserUpdatePassword */
export type UserUpdatePasswordPayload = {
  __typename?: 'UserUpdatePasswordPayload';
  authenticatable: User;
};

/** Autogenerated return type of UserUpdatePasswordWithToken */
export type UserUpdatePasswordWithTokenPayload = {
  __typename?: 'UserUpdatePasswordWithTokenPayload';
  authenticatable: User;
  /** Authentication credentials. Resource must be signed_in for credentials to be returned. */
  credentials?: Maybe<Credential>;
};

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { userLogin?: Maybe<(
    { __typename?: 'UserLoginPayload' }
    & { authenticatable: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'name'>
    ), credentials: (
      { __typename?: 'Credential' }
      & Pick<Credential, 'accessToken' | 'client' | 'expiry' | 'tokenType' | 'uid'>
    ) }
  )> }
);

export type CheckConnectionQueryVariables = Exact<{
  baseUrl: Scalars['String'];
  sessionToken: Scalars['String'];
  userAgent: Scalars['String'];
}>;


export type CheckConnectionQuery = (
  { __typename?: 'Query' }
  & { pkorg?: Maybe<(
    { __typename?: 'Pkorg' }
    & { sessionUser?: Maybe<(
      { __typename?: 'PkorgSessionUser' }
      & Pick<PkorgSessionUser, 'email' | 'forename' | 'surname'>
    )> }
  )> }
);
