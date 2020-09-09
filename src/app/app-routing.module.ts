import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoadingComponent } from "@luwfy/default-component-angular-luwfy";

const routes: Routes = [{ path: "**", component: LoadingComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
