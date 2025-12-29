import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { BITSTREAMFORMATS_MODULE_PATH, DOCUMENTTYPETREETEMPLETE_MODULE_PATH } from './admin-registries-routing-paths';
import { DocumenttypeComponent } from './documenttype/documenttype.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'metadata',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: {title: 'admin.registries.metadata.title', breadcrumbKey: 'admin.registries.metadata'},
        children: [
          {
            path: '',
            component: MetadataRegistryComponent
          },
          {
            path: ':schemaName',
            resolve: { breadcrumb: I18nBreadcrumbResolver },
            component: MetadataSchemaComponent,
            data: {title: 'admin.registries.schema.title', breadcrumbKey: 'admin.registries.schema'}
          }
        ]
      },
      
      {
        path: 'documenttype',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'Document Type', breadcrumbKey: 'DocumentType' },
        children: [
          {
            path: '',
            component: DocumenttypeComponent
          }
        ]
      },
      {
        path: DOCUMENTTYPETREETEMPLETE_MODULE_PATH,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        loadChildren: () => import('./documenttypetreetemplet/documenttypetreetemplet.module')
          .then((m) => m.DocumenttypetreetempletModule),
        data: { title: 'admin.registries.documenttypetreetemplet.title', breadcrumbKey: 'admin.registries.documenttypetreetemplet' }
      },
      {
        path: BITSTREAMFORMATS_MODULE_PATH,
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        loadChildren: () => import('./bitstream-formats/bitstream-formats.module')
          .then((m) => m.BitstreamFormatsModule),
        data: {title: 'admin.registries.bitstream-formats.title', breadcrumbKey: 'admin.registries.bitstream-formats'}
      },
    ])
  ]
})
export class AdminRegistriesRoutingModule {

}
