import { Component, OnInit } from '@angular/core';


/* For Tree Structure */
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { ApplicationPrivilege } from 'src/app/shared/privileges/privilege-Info';
import { PrivilegesService } from 'src/app/shared/privileges/privileges.service';
import { RolesService } from 'src/app/shared/roles/roles.service';
import { SiteUserInfo, SiteLdapGroupInfo } from 'src/app/shared/users/user-Info';
import { UsersService } from 'src/app/shared/users/users.service';
import { SettingsService } from 'src/app/shared/settings/settings.service';

export class TreeNode {
  NodeName: string;
  NodeId: number;
  NodeType: string;
  Children: TreeNode[];
  TotalCount: number;
  ParentId: number;
}

export class TreeFlatNode {
  NodeName: string;
  NodeId: number;
  NodeType: string;
  TotalCount: number;
  Level: number;
  Expandable: boolean;
  ParentId: number;
}

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss']
})
export class PrivilegesComponent implements OnInit {

  allTreeNode=[];

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map < TreeFlatNode, TreeNode > ();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map < TreeNode, TreeFlatNode > ();

  /** A selected parent node to be inserted */
  selectedParent: TreeFlatNode | null = null;

  treeControl: FlatTreeControl < TreeFlatNode > ;

  treeFlattener: MatTreeFlattener < TreeNode, TreeFlatNode > ;

  dataSource: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;

  /** The selection for checklist */
  checklistSelection = new SelectionModel < TreeFlatNode > (true /* multiple */ );


  /* Role Tree */

   /** Map from flat node to nested node. This helps us finding the nested node to be modified */
   flatRoleNodeMap = new Map < TreeFlatNode, TreeNode > ();

   /** Map from nested node to flattened node. This helps us to keep the same object for selection */
   nestedRoleNodeMap = new Map < TreeNode, TreeFlatNode > ();
 
   /** A selected parent node to be inserted */
   selectedRoleParent: TreeFlatNode | null = null;
 
   treeRoleControl: FlatTreeControl < TreeFlatNode > ;
 
   treeRoleFlattener: MatTreeFlattener < TreeNode, TreeFlatNode > ;
 
   dataSourceRole: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;

   dataSourceUser: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;
 
   dataSourceLdap: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;
 
   /** The selection for checklist */
   checklistRoleSelection = new SelectionModel < TreeFlatNode > (true /* multiple */ );

  constructor(private privilegeService: PrivilegesService,private roleService: RolesService, private usersService:UsersService, private settingsService: SettingsService) {}

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl < TreeFlatNode > (this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);   
    
    /* Role Tree */
    this.treeRoleFlattener = new MatTreeFlattener(this.transformerRole, this.getRoleLevel,
      this.isRoleExpandable, this.getRoleChildren);
    this.treeRoleControl = new FlatTreeControl < TreeFlatNode > (this.getRoleLevel, this.isRoleExpandable );

    this.dataSourceRole = new MatTreeFlatDataSource(this.treeControl, this.treeRoleFlattener);

    this.dataSourceUser = new MatTreeFlatDataSource(this.treeControl, this.treeRoleFlattener);

    this.dataSourceLdap = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.privilegeService.getApplicationPrivilegesList();

    this.privilegeService.applicationPrivileges.subscribe((applicationPrivilegeList) => {
      this.GetSiteInfo();
      this.GetRoleSiteInfo();
      this.GetUserSiteInfo();
      this.GetLdapGroupSiteInfo();
    });
    
    this.roleService.siteRoleInfo.subscribe((siteRoles) => {
      this.GetSiteInfo();
    });
    this.roleService.siteUserInfo.subscribe((siteUsers) => {
      this.GetUserSiteInfo();
    });
    this.roleService.siteLdapGroupInfo.subscribe((siteLdapGroups) => {
      this.GetLdapGroupSiteInfo();
    });

    // this.roleService.getSiteInfo((res, err) => {
    //   if (err) {} else {}
    // });

    // if(this.roleService.siteTreeErrorMessage.value==='' && this.roleService.siteInfo.value.length===0){
    //   this.roleService.getSiteInfoFromEC((res, err) => {
    //     if (err) {
    //     } else {        
    //     }
    //   });
    // }

