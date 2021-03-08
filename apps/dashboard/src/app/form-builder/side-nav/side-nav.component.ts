import { Component } from '@angular/core';
import { 
  Router, 
  Event, 
  NavigationStart, 
  NavigationEnd, 
  Params, 
  ActivatedRoute 
} from '@angular/router';
import { DrawerService, LoadingService } from '@swimlane/ngx-ui';
import { APP_MENU_ITEMS } from './app-menu';
import { FormViewService } from '@xilo-mono/form-contracts';

@Component({
  selector: 'app-form-builder-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class FormBuilderSideNavComponent {
  searchValue = '';
  filteredNavigationTree: any[];
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);


  navigationTree: any[] = APP_MENU_ITEMS;

  navExpanded = true;

  form: any;

  constructor(
    private drawerMngr: DrawerService,
    private formViewService: FormViewService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.start();
      } else if (event instanceof NavigationEnd) {
        this.loadingService.complete();
        this.drawerMngr.destroyAll();
      }
    });
    this.filteredNavigationTree = this.deepCloneTree();
  }

  updateSearchValue(updatedVal: string) {
    const tree = this.deepCloneTree();

    if (!updatedVal) {
      this.filteredNavigationTree = tree;
    }

    updatedVal = updatedVal.toLowerCase();
    this.filteredNavigationTree = tree.map((nav) => {
      if (nav.children) {
        nav.children = nav.children.filter((child) =>
          child.name.toLowerCase().includes(updatedVal)
        );
      }

      return nav;
    });
  }

  onOpenBlockDialog() {
    this.formViewService.onOpenBlockDialog(true);
  }

  private deepCloneTree() {
    return JSON.parse(JSON.stringify(this.navigationTree));
  }
}
