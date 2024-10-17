// Angular import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { NavigationItem } from '../navigation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // public props
  @Output() NavCollapsedMob: EventEmitter<any> = new EventEmitter();

  // version
  currentApplicationVersion = environment.appVersion;

  navigation: any;
  windowWidth = window.innerWidth;

  // Constructor
  constructor(
    public nav: NavigationItem,
    private location: Location,
    private locationStrategy: LocationStrategy
  ) {
  }

  // Life cycle events
  ngOnInit() {


    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
    console.log(localStorage.getItem('Menu'));
    this.navigation = this.restructureNavigationData();
  }



   restructureNavigationData() {
    // Parse the JSON data from localStorage
    const rawData = JSON.parse(localStorage.getItem('Menu') || '[]');

    // Create the base structure for NavigationItems
    const NavigationItems = [
      {
        id: '',
        title: '',
        type: 'group',
        icon: '',
        children: []
      }
    ];

    // Iterate through each module in the raw data
    rawData.forEach(module => {
      const moduleItem = {
        id: module.nombre,
        title: module.nombre,
        type: 'collapse',
        icon: module.icon,
        children: []
      };

      // Add views as children of the module
      module.vistas.forEach(vista => {
        moduleItem.children.push({
          id: vista.nombre,
          title: vista.nombre,
          type: 'item',
          url: vista.ruta,
          target: true,
          breadcrumbs: false
        });
      });

      // Add the module to the root children
      NavigationItems[0].children.push(moduleItem);
    });

    return NavigationItems;
  }



  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }
}
