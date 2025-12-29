import { NgModule } from '@angular/core';
import { MetadataRegistryComponent } from './metadata-registry/metadata-registry.component';
import { AdminRegistriesRoutingModule } from './admin-registries-routing.module';
import { CommonModule } from '@angular/common';
import { MetadataSchemaComponent } from './metadata-schema/metadata-schema.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MetadataSchemaFormComponent } from './metadata-registry/metadata-schema-form/metadata-schema-form.component';
import { MetadataFieldFormComponent } from './metadata-schema/metadata-field-form/metadata-field-form.component';
import { BitstreamFormatsModule } from './bitstream-formats/bitstream-formats.module';
import { FormModule } from '../../shared/form/form.module';
import { DocumenttypeFormComponent } from './documenttype/documenttype-form/documenttype-form.component';
import { DocumenttypeComponent } from './documenttype/documenttype.component';
import { DocumenttypetreetempletModule } from './documenttypetreetemplet/documenttypetreetemplet.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    BitstreamFormatsModule,
    AdminRegistriesRoutingModule,
    DocumenttypetreetempletModule,
    FormModule
  ],
  declarations: [
    MetadataRegistryComponent,
    MetadataSchemaComponent,
    MetadataSchemaFormComponent,
    MetadataFieldFormComponent,
    DocumenttypeComponent,
    DocumenttypeFormComponent
  ]
})
export class AdminRegistriesModule {

}