    this.roleService.siteInfo.subscribe((siteInfo)=>{
      this.allTreeNode=[];
      this.GetTreeFlatNode(this.roleService.siteInfo.value);
      this.GetRoleSiteInfo(); 
      this.GetUserSiteInfo();
      this.GetLdapGroupSiteInfo();   
    });
    this.GetSelectedPrivileges(this.checklistSelection.selected);
  }

  buildFileTree(serviceData: ApplicationPrivilege[], level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = serviceData.length;
    for (var i = 0; i < totalObjectCount; i++) {
      const node = new TreeNode();
      node.NodeId = serviceData[i].Application.ApplicationId;
      // node.NodeName = serviceData[i].Application.ApplicationName;
      node.NodeName = serviceData[i].Application.ApplicationName;
      node.NodeType = "application";
      if (serviceData[i].Privileges.length > 0) {
        node.Children = this.buildPrivilegeTree(serviceData[i].Privileges, level + 1)
      }

      finalTreeData.push(node);
    }
    return finalTreeData;
  }

  buildPrivilegeTree(privilegeData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    if (privilegeData.length > 0) {
      let totalObjectCount = privilegeData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = privilegeData[i].Privilege.PrivilegeId;
        node.NodeName = privilegeData[i].Privilege.PrivilegeName;
        node.NodeType = "privilege";
        node.Children = [];
        finalTreeData.push(node);
      }
      return finalTreeData;
    } else {
      return finalTreeData;
    }
  }

  getLevel = (node: TreeFlatNode) => node.Level;

  isExpandable = (node: TreeFlatNode) => node.Expandable;

  getChildren = (node: TreeNode): TreeNode[] => node.Children;

  hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.Expandable;

  hasNoContent = (_: number, _nodeData: TreeFlatNode) => _nodeData.NodeName === '';

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
    flatNode.TotalCount=node.TotalCount;
    flatNode.Level = level;
    flatNode.Expandable = (node.Children.length > 0);
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
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeFlatNode): void {
    this.checklistSelection.toggle(node);
    this.GetSelectedPrivileges(this.checklistSelection.selected);
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

  GetSiteInfo() {
    //this.GetPrivilegesForRoles();
   
    // const data = this.buildFileTree(this.privilegeService.applicationPrivileges.value.map(
    //   function (filteredData) {
    //     return filteredData.ApplicationPrivileges;
    //   }), 0);

    const data = this.buildFileTree(Array.from(new Set(this.privilegeService.applicationPrivileges.value
                  .map( application => application.ApplicationPrivileges.Application.ApplicationId)))
                  .map(applicationId => {
                    let applicationPrivileges=[];
                    this.privilegeService.applicationPrivileges.value
                          .filter(appPrivilege => appPrivilege.ApplicationPrivileges.Application.ApplicationId === applicationId)
                          .map(function (filteredData) {    
                            applicationPrivileges= applicationPrivileges.concat(filteredData.ApplicationPrivileges.Privileges);                                                                
                          });
                    return {
                      Application:{
                        ApplicationId:applicationId,
                        ApplicationName: this.privilegeService.applicationPrivileges.value.find(application => application.ApplicationPrivileges.Application.ApplicationId===applicationId).ApplicationPrivileges.Application.ApplicationName,
                        ApplicationCode: this.privilegeService.applicationPrivileges.value.find(application => application.ApplicationPrivileges.Application.ApplicationId===applicationId).ApplicationPrivileges.Application.ApplicationCode
                      },
                      Privileges:applicationPrivileges
                    };
                  }) , 0);
    this.dataSource.data = data;
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  GetSelectedPrivileges(checklistSelection) {
    let selectedPrivilegesId = checklistSelection.map((selectedItem) => {
      return selectedItem.NodeId;
    });
    this.privilegeService.getPrivilegeSiteRoleInfo(selectedPrivilegesId);
    this.privilegeService.getPrivilegeSiteUserInfo(selectedPrivilegesId);
    this.privilegeService.getPrivilegeSiteLdapInfo(selectedPrivilegesId);

    this.privilegeService.sitePrivilegeRoleInfo.subscribe(siteRoles => {
      this.GetRoleSiteInfo();
    }); 
    this.privilegeService.sitePrivilegeUserInfo.subscribe(siteUsers => {
      this.GetUserSiteInfo();
    });  
    this.privilegeService.sitePrivilegeLdapInfo.subscribe(siteLdap => {
      this.GetLdapGroupSiteInfo();
    }); 
  }


  /* Roles Tree */
  buildRoleFileTree(serviceData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = serviceData.length;
    for (var i = 0; i < totalObjectCount; i++) {
      const nodeData=Array.isArray(serviceData[i])?serviceData[i][0]:serviceData[i];
      if (nodeData.NodeType.toLowerCase() === 'enterprise-hierarchy') {
      const node = new TreeNode();
      node.NodeId = nodeData.NodeId;
      node.NodeName = nodeData.NodeName;     
      node.NodeType =nodeData.NodeType; 

      let roles= this.privilegeService.sitePrivilegeRoleInfo.value.filter(role => role.SiteRole.SiteId===nodeData.NodeId).map(function(filteredData){
        return filteredData.SiteRole;
      });

      /* Start Change for Dynamically added Child */
      
        let siteParentRoles = [];
        if(siteParentRoles.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while( currentSiteId!=null ){          
            siteParentRoles=this.privilegeService.sitePrivilegeRoleInfo.value.filter(role => role.SiteRole.SiteId===currentSiteId).map(function(filteredData){
              return filteredData.SiteRole;
            });   
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            roles=roles.concat(siteParentRoles);
          }      
        }
        roles=roles.concat(siteParentRoles);
        
        roles= Array.from(new Set(roles.map(role =>role.RoleId))).map(roleId =>{
          return {
              SiteId:node.NodeId,
              RoleId:roleId,
              RoleName:roles.find(role=>role.RoleId===roleId).RoleName           
          }
        });
      
        
        /* End Change for Dynamically added Child */
      node.TotalCount=this.GetMappedRolesCount(nodeData);
      if(roles.length>0)
      {
        let siteRolesTree = this.buildRoleTree(roles, level + 1);
        let siteTree = this.buildRoleFileTree(nodeData.Children, level + 1);
        node.Children = siteRolesTree.concat(siteTree);
      }
      else{
        node.Children=this.buildRoleFileTree(nodeData.Children,level+1);
      }
      finalTreeData.push(node);
    }
  }
    return finalTreeData;
  }

  buildRoleTree(roleData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    if (roleData.length > 0) {
      let totalObjectCount = roleData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = roleData[i].RoleId;
        node.NodeName =roleData[i].RoleName;
        node.NodeType = "role";
        node.Children = [];
        finalTreeData.push(node);
      }
      return finalTreeData;
    } else {
      return finalTreeData;
    }
  }

  /* Users Tree */
  buildUserFileTree(serviceData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = serviceData.length;
    for (var i = 0; i < totalObjectCount; i++) {
      const nodeData=Array.isArray(serviceData[i])?serviceData[i][0]:serviceData[i];
      if (nodeData.NodeType.toLowerCase() === 'enterprise-hierarchy') {
      const node = new TreeNode();
      node.NodeId = nodeData.NodeId;
      node.NodeName = nodeData.NodeName;     
      node.NodeType =nodeData.NodeType; 
      let users= this.privilegeService.sitePrivilegeUserInfo.value.filter(user => user.SiteUser.SiteId===nodeData.NodeId).map(function(filteredData){
        return filteredData;
      });

        /* Start Change for Dynamically added Child */
      
        let siteParentUsers = [];
        if(siteParentUsers.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while( currentSiteId!=null ){          
            siteParentUsers=this.privilegeService.sitePrivilegeUserInfo.value.filter(user => user.SiteUser.SiteId===currentSiteId).map(function(filteredData){
              return filteredData;
            });
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            users=users.concat(siteParentUsers);
          }      
        }
        users=users.concat(siteParentUsers);
        
        users= Array.from(new Set(users.map(role =>role.SiteUser.UserId))).map(userId =>{
          return {
            SiteUser:{
              SiteId:node.NodeId,
              UserId:userId,
              UserName:users.find(role=>role.SiteUser.UserId===userId).SiteUser.UserName           
          }
        }
        });
      
        
        /* End Change for Dynamically added Child */

      node.TotalCount=this.GetMappedUsersCount(nodeData);
      if(users.length>0)
      {
        let siteUsersTree = this.buildUserTree(users, level + 1);
        let siteTree = this.buildUserFileTree(nodeData.Children, level + 1);
        node.Children = siteUsersTree.concat(siteTree);
      }
      else{
        node.Children=this.buildUserFileTree(nodeData.Children,level+1);
      }
      finalTreeData.push(node);
    }
  }
    return finalTreeData;
  }

  buildUserTree(userData: SiteUserInfo[], level: number) {
    let finalTreeData: TreeNode[] = [];
    if (userData.length > 0) {
      let totalObjectCount = userData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = userData[i].SiteUser.UserId;
        node.NodeName =userData[i].SiteUser.UserName;
        node.NodeType = "user";
        node.Children = [];
        finalTreeData.push(node);
      }
      return finalTreeData;
    } else {
      return finalTreeData;
    }
  }

    /* LDAP Group Tree */
  buildLdapGroupTree(serviceData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = Object.keys(serviceData).length;
    for (var i = 0; i < totalObjectCount; i++) {
      const nodeData = Array.isArray(serviceData[i]) ? serviceData[i][0] : serviceData[i];
      if (nodeData.NodeType.toLowerCase() === 'enterprise-hierarchy') {
        const node = new TreeNode();
        node.NodeId = nodeData.NodeId;
        node.NodeName = nodeData.NodeName;
        node.NodeType = nodeData.NodeType;
        let siteLdapGroup = this.privilegeService.sitePrivilegeLdapInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === node.NodeId).map(function (filteredData) {
          return filteredData
        });

        /* Start Change for Dynamically added Child */
      
        let siteParentLdapGroup = [];
        if(siteParentLdapGroup.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while( currentSiteId!=null ){          
            siteParentLdapGroup=this.privilegeService.sitePrivilegeLdapInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === currentSiteId).map(function (filteredData) {
              return filteredData
            });
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            siteLdapGroup=siteLdapGroup.concat(siteParentLdapGroup);
          }      
        }
        siteLdapGroup=siteLdapGroup.concat(siteParentLdapGroup);
        
        siteLdapGroup= Array.from(new Set(siteLdapGroup.map(role =>role.SiteLdapGroup.LdapGroupId))).map(ldapId =>{
          return {
            SiteLdapGroup:{
              SiteId:node.NodeId,
              LdapGroupId:ldapId,
              LdapGroupName:siteLdapGroup.find(ldap=>ldap.SiteLdapGroup.LdapGroupId===ldapId).SiteLdapGroup.LdapGroupName,
              Domain:siteLdapGroup.find(ldap=>ldap.SiteLdapGroup.LdapGroupId===ldapId).SiteLdapGroup.Domain          
          }
        }
        });
      
        
        /* End Change for Dynamically added Child */

        node.TotalCount=this.GetMappedGroupCount(nodeData);
        if (siteLdapGroup.length > 0) {
          let siteLdapGroupTree = this.buildLdapTree(siteLdapGroup, level + 1);
          let siteTree = this.buildLdapGroupTree(nodeData.Children, level + 1);
          node.Children = siteLdapGroupTree.concat(siteTree);
        } else {
          node.Children = this.buildLdapGroupTree(nodeData.Children, level + 1);
        }
        finalTreeData.push(node);
      }
    }
    return finalTreeData;
  }

  buildLdapTree(siteLdapGroupData: SiteLdapGroupInfo[], level: number) {
    let finalTreeData: TreeNode[] = [];
    if (siteLdapGroupData.length > 0) {
      let totalObjectCount = siteLdapGroupData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = siteLdapGroupData[i].SiteLdapGroup.LdapGroupId;
        node.NodeName =  siteLdapGroupData[i].SiteLdapGroup.Domain+"-"+ siteLdapGroupData[i].SiteLdapGroup.LdapGroupName;
        node.NodeType = "Ldap Group";
        node.Children = [];
        finalTreeData.push(node);
      }
      return finalTreeData;
    } else {
      return finalTreeData;
    }
  }

  getRoleLevel = (node: TreeFlatNode) => node.Level;

  isRoleExpandable = (node: TreeFlatNode) => node.Expandable;

  getRoleChildren = (node: TreeNode): TreeNode[] => node.Children;

  hasRoleChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.Expandable;

  hasRoleNoContent = (_: number, _nodeData: TreeFlatNode) => _nodeData.NodeName === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformerRole = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.NodeName === node.NodeName ?
      existingNode :
      new TreeFlatNode();
    flatNode.NodeName = node.NodeName;
    flatNode.NodeType = node.NodeType;
    flatNode.NodeId = node.NodeId;
    flatNode.TotalCount=node.TotalCount;
    flatNode.Level = level;
    flatNode.Expandable = (node.Children.length > 0);
    this.flatRoleNodeMap.set(flatNode, node);
    this.nestedRoleNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsRoleAllSelected(node: TreeFlatNode): boolean {
    const descendants = this.treeRoleControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistRoleSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsRolePartiallySelected(node: TreeFlatNode): boolean {
    const descendants = this.treeRoleControl.getDescendants(node);
    const result = descendants.some(child => this.checklistRoleSelection.isSelected(child));
    return result && !this.descendantsRoleAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoRoleItemSelectionToggle(node: TreeFlatNode): void {
    this.checklistRoleSelection.toggle(node);
    const descendants = this.treeRoleControl.getDescendants(node);
    this.checklistRoleSelection.isSelected(node) ?
      this.checklistRoleSelection.select(...descendants) :
      this.checklistRoleSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistRoleSelection.isSelected(child)
    );
    this.checkRoleAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoRoleLeafItemSelectionToggle(node: TreeFlatNode): void {
    this.checklistRoleSelection.toggle(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkRoleAllParentsSelection(node: TreeFlatNode): void {
    let parent: TreeFlatNode | null = this.getRoleParentNode(node);
    while (parent) {
      this.checkRoleRootNodeSelection(parent);
      parent = this.getRoleParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRoleRootNodeSelection(node: TreeFlatNode): void {
    const nodeSelected = this.checklistRoleSelection.isSelected(node);
    const descendants = this.treeRoleControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistRoleSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistRoleSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistRoleSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getRoleParentNode(node: TreeFlatNode): TreeFlatNode | null {
    const currentLevel = this.getRoleLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeRoleControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeRoleControl.dataNodes[i];

      if (this.getRoleLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  GetRoleSiteInfo() {   
   // const data = this.buildRoleFileTree(this.roleService.tempData.data, 0);
    const data = this.buildRoleFileTree(this.roleService.siteInfo.value, 0);
    this.dataSourceRole.data = data;
    //this.treeRoleControl.expand(this.treeRoleControl.dataNodes[0]);
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  } 
  
  GetUserSiteInfo() { 

     const data = this.buildUserFileTree(this.roleService.siteInfo.value, 0);
     this.dataSourceUser.data = data;
     //this.treeRoleControl.expand(this.treeRoleControl.dataNodes[0]);
     this.treeControl.expand(this.treeControl.dataNodes[0]);
   }  

   GetLdapGroupSiteInfo()
   {
     const ldapData = this.buildLdapGroupTree(this.roleService.siteInfo.value, 0);
     this.dataSourceLdap.data = ldapData;
     this.treeControl.expand(this.treeControl.dataNodes[0]);
   }

   GetMappedUsersCount(node:TreeNode){
    let totalCount=0;   
    let usersList= this.privilegeService.sitePrivilegeUserInfo.value.filter(user => user.SiteUser.SiteId===node.NodeId).map(function(filteredData){
      return filteredData;
    });    
    /* Start Change for Dynamically added Child */
      
    let siteParentUsers = [];
    if(siteParentUsers.length===0 && this.allTreeNode.length>0){ 
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
      let currentSiteId= parentSiteId;
      while( currentSiteId!=null ){          
        siteParentUsers=this.privilegeService.sitePrivilegeUserInfo.value.filter(user => user.SiteUser.SiteId===currentSiteId).map(function(filteredData){
          return filteredData;
        });
        parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
        currentSiteId= parentSiteId;
        usersList=usersList.concat(siteParentUsers);
      }      
    }
    usersList=usersList.concat(siteParentUsers);
    
    usersList= Array.from(new Set(usersList.map(role =>role.SiteUser.UserId))).map(userId =>{
      return {
        SiteUser:{
          SiteId:node.NodeId,
          UserId:userId,
          UserName:usersList.find(role=>role.SiteUser.UserId===userId).SiteUser.UserName           
      }
    }
    });
  
    
    /* End Change for Dynamically added Child */

    totalCount=totalCount+usersList.length;
    for (let i = 0; i < node.Children.length; i++) {
      if(node.Children[i].NodeType.toLowerCase()!='application'){
      let userNode = this.GetMappedUsersCount(node.Children[i]);
      totalCount=totalCount+userNode;
      }
    }
    return totalCount;    
  }  

  GetMappedRolesCount(node:TreeNode){     
    let totalCount=0;       
    let rolesList= this.privilegeService.sitePrivilegeRoleInfo.value.filter(role => role.SiteRole.SiteId===node.NodeId).map(function(filteredData){
      return filteredData.SiteRole;
    });

    /* Start Change for Dynamically added Child */
      
    let siteParentRoles = [];
    //if(siteParentRoles.length===0 && this.allTreeNode.length>0){ 
    if(this.allTreeNode.length>0){ 
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
      let currentSiteId= parentSiteId;
      while( currentSiteId!=null ){          
        siteParentRoles=this.privilegeService.sitePrivilegeRoleInfo.value.filter(role => role.SiteRole.SiteId===currentSiteId).map(function(filteredData){
          return filteredData.SiteRole;
        });   
        parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
        currentSiteId= parentSiteId;
        rolesList=rolesList.concat(siteParentRoles);
      }      
    }
    rolesList=rolesList.concat(siteParentRoles);
    
    rolesList= Array.from(new Set(rolesList.map(role =>role.RoleId))).map(roleId =>{
      return {
          SiteId:node.NodeId,
          RoleId:roleId,
          RoleName:rolesList.find(role=>role.RoleId===roleId).RoleName           
      }
    });
  
    
    /* End Change for Dynamically added Child */

    totalCount=totalCount+rolesList.length;
    for (let i = 0; i < node.Children.length; i++) {
      if(node.Children[i].NodeType.toLowerCase()!='application'){
      let userNode = this.GetMappedRolesCount(node.Children[i]);
      totalCount=totalCount+userNode;
      }
    }
    return totalCount;    
  } 

  GetMappedGroupCount(node:TreeNode){     
    let totalCount=0;    
    let ldapGroupList = this.privilegeService.sitePrivilegeLdapInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === node.NodeId).map(function (filteredData) {
      return filteredData
    });  

    /* Start Change for Dynamically added Child */
      
    let siteParentLdapGroup = [];
    if(siteParentLdapGroup.length===0 && this.allTreeNode.length>0){ 
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
      let currentSiteId= parentSiteId;
      while( currentSiteId!=null ){          
        siteParentLdapGroup=this.privilegeService.sitePrivilegeLdapInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === currentSiteId).map(function (filteredData) {
          return filteredData
        });
        parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
        currentSiteId= parentSiteId;
        ldapGroupList=ldapGroupList.concat(siteParentLdapGroup);
      }      
    }
    ldapGroupList=ldapGroupList.concat(siteParentLdapGroup);
    
    ldapGroupList= Array.from(new Set(ldapGroupList.map(role =>role.SiteLdapGroup.LdapGroupId))).map(ldapId =>{
      return {
        SiteLdapGroup:{
          SiteId:node.NodeId,
          LdapGroupId:ldapId,
          LdapGroupName:ldapGroupList.find(ldap=>ldap.SiteLdapGroup.LdapGroupId===ldapId).SiteLdapGroup.LdapGroupName,
          Domain:ldapGroupList.find(ldap=>ldap.SiteLdapGroup.LdapGroupId===ldapId).SiteLdapGroup.Domain          
      }
    }
    });
  
    
    /* End Change for Dynamically added Child */
    totalCount=totalCount+ldapGroupList.length;
    for (let i = 0; i < node.Children.length; i++) {
      if(node.Children[i].NodeType.toLowerCase()!='application'){
      let userNode = this.GetMappedGroupCount(node.Children[i]);
      totalCount=totalCount+userNode;
      }
    }
    return totalCount;    
  } 

  GetTreeFlatNode(treeData){    
    let isNodeArray=Array.isArray(treeData);
    if(isNodeArray){      
      for(let i=0;i<treeData.length;i++){
        this.allTreeNode.push(treeData[i][0]);
        for(let j=0;j<treeData[i][0].Children.length;j++){
          if(treeData[i][0].Children[j].NodeType.toLowerCase()!="application"){
          let nodes =  this.GetTreeFlatNode(treeData[i][0].Children[j])        ;
          }
        }
      }
    }
    else{
      this.allTreeNode.push(treeData);
      for(let i=0;i<treeData.Children.length;i++){
        if(treeData.Children[i].NodeType.toLowerCase()!="application"){
        let nodes =  this.GetTreeFlatNode(treeData.Children[i]);
        }       
      } 
    }
  }

}
