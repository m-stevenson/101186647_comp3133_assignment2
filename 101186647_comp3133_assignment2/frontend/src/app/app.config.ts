import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { SetContextLink } from '@apollo/client/link/context';
import { routes } from './app.routes';
import { TokenService } from './services/token.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const tokenService = inject(TokenService);

      const authLink = new SetContextLink((prevContext) => {
        const token = tokenService.getToken();

        let headers = new HttpHeaders();

        if (prevContext.headers instanceof HttpHeaders) {
          headers = prevContext.headers;
        }

        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return { headers };
      });

      return {
        link: ApolloLink.from([
          authLink,
          httpLink.create({
            uri: 'http://localhost:4000/graphql',
          }),
        ]),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
