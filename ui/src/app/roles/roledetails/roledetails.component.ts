import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RolesService } from 'src/app/shared/roles/roles.service';
import { RoleFullDetails, RoleBasicDetails, RoleList, LdapGroupInfo, SiteInfo} from 'src/app/shared/roles/role-Info';

/* For Tree Structure */
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { PrivilegesService } from 'src/app/shared/privileges/privileges.service';
import { PrivilegeInfo, ApplicationPrivilege, SitePrivilegeInfo, ApplicationInfo } from 'src/app/shared/privileges/privilege-Info';
import { UsersService } from 'src/app/shared/users/users.service';
import { UserInfo } from 'src/app/shared/users/user-Info';
import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/shared/settings/settings.service';

export class TreeNode {
  NodeName: string;
  NodeId: number;
  NodeType: string;
  Children: TreeNode[];
  ApplicationId: number;
  Selected: boolean;
  ParentId: number;
}

export class TreeFlatNode {
  NodeName: string;
  NodeId: number;
  NodeType: string;
  Level: number;
  Expandable: boolean;
  Selected: boolean;
  ApplicationId: number;
  ParentId: number;
}

/* LDAP Tree */
export class LdapNode {
  NodeName: string;
  NodeId: number;
  NodeType: string;
  Children: LdapNode[];
  LdapConfigId: number;
  Selected: boolean;
}

export class LdapFlatNode {
  NodeName: string;
  NodeId: number;
  NodeType: string;
  Level: number;
  Expandable: boolean;
  Selected: boolean;
  LdapConfigId: number;
}

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.scss']
})

export class RoledetailsComponent implements OnInit {

  selectedApplicationId=0;

  searchText:string="";

  searchResult:any =[];

  selectedTabIndex:number=0;

  selectedApplicationIndex:number=0;

  showMessagePopup: any;

  roleMappingForm: FormGroup;

  roleFullInformation: RoleFullDetails;

  roleDetails: RoleBasicDetails;

  selectedApplicationPrivileges: PrivilegeInfo[] = [];

  selectedLdapGroups: LdapGroupInfo[] = [];

  selectedUsers: UserInfo[] = [];

  selectedSiteList: SiteInfo[] = [];

  applicationList: ApplicationInfo[];

  appPrivilegeList:any[];

  siteTreeData: TreeNode[] = [];

  selectedSiteNode: TreeFlatNode[] = [];

  /* for Update */
  mappedSiteList: SiteInfo[] = [];

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map < TreeFlatNode,
  TreeNode > ();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map < TreeNode,
  TreeFlatNode > ();

  /** A selected parent node to be inserted */
  selectedParent: TreeFlatNode | null = null;

  treeControl: FlatTreeControl < TreeFlatNode > ;

  treeFlattener: MatTreeFlattener < TreeNode,
  TreeFlatNode > ;

  dataSource: MatTreeFlatDataSource < TreeNode,
  TreeFlatNode > ;

  /** The selection for checklist */
  checklistSelection = new SelectionModel < TreeFlatNode > (true /* multiple */ );

  /* LDAP Tree */
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatLdapNodeMap = new Map < LdapFlatNode,
  LdapNode > ();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedLdapNodeMap = new Map < LdapNode,
  LdapFlatNode > ();

  /** A selected parent node to be inserted */
  selectedLdapParent: LdapFlatNode | null = null;

  treeLdapControl: FlatTreeControl < LdapFlatNode > ;

  treeLdapFlattener: MatTreeFlattener < LdapNode,
  LdapFlatNode > ;

  dataSourceLdap: MatTreeFlatDataSource < LdapNode,
  LdapFlatNode > ;

  /** The selection for checklist */
  checklistLdapSelection = new SelectionModel < LdapFlatNode > (true /* multiple */ );

