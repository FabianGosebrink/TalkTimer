import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthHttpInterceptor } from './interceptors/auth-interceptor';
import { ContentTypeAcceptHeader } from './interceptors/content-type-acceppt.interceptor';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContentTypeAcceptHeader,
      multi: true
    }
  ]
})
export class SharedModule {}
