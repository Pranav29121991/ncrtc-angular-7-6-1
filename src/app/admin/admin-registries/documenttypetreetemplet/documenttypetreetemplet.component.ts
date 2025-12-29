import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DocumentType } from './../../../core/shared/documenttype.model';
import { DocumenttypeTreeService } from './../../../core/data/documenttypetree.service'; import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { RequestService } from 'src/app/core/data/request.service';
import {  isEmpty } from '../../../shared/empty.util';
import { ITreeOptions, TreeComponent } from '@circlon/angular-tree-component';
import { takeUntilCompletedRemoteData, getFirstCompletedRemoteData, getFirstSucceededRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
import { BehaviorSubject, from as observableFrom, Observable, of as observableOf, Subscription } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { PaginationService } from 'src/app/core/pagination/pagination.service';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { DocumentTypeTree } from '../../../core/shared/documenttypetree.model';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { hasValue } from 'src/app/shared/empty.util';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { take, expand, first } from 'rxjs/operators';
import { NoContent } from 'src/app/core/shared/NoContent.model';
import { DocumenttypeService } from 'src/app/core/data/documenttype.service';
import { response } from 'express';
import { CdkDragDrop, moveItemInArray,
  transferArrayItem, } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ds-documenttypetreetemplet',
  templateUrl: './documenttypetreetemplet.component.html',
  styleUrls: ['./documenttypetreetemplet.component.scss']
})
export class DocumenttypetreetempletComponent implements OnInit {
  DocumentypeTempletForm
  subs: Subscription[] = [];
  documentTypeTree: DocumentTypeTree
  @ViewChild('tree') tree: TreeComponent;
  hideshow: boolean = false;
  isUpdate: boolean = false;
  selectednodefromOption: DocumentType;
  constructor(
    private documenttypeTreeService: DocumenttypeTreeService,
    private ds: DocumenttypeService,
    public requestService: RequestService,
    private paginationService: PaginationService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private modalService: NgbModal,
  ) {
    this.DocumentypeTempletForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      isDocType: [false],
      isDate: [false],
      isRemark: [false],
      isDescription: [false],
      hasSubChild: [false],
      nonrepetitive:[false]
    })
  }
  documentypes: Observable<RemoteData<PaginatedList<DocumentType>>>;
  selectedDocumentype: any;
  selectedNode: any = null;
  selectedNodeObj: DocumentTypeTree;
  treeOptions: ITreeOptions = {
    useCheckbox: false,
    allowDragoverStyling: true,
    levelPadding: 20,
    useVirtualScroll: false,
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    nodeHeight: 30,
    dropSlotHeight: 3,
  };
  nodeItems = [
  ];
  documentTypes: Array<DocumentType> = []
  removeChilde() {

  }
  getChildren(node): void {
    this.documenttypeTreeService._getChildByNodeIDByadmin(node.id, true).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((response: PaginatedList<DocumentTypeTree>) => {
      console.log(response)
      let children: Array<DocumentTypeTree> = [];
      node.data.children = []
      response.page.map((documentypetree: DocumentTypeTree) => {
        // delete documentypetree.children;
        node.data.children.push(documentypetree);

      })
      node.expand();
      this.tree.treeModel.update();
      this.cdRef.detectChanges();
    })
  }
  ngOnInit(): void {
    this.getRootDocument();
    this.getAllDocumentype();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
  ngAfterViewInit() {

  }
  clearSub() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
  public getRootDocument() {
    this.clearSub();
    this.documenttypeTreeService.getRootWndPoint("").pipe(
      getFirstSucceededRemoteData(),
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<PaginatedList<DocumentTypeTree>>) => {
      console.log(response)
      console.log(response.hasSucceeded)
      response.payload.page.map((documentypetree: DocumentTypeTree) => {
        // delete documentypetr,ee.children
        this.nodeItems.push(documentypetree)
      })
      this.tree.treeModel.update();
      //this.tree.treeModel.expandAll();
      this.cdRef.detectChanges();
      /* response.page.map((eperson) => {
       }*/
    })
  }
  public getAllDocumentype() {
    this.ds.findAll({ elementsPerPage: 1000 }).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<PaginatedList<DocumentType>>) => {
      response.payload.page.forEach((documenttype: DocumentType) => {
        this.documentTypes.push(documenttype)
      })
    })
    console.log(this.documentypes)
  }
  onActivateNode(event, isUpdateobj) {
    this.DocumentypeTempletForm.reset();
    console.log(event.data.index)
    this.hideshow = true;
    this.selectedNode = event;
    this.isUpdate = isUpdateobj;
    if (this.isUpdate) {
      this.documenttypeTreeService.findById(this.selectedNode.data.id).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((response: RemoteData<DocumentTypeTree>) => {
        this.selectedNodeObj = response.payload
        this.cdRef.detectChanges();
        this.setDocumentypeTempletForm(response.payload);
      })

    }

  }
  update() {
    this.hideshow = false;
    this.selectedNodeObj = this.updateObject(this.selectedNodeObj)
    this.documenttypeTreeService.updateDocumentTypeTree(this.selectedNodeObj).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<DocumentTypeTree>) => {
      if (response.hasSucceeded) {
        this.DocumentypeTempletForm.reset();
        this.selectedNode.data = response
        console.log(response)
        this.tree.treeModel.update();
        this.cdRef.detectChanges();
        this.notificationsService.success("Templet updated success", { name: "Templet" });
      } else {
        this.notificationsService.error("Something went wrong", { name: "Templet" });
      }
    });
  }
  updateToService(node:DocumentTypeTree,index:number,ObjectArray:Array<DocumentTypeTree>){
    this.documenttypeTreeService.updateDocumentTypeTree(node).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<DocumentTypeTree>) => {
      if (response.hasSucceeded) {    
        ObjectArray[index]=response.payload  
        this.tree.treeModel.update();
        this.cdRef.detectChanges();       
      } else {
        this.notificationsService.error("Something went wrong", { name: "Templet" });
      }
    });
  }
  moveNodeUp(node) {
    debugger;
    if (node.data.rootOfmaster) {
      let index = node.treeModel.nodes.findIndex(x => x.id === node.data.id);
      let indexobj = node.treeModel.nodes[index];
      let tempindex = indexobj.index;
      let nextIndexObj = node.treeModel.nodes[index-1];
      indexobj.index = nextIndexObj.index;
      nextIndexObj.index = tempindex;
      this.updateToService(indexobj, index-1, node.treeModel.nodes);
  
      this.updateToService(nextIndexObj, index, node.treeModel.nodes);

      
    } else {
      let index = node.parent.data.children.findIndex(x => x.id === node.data.id);
      let indexobj = node.parent.data.children[index];
      let tempindex = indexobj.index;
      let nextIndexObj = node.parent.data.children[index - 1];
      indexobj.index = nextIndexObj.index;
      nextIndexObj.index = tempindex;
      this.updateToService(indexobj, index - 1, node.parent.data.children);
      this.updateToService(nextIndexObj, index, node.parent.data.children);
      
    }
    
   // this.nodeswipe(node, nextIndex)
  } 
  nodeswipe(node, nextIndex) {
    //let index = node.data.index;
    if (node.data.rootOfmaster) {
      let index = node.treeModel.nodes.findIndex(x => x.id === node.data.id);
      console.log(node.treeModel.nodes[index]);
     // [node.treeModel.nodes[nextIndex], node.treeModel.nodes[index]] = [node.treeModel.nodes[index], node.treeModel.nodes[nextIndex]];
      let indexobj=node.treeModel.nodes[index]
      let nextIndexObj = node.treeModel.nodes[--index];
      indexobj.index = nextIndexObj.index;   
      nextIndexObj.index = indexobj.index;
      this.updateToService(indexobj,nextIndexObj.index,node.treeModel.nodes)
      this.updateToService(nextIndexObj, index,node.treeModel.nodes)
    } else {
      debugger;
      let index = node.parent.data.children.findIndex(x => x.id === node.data.id);
      let indexobj = node.parent.data.children[index]
      let nextIndexObj = node.treeModel.nodes[--index];
      // [node.parent.data.children[nextIndex], node.parent.data.children[index]] = [node.parent.data.children[index], node.parent.data.children[nextIndex]];
      // let indexobj=node.parent.data.children[index]
      // let nextIndexObj=node.parent.data.children[nextIndex]
      // indexobj.index = index   
      // nextIndexObj.index = nextIndex 
      // this.updateToService(indexobj,index,node.parent.data.children)
     // this.updateToService(nextIndexObj,nextIndex,node.parent.data.children)
    }
   
  }
  moveNodeDown(node) {
    if (node.data.rootOfmaster) {
      let index = node.treeModel.nodes.findIndex(x => x.id === node.data.id);
      let indexobj = node.treeModel.nodes[index];
      let tempindex = indexobj.index;
      let nextIndexObj = node.treeModel.nodes[index + 1];
      indexobj.index = nextIndexObj.index;
      nextIndexObj.index = tempindex;
      this.updateToService(indexobj, index + 1, node.treeModel.nodes);

      this.updateToService(nextIndexObj, index, node.treeModel.nodes);


    } else {
      let index = node.parent.data.children.findIndex(x => x.id === node.data.id);
      let indexobj = node.parent.data.children[index];
      let tempindex = indexobj.index;
      let nextIndexObj = node.parent.data.children[index + 1];
      indexobj.index = nextIndexObj.index;
      nextIndexObj.index = tempindex;
      this.updateToService(indexobj, index + 1, node.parent.data.children);
      this.updateToService(nextIndexObj, index, node.parent.data.children);

    }
  }
  onAdd() {
    if (this.selectednodefromOption != undefined) {
      this.hideshow = false;
      let documentTypeTreeObj: DocumentTypeTree = this.getdocumentTypeTreeObj(true)
      if (this.selectedNode != undefined && this.selectedNode.data != undefined) {
        documentTypeTreeObj.rootOfmaster = false;
        delete documentTypeTreeObj.children
        let parentObj: DocumentTypeTree = new DocumentTypeTree();
        delete parentObj.children
        parentObj.id = this.selectedNode.data.id
        documentTypeTreeObj.parent = parentObj
        this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObj).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((response: RemoteData<DocumentTypeTree>) => {
          console.log(response)
          if (response.hasSucceeded) {
            this.notificationsService.success("Templet Added success", { name: "Templet" });
            // delete response.payload.children
            this.selectedNode.data.children = [...this.selectedNode.data.children, response.payload];
            this.selectedNode.data.hasChildren = true,
              this.DocumentypeTempletForm.reset();
            this.tree.treeModel.update();
            this.cdRef.detectChanges();
            this.selectedNode.expand();


          } else {
            this.notificationsService.error("Something went wrong", { name: "Templet" });
          }
        })
      } else {
        documentTypeTreeObj.rootOfmaster = true;
        delete documentTypeTreeObj.children
        this.documenttypeTreeService.createDocumentypeTemplet(documentTypeTreeObj).pipe(
          getFirstCompletedRemoteData(),
        ).subscribe((response: RemoteData<DocumentTypeTree>) => {
          console.log(response)
          if (response.hasSucceeded) {
            this.notificationsService.success("Templet Added success", { name: "Templet" });
            //delete response.payload.children;     
            this.nodeItems.push(response.payload)
            this.tree.treeModel.update();
            this.DocumentypeTempletForm.reset();
            //this.cdRef.detectChanges();
          } else {
            this.notificationsService.error("Please select Documen Type", { name: "Templet" });
          }
        })

      }
    } else {
      this.notificationsService.error("Please select Dowcument Type", { name: "Templet" });
    }


  }
  cancle() {
    this.DocumentypeTempletForm.reset();
    this.selectedNode = null;
    this.hideshow = false;
  }
  clickHandler(event: any) {
    console.log(event.node.data.id)
  }
  deleteNode(node) {
    if (hasValue(node.id)) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = node;
      modalRef.componentInstance.headerLabel = 'Delete node';
      modalRef.componentInstance.infoLabel = 'Are you sure you want to delete node';
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-documenttype.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-documenttype.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          this.documenttypeTreeService.delete(node.id).pipe(getFirstCompletedRemoteData()).subscribe((restResponse: RemoteData<NoContent>) => {
            if (restResponse.hasSucceeded) {
              node.parent.data.children.splice(node.parent.data.children.indexOf(node.data), 1);
              if (node.parent.data.children.length === 0) {
                node.parent.data.hasChildren = false;
              }
              this.tree.treeModel.update();
              this.cdRef.detectChanges();
              this.notificationsService.success("Node deleted successfully", { name: "Node Templet" });
            } else {
              this.notificationsService.error("Something went wrong please try again", { name: "Node Templet" });
            }
          })
        }
      })
    }

  }
  hideshowFrom() {
    this.DocumentypeTempletForm.reset();
    this.selectedNode = null;
    this.hideshow = true;
  }
  getdocumentTypeTreeObj(isRootOfmaster: Boolean) {
    let docmentTypeTreeObj: DocumentTypeTree = new DocumentTypeTree();
    // let docmentTypeObj: DocumentType = new DocumentType();
    //docmentTypeObj.id=this.DocumentypeTempletForm.get("name").value
    docmentTypeTreeObj.isTemplet = true
    docmentTypeTreeObj.documentType = this.selectednodefromOption
    docmentTypeTreeObj.isDate = this.DocumentypeTempletForm.get("isDate").value
    docmentTypeTreeObj.isRemark = this.DocumentypeTempletForm.get("isRemark").value
    docmentTypeTreeObj.isDescription = this.DocumentypeTempletForm.get("isDescription").value
    docmentTypeTreeObj.hasSubChild = this.DocumentypeTempletForm.get("hasSubChild").value
    docmentTypeTreeObj.nonrepetitive = this.DocumentypeTempletForm.get("nonrepetitive").value
    
    docmentTypeTreeObj.rootOfmaster = isRootOfmaster
    docmentTypeTreeObj.children = [];
    return docmentTypeTreeObj
  }
  setDocumentypeTempletForm(documentTypeTree: DocumentTypeTree) {
    var selectedDocumenttype = this.documentTypes.find(element => {
      return element.id == documentTypeTree.documentType.id;
    })
    this.selectednodefromOption = selectedDocumenttype
    //this.DocumentypeTempletForm.controls['name'].patchValue(documentTypeTree.documentType,{onlySelf: true});
    this.DocumentypeTempletForm.controls['isDate'].patchValue(documentTypeTree.isDate, { onlySelf: true });
    this.DocumentypeTempletForm.controls['isRemark'].patchValue(this.selectedNode.data.isRemark, { onlySelf: true });
    this.DocumentypeTempletForm.controls['isDescription'].patchValue(this.selectedNode.data.isDescription, { onlySelf: true });
    this.DocumentypeTempletForm.controls['hasSubChild'].patchValue(this.selectedNode.data.hasSubChild, { onlySelf: true });
    this.DocumentypeTempletForm.controls['nonrepetitive'].patchValue(this.selectedNode.data.nonrepetitive, { onlySelf: true }); 
    this.cdRef.detectChanges();

  }
  updateObject(documentTypeTree: DocumentTypeTree): DocumentTypeTree {

    let docmentTypeTreeObj: DocumentTypeTree = Object.assign({}, documentTypeTree);
    docmentTypeTreeObj.documentType = this.selectednodefromOption
    docmentTypeTreeObj.isDate = this.DocumentypeTempletForm.get("isDate").value
    docmentTypeTreeObj.isRemark = this.DocumentypeTempletForm.get("isRemark").value
    docmentTypeTreeObj.isDescription = this.DocumentypeTempletForm.get("isDescription").value
    docmentTypeTreeObj.hasSubChild = this.DocumentypeTempletForm.get("hasSubChild").value
    docmentTypeTreeObj.nonrepetitive = this.DocumentypeTempletForm.get("nonrepetitive").value
    

    return docmentTypeTreeObj;
  }

  drop(event: CdkDragDrop<string[]>,node:any=null,index) {
     if (node.data.rootOfmaster) { 
      let previndex = node.treeModel.nodes.findIndex(x => x.id === node.data.id);
      moveItemInArray(node.treeModel.nodes, Number(event.previousContainer.id), index);
      let j= 0;
      for(const i of node.treeModel.nodes) {
        console.log(i);
        i.index = j;
        console.log(i, j)
        this.updateToService(i, j, node.treeModel.nodes);
        j++;
      }
    } else {
        let previndex = node.parent.data.children.findIndex(x => x.id === node.data.id);
      moveItemInArray(node.parent.data.children, Number(event.previousContainer.id), index);
      let j= 0;
      for(const i of node.parent.data.children) {
        console.log(i);
        i.index = j;
        this.updateToService(i, j, node.parent.data.children);
        j++;
      }
    }
    console.log(node.treeModel.nodes,'1');
    
   
  }
  // drop(event: CdkDragDrop<string[]>,node:any=null,index) {
  //   moveItemInArray([], event.previousIndex, event.currentIndex);
  // }
  
  clickedCatch(index) {
    console.log(index);
  }

}
