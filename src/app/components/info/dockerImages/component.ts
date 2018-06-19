import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select, dispatch } from '@angular-redux/store';
import { routerSelector } from '../../../store/location/selectors';
import { Language } from '../../../store/session/model';
import { LanguageActions } from '../../../store/session/actions';

import { DockerActions } from '../../../store/data/docker/actions';
import { dockerImagesSelector } from '../../../store/data/docker/selectors';
import { ImageInfo } from 'dockerode';
import { LayoutActions } from '../../../store/controls/layout/actions';

@Component({
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockerImagesComponent implements OnInit {

  @select(routerSelector) readonly router$: Observable<string>;
  @select(dockerImagesSelector) readonly dockerImages$: Observable<ImageInfo>;

  @dispatch() readonly changeLanguage = (language: Language) => LanguageActions.SET_LANGUAGE(language);
  @dispatch() readonly fetchDockerImages = () => DockerActions.FETCH_DOCKER_IMAGES({});

  @dispatch() readonly setNavItems = () => LayoutActions.SET_NAV({
    subNav: [
      { key: 'nav.images', link: '/info/images' },
      { key: 'nav.containers', link: '/info/containers' }
    ],
    sideNav: []
  })

  @dispatch() readonly setSideNavItems = () => LayoutActions.SET_SIDENAV([]);

  ngOnInit() {
    this.setNavItems();
    this.fetchDockerImages();
  }

}
