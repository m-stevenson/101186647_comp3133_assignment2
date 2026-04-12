import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { TokenService } from './token.service';

interface AuthPayload {
  user: {
    _id: string;
    username: string;
    email: string;
  };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apollo = inject(Apollo);
  private tokenService = inject(TokenService);

  private SIGNUP_MUTATION = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
      signup(username: $username, email: $email, password: $password) {
        user {
          _id
          username
          email
        }
        token
      }
    }
  `;

  private LOGIN_QUERY = gql`
    query Login($usernameOrEmail: String!, $password: String!) {
      login(usernameOrEmail: $usernameOrEmail, password: $password) {
        user {
          _id
          username
          email
        }
        token
      }
    }
  `;

  signup(username: string, email: string, password: string): Observable<AuthPayload> {
    return this.apollo
      .mutate<{ signup: AuthPayload }>({
        mutation: this.SIGNUP_MUTATION,
        variables: { username, email, password },
      })
      .pipe(
        map((result) => {
          const data = result.data?.signup;
          if (!data) {
            throw new Error('Signup failed');
          }
          this.tokenService.setToken(data.token);
          return data;
        })
      );
  }

  login(usernameOrEmail: string, password: string): Observable<AuthPayload> {
    return this.apollo
      .query<{ login: AuthPayload }>({
        query: this.LOGIN_QUERY,
        variables: { usernameOrEmail, password },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((result) => {
          const data = result.data?.login;
          if (!data) {
            throw new Error('Invalid credentials');
          }
          this.tokenService.setToken(data.token);
          return data;
        })
      );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.apollo.client.clearStore();
  }
}