  constructor(private fb: FormBuilder, private rolesService: RolesService, private privilegeService: PrivilegesService, private usersService: UsersService, private spinner: NgxSpinnerService, private settingsService: SettingsService) {
    this.roleMappingForm = this.fb.group({
      RoleName: new FormControl('', Validators.required),
      RoleDescription: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    // this.spinner.show();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl < TreeFlatNode > (this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    /* LDAP Tree */
    this.treeLdapFlattener = new MatTreeFlattener(this.transformerLdap, this.getLdapLevel, this.isExpandableLdap, this.getLdapChildren);
    this.treeLdapControl = new FlatTreeControl < LdapFlatNode > (this.getLdapLevel, this.isExpandableLdap);
    this.dataSourceLdap = new MatTreeFlatDataSource(this.treeLdapControl, this.treeLdapFlattener);

    this.privilegeService.getApplicationPrivilegesList();
    // this.privilegeService.applicationPrivileges.subscribe((applicationPrivilegeList) => {
    //   this.applicationList = this.privilegeService.applicationPrivileges.value.map(
    //     function (filteredData) {
    //       return {
    //         ApplicationId: filteredData.ApplicationPrivileges.Application.ApplicationVersionId,
    //         ApplicationName: filteredData.ApplicationPrivileges.Application.ApplicationName,
    //         ApplicationCode: filteredData.ApplicationPrivileges.Application.ApplicationCode,
    //       };
    //     });
    //   this.applicationList.sort((application1,application2)=>{
    //     //if(application1.ApplicationName.toLocaleLowerCase() > application2.ApplicationName.toLocaleLowerCase()){
    //     if(application1.ApplicationCode.toLocaleLowerCase() > application2.ApplicationCode.toLocaleLowerCase()){
    //       return 1;
    //     }
    //     else{
    //       return -1;
    //     }
    //   });
    //   this.selectedApplicationId=(this.applicationList.length>0)?this.applicationList[0].ApplicationId:0;
    // });

  /* Combine all the version */
    this.privilegeService.applicationPrivileges.subscribe((applicationPrivilegeList) => {
      this.applicationList =Array.from(new Set(this.privilegeService.applicationPrivileges.value
                            .map( application => application.ApplicationPrivileges.Application.ApplicationId)))
                            .map(applicationId => {
                              return {                                
                                    ApplicationId: applicationId,
                                    ApplicationName: this.privilegeService.applicationPrivileges.value.find(application => application.ApplicationPrivileges.Application.ApplicationId===applicationId).ApplicationPrivileges.Application.ApplicationName,
                                    ApplicationCode: this.privilegeService.applicationPrivileges.value.find(application => application.ApplicationPrivileges.Application.ApplicationId===applicationId).ApplicationPrivileges.Application.ApplicationCode,
                                    ApplicationVersionId: this.privilegeService.applicationPrivileges.value.find(application => application.ApplicationPrivileges.Application.ApplicationId===applicationId).ApplicationPrivileges.Application.ApplicationVersionId
                                  };
                              });

      this.appPrivilegeList= this.applicationList.map(application =>{
        let applicationPrivileges=[];
        this.privilegeService.applicationPrivileges.value
              .filter(appPrivilege => appPrivilege.ApplicationPrivileges.Application.ApplicationId === application.ApplicationId)
              .map(function (filteredData) {    
                applicationPrivileges= applicationPrivileges.concat(filteredData.ApplicationPrivileges.Privileges);                                                                
              });
        return {          
          ApplicationId: application.ApplicationId,
          Privileges:applicationPrivileges
        }
      });
      this.applicationList.sort((application1,application2)=>{
        if(application1.ApplicationCode.toLocaleLowerCase() > application2.ApplicationCode.toLocaleLowerCase()){
          return 1;
        }
        else{
          return -1;
        }
      });
      this.selectedApplicationId=(this.applicationList.length>0)?this.applicationList[0].ApplicationId:0;
    });

   this.rolesService.selectedRoleId.subscribe((roleId) => {
      // this.spinner.show();
      this.selectedTabIndex=0;
      this.selectedApplicationIndex=0;
      this.searchText="";
      this.mappedSiteList = [];
      this.selectedSiteNode=[];
      this.checklistSelection = new SelectionModel < TreeFlatNode > (true /* multiple */ );
      this.checklistLdapSelection = new SelectionModel < LdapFlatNode > (true /* multiple */ );
      if (roleId == 0) {
        this.GetDefaultConfig();
        // this.spinner.hide();
      } else {
        this.GetRoleInfo();
        // this.spinner.hide();
      }
    });
    this.rolesService.ldapTreeData.subscribe((ldapTreeData) => {
      this.GetLdapInfo();
    });
    this.usersService.selectedSecurityModel.subscribe((securityModel) => {
      if(this.usersService.selectedSecurityModel.value===0){        
        this.checklistLdapSelection = new SelectionModel < LdapFlatNode > (true /* multiple */ );
        this.GetLdapInfo();
      }
      else{
        this.selectedUsers=[];
      }
    });

    this.rolesService.siteInfo.subscribe((siteInfo) => {
      this.GetSiteInfo();
    });
    // this.spinner.hide();
  }

  buildFileTree(serviceData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = Object.keys(serviceData).length;

    for (let i = 0; i < totalObjectCount; i++) {
      const nodeData = Array.isArray(serviceData[i]) ? serviceData[i][0] : serviceData[i];

      const node = new TreeNode();
      node.NodeId = nodeData.NodeId;
      node.NodeName = nodeData.NodeName;
      node.NodeType = nodeData.NodeType;
      node.ApplicationId = nodeData.ApplicationVersionId;
      node.ParentId = nodeData.ParentId;
      /*ForExisting Role Details mapping changes*/
      node.Selected = false;
      node.Children = this.buildFileTree(nodeData.Children, level + 1);
      if (node.NodeType.toLocaleLowerCase() != 'application') {
        finalTreeData.push(node);
      }
    }
    this.siteTreeData = finalTreeData;
    return finalTreeData;
  }

  getLevel = (node: TreeFlatNode) => node.Level;

  isExpandable = (node: TreeFlatNode) => node.Expandable;

  getChildren = (node: TreeNode): TreeNode[] => node.Children;

  hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.Expandable;

  hasNoContent = (_: number, _nodeData: TreeFlatNode) => _nodeData.NodeName === '';

  /* LDAP Tree */
  buildLdapTree(serviceData: any, level: number) {
    let finalLdapData: LdapNode[] = [];   
    let totalObjectCount = Object.keys(serviceData).length;   
    for (let i = 0; i < totalObjectCount; i++) {    
     const nodeData = Array.isArray(serviceData) ? serviceData[i] : serviceData;
      const node = new LdapNode();
      node.NodeId = nodeData.NodeId;
      node.NodeName = nodeData.NodeName;
      node.NodeType = nodeData.NodeType;
      node.LdapConfigId = nodeData.LdapConfigId;

      /*ForExisting Role Details mapping changes*/
      node.Selected = false;

      // if(nodeData.Children.length>0)
      // {
        node.Children = this.buildLdapTree(nodeData.Children, level + 1);
      // }   
            
      finalLdapData.push(node);
    }
    return finalLdapData;
  }

  getLdapLevel = (node: LdapFlatNode) => node.Level;

  isExpandableLdap = (node: LdapFlatNode) => node.Expandable;

  getLdapChildren = (node: LdapNode): LdapNode[] => node.Children;

  hasChildLdap = (_: number, _nodeData: LdapFlatNode) => _nodeData.Expandable;

  hasNoContentLdap = (_: number, _nodeData: LdapFlatNode) => _nodeData.NodeName === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.NodeName === node.NodeName ?
      existingNode :
      new TreeFlatNode();
    flatNode.NodeName = node.NodeName;
    flatNode.NodeType = node.NodeType;
    flatNode.NodeId = node.NodeId;
    flatNode.Level = level;
    flatNode.Expandable = (node.Children.length > 0);
    flatNode.Selected = node.Selected;
    flatNode.ApplicationId = node.ApplicationId;
    flatNode.ParentId = node.ParentId;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TreeFlatNode): void {
    
    // let nodeIndex = this.mappedSiteList.findIndex((site) => site.SiteId === node.NodeId);

    // if (nodeIndex >= 0) {
    //   if (!this.checklistSelection.isSelected(node)) {
    //     this.checklistSelection.toggle(node);
    //   }
    // } else {
    //   this.checklistSelection.toggle(node);
    // }
    this.checklistSelection.toggle(node);

    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node) ?
      this.checklistSelection.select(...descendants) :
      this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);   
   // this.SetSelectedSite(node, this.checklistSelection.isSelected(node));
   this.SetSelectedSites(this.checklistSelection.selected);
  }
  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
   // this.SetSelectedSite(node, this.checklistSelection.isSelected(node));
   this.SetSelectedSites(this.checklistSelection.selected);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeFlatNode): void {
    let parent: TreeFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeFlatNode): TreeFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /* LDAP Tree */
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformerLdap = (node: LdapNode, level: number) => { 
    const existingNode = this.nestedLdapNodeMap.get(node);
    const flatNode = existingNode && existingNode.NodeName === node.NodeName ?
      existingNode :
      new LdapFlatNode();
    flatNode.NodeName = node.NodeName;
    flatNode.NodeType = node.NodeType;
    flatNode.NodeId = node.NodeId;
    flatNode.Level = level;
    flatNode.LdapConfigId = node.LdapConfigId;
    flatNode.Expandable = (node.Children.length > 0);
    flatNode.Selected = node.Selected;
    this.flatLdapNodeMap.set(flatNode, node);
    this.nestedLdapNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelectedLdap(node: LdapFlatNode): boolean {
    const descendants = this.treeLdapControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistLdapSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelectedLdap(node: LdapFlatNode): boolean {
    const descendants = this.treeLdapControl.getDescendants(node);
    const result = descendants.some(child => this.checklistLdapSelection.isSelected(child));
    return result && !this.descendantsAllSelectedLdap(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggleLdap(node: LdapFlatNode): void {
    this.checklistLdapSelection.toggle(node);
    const descendants = this.treeLdapControl.getDescendants(node);
    this.checklistLdapSelection.isSelected(node) ?
      this.checklistLdapSelection.select(...descendants) :
      this.checklistLdapSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistLdapSelection.isSelected(child)
    );
    this.checkAllParentsSelectionLdap(node);

    //this.GetSelectedApplication(this.checklistLdapSelection.selected);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggleLdap(node: LdapFlatNode): void {
    this.checklistLdapSelection.toggle(node);
    this.checkAllParentsSelectionLdap(node);
    //this.GetSelectedGroup(this.checklistLdapSelection.selected);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelectionLdap(node: LdapFlatNode): void {
    let parent: LdapFlatNode | null = this.getParentNodeLdap(node);
    while (parent) {
      this.checkRootNodeSelectionLdap(parent);
      parent = this.getParentNodeLdap(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelectionLdap(node: LdapFlatNode): void {
    const nodeSelected = this.checklistLdapSelection.isSelected(node);
    const descendants = this.treeLdapControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistLdapSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistLdapSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistLdapSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNodeLdap(node: LdapFlatNode): LdapFlatNode | null {
    const currentLevel = this.getLdapLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeLdapControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeLdapControl.dataNodes[i];

      if (this.getLdapLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  GetSiteInfo() {
    // this.spinner.show();
    const data = this.buildFileTree(this.rolesService.siteInfo.value, 0);
    this.dataSource.data = data;
    this.treeControl.expand(this.treeControl.dataNodes[0]);

    if (this.selectedSiteList.length > 0) {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        let isNodeSelected = (this.selectedSiteList.findIndex(element => element.SiteId === this.treeControl.dataNodes[i].NodeId) >= 0 ? true : false); 
        if (isNodeSelected) {
          if(!this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
          {
            this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
            this.treeControl.expand(this.treeControl.dataNodes[i]);
          }          
        }
      }
    }
    // this.spinner.hide();
  }

  GetLdapInfo() {
    // this.spinner.show();
    let ldapGroupData=this.rolesService.ldapTreeData.value;
    let data=[];
    data = this.buildLdapTree(this.rolesService.ldapTreeData.value, 0);  
    this.dataSourceLdap.data = data;
    this.treeLdapControl.expand(this.treeLdapControl.dataNodes[0]);    

    if (this.selectedLdapGroups.length > 0) {
      for (let i = 0; i < this.treeLdapControl.dataNodes.length; i++) {
        let isNodeSelected = (this.selectedLdapGroups.findIndex(element => element.GroupId === this.treeLdapControl.dataNodes[i].NodeId && element.LdapId === this.treeLdapControl.dataNodes[i].LdapConfigId ) >= 0 ? true : false);           
        if (isNodeSelected) {
          if(!this.checklistLdapSelection.isSelected(this.treeLdapControl.dataNodes[i]))
          {
            this.todoLeafItemSelectionToggleLdap(this.treeLdapControl.dataNodes[i]);
            //this.treeLdapControl.expand(this.treeLdapControl.dataNodes[i]);
          }          
        }
      }
    }
    // this.spinner.hide();
  }

  OnCancelClick() {
    this.rolesService.setRoleId(0);
  }

  OnSaveClick() {
    let roleInfoToInsert: RoleFullDetails = new RoleFullDetails();
    let roleDetailsToInsert: RoleBasicDetails = new RoleBasicDetails();
    let mappedPrivileges: PrivilegeInfo[] = [];
    let groupDetails: LdapGroupInfo[] = [];
    let userDetails: UserInfo[] = [];
    let siteDetails: SiteInfo[] = [];

    /* Role Basic Details */

    roleDetailsToInsert.RoleName = this.roleMappingForm.controls.RoleName.value;
    roleDetailsToInsert.RoleDescription = this.roleMappingForm.controls.RoleDescription.value;
    /* Site Details */
    this.selectedSiteList = this.selectedSiteNode.map((site) => {
      return Object.assign(new SiteInfo, {
        SiteId: site.NodeId
      })
    });

    siteDetails = this.selectedSiteList;

    /* Privileges Details */
    mappedPrivileges = this.selectedApplicationPrivileges;

    /* LDAP Group Details */
    this.selectedLdapGroups=this.GetSelectedGroup(this.checklistLdapSelection.selected);
    groupDetails = this.selectedLdapGroups;

    /* User Details */
    userDetails = this.selectedUsers;

    /* Assign to Role Full details */
    roleInfoToInsert.RoleDetails = roleDetailsToInsert;
    roleInfoToInsert.MappedPrivileges = mappedPrivileges;
    roleInfoToInsert.MappedGroups = groupDetails;
    roleInfoToInsert.MappedSites = siteDetails;
    roleInfoToInsert.MappedUsers = userDetails;

    this.rolesService.saveRoleInfo(roleInfoToInsert, (response, err) => {
      if (err) {
        this.showMessagePopup = {
          show: true,
          message: (err.error.RoleRegistrationResponse)?err.error.RoleRegistrationResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
      } else {

        this.showMessagePopup = {
          show: true,
          message: "Saved Successfully!!.",
          status: true
        };
        this.DismissMessagePopup();
      }
      this.rolesService.getRoleList((res: RoleList[], err) => {
        if (err) {} else {
          this.rolesService.setRoleId(response.RoleId);
        }
      });
    });
  }

  OnUpdateClick() {
    let roleInfoToInsert: RoleFullDetails = new RoleFullDetails();
    let roleDetailsToInsert: RoleBasicDetails = new RoleBasicDetails();
    let mappedPrivileges: PrivilegeInfo[] = [];
    let groupDetails: LdapGroupInfo[] = [];
    let userDetails: UserInfo[] = [];
    let siteDetails: SiteInfo[] = [];

    /* Role Basic Details */
    roleDetailsToInsert.RoleId = this.rolesService.selectedRoleId.value;
    roleDetailsToInsert.RoleName = this.roleMappingForm.controls.RoleName.value;
    roleDetailsToInsert.RoleDescription = this.roleMappingForm.controls.RoleDescription.value;

    /* Site Details */
    this.selectedSiteList = this.selectedSiteNode.map((site) => {
      return Object.assign(new SiteInfo, {
        SiteId: site.NodeId
      })
    });

    siteDetails = this.selectedSiteList;

    /* Privileges Details */
    mappedPrivileges = this.selectedApplicationPrivileges;

    /* LDAP Group Details */
    this.selectedLdapGroups=this.GetSelectedGroup(this.checklistLdapSelection.selected);
    groupDetails = this.selectedLdapGroups;

    /* User Details */
    userDetails = this.selectedUsers;

    /* Assign to Role Full details */
    roleInfoToInsert.RoleDetails = roleDetailsToInsert;
    roleInfoToInsert.MappedPrivileges = mappedPrivileges;
    roleInfoToInsert.MappedGroups = groupDetails;
    roleInfoToInsert.MappedSites = siteDetails;
    roleInfoToInsert.MappedUsers = userDetails;

    this.rolesService.updateRoleInfo(roleInfoToInsert, (response, err) => {
      if (err) {
        this.showMessagePopup = {
          show: true,
          message: (err.error.RoleUpdateResponse)?err.error.RoleUpdateResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
      } else {
        this.showMessagePopup = {
          show: true,
          message: "Updated Successfully!!.",
          status: true
        };
        this.DismissMessagePopup();
      }
      this.rolesService.getRoleList((res: RoleList[], err) => {
        if (err) {} else {          
          this.roleDetails.RoleName=response.RoleName;
          this.rolesService.setRoleId(response.RoleId);
        }
      });
    });
  }

  GetRoleInfo() {
    // this.spinner.show();
    this.rolesService.getRoleInfo((response: RoleFullDetails, err) => {
      if (err) {
        this.GetSiteInfo();
        this.GetLdapInfo();
      } else {           
        this.roleFullInformation = response;

        /* Basic Information */
        this.roleDetails = response.RoleDetails;

        this.roleMappingForm.patchValue({
          RoleName: this.roleDetails.RoleName,
          RoleDescription: this.roleDetails.RoleDescription
        });

        Object.values(this.roleMappingForm.controls).forEach(control => {
          control.markAsTouched();
          control.setErrors(null);
        });

        /* Site Details */
        this.selectedSiteList = response.MappedSites;
       
        /* for Update */
        this.mappedSiteList = response.MappedSites;

        /* Privileges Details */
        // this.selectedApplicationPrivileges = Array.from(new Set(response.MappedPrivileges.map(privilege => privilege.PrivilegeId))).map(privilege => {
        //   return Object.assign(new PrivilegeInfo, {
        //     PrivilegeId: privilege
        //   })
        // });
        this.selectedApplicationPrivileges =response.MappedPrivileges;

        /* Ldap Groups Details */
        this.selectedLdapGroups = response.MappedGroups;

        /* User Details */
        this.selectedUsers = response.MappedUsers;
        this.GetSiteInfo();
        this.GetLdapInfo();
        // this.spinner.hide();
      }
    });
  }

  GetDefaultConfig() {
    // this.spinner.show();
    this.selectedApplicationId=(this.applicationList.length>0)?this.applicationList[0].ApplicationId:0;
    this.roleMappingForm.reset();
    this.roleFullInformation = new RoleFullDetails();

    /* Site Details */
    this.selectedSiteList = [];

    /* Privileges Details */
    this.selectedApplicationPrivileges = [];

    /* Ldap Groups Details */
    this.selectedLdapGroups = [];

    /* User Details */
    this.selectedUsers = [];

    /* Mapped Sites for Update */
    this.mappedSiteList = [];

    this.GetSiteInfo();
    this.GetLdapInfo();
    // this.spinner.hide();
  }

  // GetApplicationPrivileges(applicationId) {
  //   // return this.privilegeService.applicationPrivileges.value.filter(appPrivilege => appPrivilege.ApplicationPrivileges.Application.ApplicationVersionId === applicationId).map(
  //   //   function (filteredData) {
  //   //     return filteredData.ApplicationPrivileges.Privileges;
  //   //   }); 
  //   let applicationPrivileges= [];
  //   this.privilegeService.applicationPrivileges.value
  //                             .filter(appPrivilege => appPrivilege.ApplicationPrivileges.Application.ApplicationId === applicationId)
  //                             .map(function (filteredData) {    
  //                               applicationPrivileges= applicationPrivileges.concat(filteredData.ApplicationPrivileges.Privileges);                                                                
  //                              }); 
    
  //   // return Array.from(new Set([...jointArray]))
  //   console.log("applicationPrivileges-",applicationPrivileges);
  //   return applicationPrivileges;
  // }

  CheckMappedDetails(privilegeId) {
    let isAlreadyInserted = this.selectedApplicationPrivileges.findIndex(value => value.PrivilegeId === privilegeId) >= 0 ? true : false;
    return isAlreadyInserted;
  }

  PrivilegeSelectionChange(checkboxInfo, privilege) {
    if (checkboxInfo.checked) {
      //let isAlreadyInserted = this.selectedApplicationPrivileges.findIndex(value => value.PrivilegeId === privilege.PrivilegeId) >= 0 ? true : false;
      let isAlreadyInserted = this.CheckMappedDetails( privilege.PrivilegeId);
      if (!isAlreadyInserted) {
        let newSelectedPrivilege = new PrivilegeInfo();
        newSelectedPrivilege.PrivilegeId = privilege.PrivilegeId;
        newSelectedPrivilege.PrivilegeName = privilege.PrivilegeName;
        this.selectedApplicationPrivileges.push(newSelectedPrivilege);
      }
    } else {
      let insertedIndex = this.selectedApplicationPrivileges.findIndex(value => value.PrivilegeId === privilege.PrivilegeId);
      if (insertedIndex >= 0) {
        this.selectedApplicationPrivileges.splice(insertedIndex, 1);
      }
    }
  }

  DismissMessagePopup() {
    setTimeout(() => {
      this.showMessagePopup.show = false;
    }, 2000);
  }

  GetSelectedGroup(checklistSelection) {
    let selectedValues = [];
    let selectedGroupInfo: LdapGroupInfo[] = [];
    let selectedItems = this.rolesService.ldapTreeData.value.filter((treenode) => {
      let selectedItem = checklistSelection.filter((group) => {
        if (group.LdapConfigId === treenode.NodeId && group.NodeType === "Group") {
          return group;
        }
      }).map((filteredData) => {
        let filteredValue: LdapGroupInfo = new LdapGroupInfo();
        selectedValues.push({
          GroupName: filteredData.NodeName,
          DomainName: treenode.NodeName
        });
        filteredValue.GroupId = filteredData.NodeId;
        filteredValue.GroupName = filteredData.NodeName;
        filteredValue.LdapId = filteredData.LdapConfigId;
        filteredValue.LdapName = treenode.NodeName;
        selectedGroupInfo.push(filteredValue);
        return filteredData;
      })
    });
    return selectedGroupInfo.sort((group1,group2)=>{
      if(group1.GroupName.toLocaleLowerCase()>group2.GroupName.toLocaleLowerCase())
      {
        return 1;
      }
      else{
        return -1;
      }
    });
    //this.selectedLdapGroups = selectedGroupInfo;
  }

  CheckSelectedUser(userId) {
    let selectedUser = this.selectedUsers.filter((user) => user.User.UserId === userId);
    return (selectedUser.length === 0) ? false : true;
  }

  UserSelectionChange(userCheckBox, userId) {
    if (userCheckBox.checked) {
      this.selectedUsers.push(Object.assign(new UserInfo,{User:{UserId:userId}}));
    } else {
      let selectedIndex = this.selectedUsers.findIndex(value => value.User.UserId === userId);
      if (selectedIndex >= 0) {
        this.selectedUsers.splice(selectedIndex, 1);
      }
    }    
  }

  SetSelectedSite(node, isSelected) {
    let childNodes = this.GetAllSelectedChildSite(node);
    if (isSelected) {
      let isAlreadyAvailable = this.selectedSiteNode.findIndex(element => element === node.NodeId) > 0 ? true : false;
      if (!isAlreadyAvailable) {
        this.selectedSiteNode.push(node);
        if (childNodes.length > 0) {
          childNodes.forEach((child) => {
            let isChildAvailable = this.selectedSiteNode.findIndex(element => element.NodeId === child.NodeId) > 0 ? true : false;
            if (!isChildAvailable) {
              this.selectedSiteNode.push(child);
            }
          });
        }
      }
    } else {
      this.selectedSiteNode = this.selectedSiteNode.filter(value => this.checklistSelection.selected.includes(value));
    }
    // this.selectedSiteList = this.selectedSiteNode.map((site) => {
    //   return Object.assign(new SiteInfo, {
    //     SiteId: site.NodeId
    //   })
    // });

    /* for no site seletced */
    // if (this.selectedSiteNode.length === 0) {
    //   this.selectedApplicationPrivileges = [];
     
    // }
  }

  GetAllSelectedChildSite(node) {
    let finalChildData: TreeFlatNode[] = [];

    let childNodes = this.checklistSelection.selected.filter((dataNode) => dataNode.ParentId === node.NodeId);
    childNodes.forEach((child) => {
      finalChildData.push(child);
    });
    for (let i = 0; i < childNodes.length; i++) {
      let filteredNodes = this.GetAllSelectedChildSite(childNodes[i]);
      filteredNodes.forEach((child) => {
        finalChildData.push(child);
      });
    }
    return finalChildData;
  }

  GetSelectedAppPrivileges(applicationId)
  {    
    let totalPrivileges=[];
    totalPrivileges=this.selectedApplicationPrivileges.filter(privilege=>
      {
        //if(this.GetApplicationPrivileges(applicationId)[0].find(appPrivilege=> appPrivilege.Privilege.PrivilegeId===privilege.PrivilegeId))
        let isPrivilegeSelected=this.appPrivilegeList.filter(appPrivilege => appPrivilege.ApplicationId===applicationId)
                                .find(appPrivilege=>{
                                  return appPrivilege.Privileges.find( privilegeDetails => privilegeDetails.Privilege.PrivilegeId===privilege.PrivilegeId);
                                });
        if(isPrivilegeSelected)
        {
          return true;
        }
        else{
          return false;
        }
      }            
    );   
    return totalPrivileges.length;
  }

  SetSelectedSites(checklistSelection)
  {
    this.selectedSiteNode=checklistSelection;
    /* NO site selected Changes */
    // if (this.selectedSiteNode.length === 0) {
    //   this.selectedApplicationPrivileges = [];
    // }
  }

   
  onSearchGroupEvent(){    
    if(this.searchText.trim().length>0){
    
    this.searchResult=[];
    
     for(let i=0;i<this.dataSourceLdap.data.length;i++){
        let test=this.dataSourceLdap.data[i].Children[0].Children.filter((group)=> {        
            return group.NodeName.toLocaleLowerCase().indexOf(this.searchText.trim().toLocaleLowerCase())>=0;         
        }).map((group)=>{         
            return {
              LdapId:this.dataSourceLdap.data[i].NodeId,
              LdapName:this.dataSourceLdap.data[i].NodeName,
              GroupId:group.NodeId,
              GroupName:group.NodeName
            };         
        });        
        this.searchResult=this.searchResult.concat(test);      
     }
    
    }
  }

  onSearchChecked(groupDetails){

    let isNodeSelected = this.checklistLdapSelection.selected.findIndex(element=> element.NodeId===groupDetails.GroupId && element.LdapConfigId===groupDetails.LdapId) >= 0 ? true : false;
    return isNodeSelected;
  }

  checkSearchSelected(groupDetails,checkbox){
    if(checkbox.checked===true){
      this.selectedLdapGroups.push(groupDetails);
        if (this.selectedLdapGroups.length > 0) {
          for (let i = 0; i < this.treeLdapControl.dataNodes.length; i++) {
            let isNodeSelected = (this.selectedLdapGroups.findIndex(element => element.GroupId === this.treeLdapControl.dataNodes[i].NodeId && element.LdapId === this.treeLdapControl.dataNodes[i].LdapConfigId ) >= 0 ? true : false);           
            if (isNodeSelected) {
              if(!this.checklistLdapSelection.isSelected(this.treeLdapControl.dataNodes[i]))
              {
                this.todoLeafItemSelectionToggleLdap(this.treeLdapControl.dataNodes[i]);
              }          
            }
          }
        }
    }
    else{
      for (let i = 0; i < this.treeLdapControl.dataNodes.length; i++) {        
        if (this.treeLdapControl.dataNodes[i].NodeId===groupDetails.GroupId && this.treeLdapControl.dataNodes[i].LdapConfigId===groupDetails.LdapId) {
          if(this.checklistLdapSelection.isSelected(this.treeLdapControl.dataNodes[i]))
          {
            this.todoLeafItemSelectionToggleLdap(this.treeLdapControl.dataNodes[i]);
          }          
        }
      }
    }
   
    return false;
  }
}
