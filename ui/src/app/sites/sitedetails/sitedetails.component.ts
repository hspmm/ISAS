import { Component, OnInit } from '@angular/core';

/* For Tree Structure */
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { RoleBasicDetails, SiteRoleInfo } from 'src/app/shared/roles/role-Info';
import { UsersService } from 'src/app/shared/users/users.service';
import { RolesService } from 'src/app/shared/roles/roles.service';
import { SiteUserInfo, SiteLdapGroupInfo } from 'src/app/shared/users/user-Info';
import {ApplicationInfo} from 'src/app/shared/privileges/privilege-Info'

import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/shared/settings/settings.service';
import { IfStmt } from '@angular/compiler';

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
  selector: 'app-sitedetails',
  templateUrl: './sitedetails.component.html',
  styleUrls: ['./sitedetails.component.scss']
})
export class SitedetailsComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map < TreeFlatNode, TreeNode > ();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map < TreeNode, TreeFlatNode > ();

  /* LDAP Selection */
  selectedLdapId: number = 0;

  selectedLdapParentId: number = 0;

  selectedLdapNodeId: number = 0;

  mappedLdapApplication:ApplicationInfo[]=[];

  selectedLdapApplicationId:number =0;

  /* Role Selection */
  selectedRoleId: number = 0;

  selectedRoleParentId: number = 0;

  mappedRoleApplication:ApplicationInfo[]=[];

  selectedRoleApplicationId:number =0;

   /* User Selection */
   selectedUserId: number = 0;

   selectedUserParentId: number = 0;

   selectedUserNodeId: number = 0;

   mappedUserApplication:ApplicationInfo[]=[];

   selectedUserApplicationId:number =0;

  /** A selected parent node to be inserted */
  selectedParent: TreeFlatNode | null = null;

  treeControl: FlatTreeControl < TreeFlatNode > ;

  treeFlattener: MatTreeFlattener < TreeNode, TreeFlatNode > ;

  dataSource: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;

  userDataSource: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;

  ldapDataSource: MatTreeFlatDataSource < TreeNode, TreeFlatNode > ;

  allTreeNode=[];

  /** The selection for checklist */
  checklistSelection = new SelectionModel < TreeFlatNode > (true /* multiple */ );

  constructor(private usersService: UsersService, private rolesService: RolesService, private spinner: NgxSpinnerService, private settingsService: SettingsService) {}

  ngOnInit() {
    this.spinner.show();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl < TreeFlatNode > (this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.userDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.ldapDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.rolesService.getSiteRoleInfo();
    this.rolesService.getSiteUserInfo();
    this.rolesService.getSiteLdapGroupInfo();


    this.rolesService.siteRoleInfo.subscribe((siteRoles) => {
      this.GetSiteInfo();
    });
    this.rolesService.siteUserInfo.subscribe((siteUsers) => {
      this.GetUserSiteInfo();
    });
    this.rolesService.siteLdapGroupInfo.subscribe((siteLdapGroups) => {
      this.GetLdapGroupSiteInfo();
    });

    // this.rolesService.getSiteInfo((res, err) => {
    //   if (err) {} else {}
    // });

    // if(this.rolesService.siteTreeErrorMessage.value==='' && this.rolesService.siteInfo.value.length===0){
    //   this.rolesService.getSiteInfoFromEC((res, err) => {
    //     if (err) {
    //     } else {        
    //     }
    //   });
    //   }
      
    this.rolesService.siteInfo.subscribe((siteInfo) => {
      this.allTreeNode=[];
      this.GetTreeFlatNode(this.rolesService.siteInfo.value);
      this.GetSiteInfo();
      this.GetUserSiteInfo();
      this.GetLdapGroupSiteInfo();      
    });
    this.spinner.hide();
  }

  buildFileTree(serviceData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = Object.keys(serviceData).length;
    for (var i = 0; i < totalObjectCount; i++) {
      const nodeData = Array.isArray(serviceData[i]) ? serviceData[i][0] : serviceData[i];
      if (nodeData.NodeType.toLowerCase() === 'enterprise-hierarchy') {
        const node = new TreeNode();
        node.NodeId = nodeData.NodeId;
        node.NodeName = nodeData.NodeName;
        node.NodeType = nodeData.NodeType;
        node.ParentId=nodeData.ParentId;
        //node.Children=this.buildFileTree(serviceData[i].children,level+1);
        // node.ApplicationId=serviceData[i].ApplicationID;
        // node.Privileges=[];
        // node.Selected=false;

        // if(node.NodeType==='enterprise-hierarchy')
        // {      
        //  let privileges= this.privilegeService.applicationPrivileges.value.filter(appPrivilege => appPrivilege.ApplicationPrivileges.Application.ApplicationId===serviceData[i].ApplicationID).map(function(filteredData){
        //     return filteredData.ApplicationPrivileges.Privileges;
        //   });
        //    //node.Privileges=privileges;


        //   node.Children=this.buildPrivilegeTree(privileges,level+1)
        // }
        // else{
        let siteRoles = this.rolesService.siteRoleInfo.value.filter(siteRole => siteRole.SiteRole.SiteId === node.NodeId).map(function (filteredData) {
          return filteredData
        });

        /* Start Change for Dynamically added Child */
        // let siteParentRoles = this.rolesService.siteRoleInfo.value.filter(siteRole => siteRole.SiteRole.SiteId === node.ParentId).map(function (filteredData) {
        //   return filteredData
        // });
        let siteParentRoles = [];
        if(siteParentRoles.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while( currentSiteId!=null ){
            siteParentRoles=this.rolesService.siteRoleInfo.value.filter(siteRole => siteRole.SiteRole.SiteId === currentSiteId).map(function (filteredData) {
                return filteredData
              });            
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            siteRoles=siteRoles.concat(siteParentRoles);
          }      
        }
        siteRoles=siteRoles.concat(siteParentRoles);
        
        siteRoles= Array.from(new Set(siteRoles.map(role =>role.SiteRole.RoleId))).map(roleId =>{
          return {
            SiteRole:{
              SiteId:node.NodeId,
              RoleId:roleId,
              RoleName:siteRoles.find(role=>role.SiteRole.RoleId===roleId).SiteRole.RoleName
            }
          }
        });
      
        
        /* End Change for Dynamically added Child */

        //node.TotalCount=this.GetMappedRolesCount(nodeData);
        node.TotalCount=this.GetMappedRolesCount(nodeData);
        if (siteRoles.length > 0) {
          let siteRolesTree = this.buildRolesTree(siteRoles,node.NodeId, level + 1);
          let siteTree = this.buildFileTree(nodeData.Children, level + 1);
          node.Children = siteRolesTree.concat(siteTree);
        } else {
          node.Children = this.buildFileTree(nodeData.Children, level + 1);
        }
        // }
        finalTreeData.push(node);
      }
    }
    return finalTreeData;
  }

  buildRolesTree(siteRoleData: SiteRoleInfo[],parentId:number, level: number) {
    let finalTreeData: TreeNode[] = [];
    if (siteRoleData.length > 0) {
      let totalObjectCount = siteRoleData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = siteRoleData[i].SiteRole.RoleId;
        node.NodeName = siteRoleData[i].SiteRole.RoleName;
        node.NodeType = "Roles";
        node.Children = [];
        node.ParentId=parentId;
        finalTreeData.push(node);
      }
      return finalTreeData;
    } else {
      return finalTreeData;
    }
  }
  
  buildSiteTree(serviceData: any, level: number) {
    let finalTreeData: TreeNode[] = [];
    let totalObjectCount = Object.keys(serviceData).length;
    for (var i = 0; i < totalObjectCount; i++) {
      const nodeData = Array.isArray(serviceData[i]) ? serviceData[i][0] : serviceData[i];
      if (nodeData.NodeType.toLowerCase() === 'enterprise-hierarchy') {
        const node = new TreeNode();
        node.NodeId = nodeData.NodeId;
        node.NodeName = nodeData.NodeName;
        node.NodeType = nodeData.NodeType;
        node.ParentId= nodeData.ParentId;
        let siteUsers = this.rolesService.siteUserInfo.value.filter(siteUser => siteUser.SiteUser.SiteId === node.NodeId).map(function (filteredData) {
          return filteredData
        });
        /* Start Change for Dynamically added Child */
        // let siteParentUsers = this.rolesService.siteUserInfo.value.filter(siteUser => siteUser.SiteUser.SiteId === node.ParentId).map(function (filteredData) {
        //   return filteredData
        // });
        let siteParentUsers = [];
        if(siteParentUsers.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while( currentSiteId!=null ){          
            siteParentUsers=this.rolesService.siteUserInfo.value.filter(siteUser => siteUser.SiteUser.SiteId === currentSiteId).map(function (filteredData) {
                return filteredData
              });  
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            siteUsers=siteUsers.concat(siteParentUsers);
          }      
        }
        
        siteUsers=siteUsers.concat(siteParentUsers);
        
        siteUsers= Array.from(new Set(siteUsers.map(role =>role.SiteUser.UserId))).map(userId =>{
          return {
            SiteUser:{
              SiteId:node.NodeId,
              UserId:userId,
              UserName:siteUsers.find(role=>role.SiteUser.UserId===userId).SiteUser.UserName
            }
          }
        });
      
        
        /* End Change for Dynamically added Child */
       // node.TotalCount=siteUsers.length;
       node.TotalCount=this.GetMappedUsersCount(nodeData);
        
        if (siteUsers.length > 0) {
          let siteUsersTree = this.buildUsersTree(siteUsers,node.NodeId, level + 1);
          let siteTree = this.buildSiteTree(nodeData.Children, level + 1);
          node.Children = siteUsersTree.concat(siteTree);
        } else {
          node.Children = this.buildSiteTree(nodeData.Children, level + 1);
        }
        // }

        finalTreeData.push(node);
      }
    }
    
    return finalTreeData;
  }

  buildUsersTree(siteUserData: SiteUserInfo[],parentId:number, level: number) {
    let finalTreeData: TreeNode[] = [];
    if (siteUserData.length > 0) {
      let totalObjectCount = siteUserData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = siteUserData[i].SiteUser.UserId;
        node.NodeName = siteUserData[i].SiteUser.UserName;
        node.NodeType = "Users";
        node.ParentId= parentId;
        node.Children = [];
        finalTreeData.push(node);
      }
      return finalTreeData;
    } else {
      return finalTreeData;
    }
  }

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
        let siteLdapGroup = this.rolesService.siteLdapGroupInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === node.NodeId).map(function (filteredData) {
          return filteredData
        });

        /* Start Change for Dynamically added Child */
        // let siteParentLdapGroup = this.rolesService.siteLdapGroupInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === node.ParentId).map(function (filteredData) {
        //   return filteredData
        // });
        let siteParentLdapGroup = [];
        if(siteParentLdapGroup.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while(currentSiteId!=null ){          
            siteParentLdapGroup=this.rolesService.siteLdapGroupInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === currentSiteId).map(function (filteredData) {
                return filteredData
              });
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            siteLdapGroup=siteLdapGroup.concat(siteParentLdapGroup);
          }      
        }
        
        siteLdapGroup=siteLdapGroup.concat(siteParentLdapGroup);
        
        siteLdapGroup= Array.from(new Set(siteLdapGroup.map(ldap =>ldap.SiteLdapGroup.LdapGroupId))).map(ldapId =>{
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
          let siteLdapGroupTree = this.buildLdapTree(siteLdapGroup,node.NodeId, level + 1);
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

  buildLdapTree(siteLdapGroupData: SiteLdapGroupInfo[],parentId:number, level: number) {
    let finalTreeData: TreeNode[] = [];
    if (siteLdapGroupData.length > 0) {
      let totalObjectCount = siteLdapGroupData.length;
      for (var i = 0; i < totalObjectCount; i++) {
        const node = new TreeNode();
        node.NodeId = siteLdapGroupData[i].SiteLdapGroup.LdapGroupId;
        node.NodeName =  siteLdapGroupData[i].SiteLdapGroup.Domain+"-"+ siteLdapGroupData[i].SiteLdapGroup.LdapGroupName;
        node.NodeType = "Ldap Group";
        node.Children = [];
        node.ParentId=parentId;
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
    flatNode.ParentId=node.ParentId;
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
    // this.checkAllParentsSelection(node);
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
    const data = this.buildFileTree(this.rolesService.siteInfo.value, 0);
    this.dataSource.data = data;
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  GetUserSiteInfo()
  {
    const userData = this.buildSiteTree(this.rolesService.siteInfo.value, 0);
    this.userDataSource.data = userData;
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  GetLdapGroupSiteInfo()
  {
    const ldapData = this.buildLdapGroupTree(this.rolesService.siteInfo.value, 0);
    this.ldapDataSource.data = ldapData;
    this.treeControl.expand(this.treeControl.dataNodes[0]);
  }

  GetMappedUsersCount(node:TreeNode){    
    let totalCount=0;
    let usersList = this.rolesService.siteUserInfo.value.filter(siteUser => siteUser.SiteUser.SiteId === node.NodeId).map(function (filteredData) {
      return filteredData
    });    
    /* Start Change for Dynamically added Child */
    // let siteParentUsers = this.rolesService.siteUserInfo.value.filter(siteUser => siteUser.SiteUser.SiteId === node.ParentId).map(function (filteredData) {
    //   return filteredData
    // });
    let siteParentUsers = [];
    if(siteParentUsers.length===0 && this.allTreeNode.length>0){ 
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
      let currentSiteId= parentSiteId;
      while( currentSiteId!=null ){          
        siteParentUsers=this.rolesService.siteUserInfo.value.filter(siteUser => siteUser.SiteUser.SiteId === currentSiteId).map(function (filteredData) {
            return filteredData
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
          UserName:usersList.find(user=>user.SiteUser.UserId===userId).SiteUser.UserName
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
    let rolesList = this.rolesService.siteRoleInfo.value.filter(siteRole => siteRole.SiteRole.SiteId === node.NodeId).map(function (filteredData) {
      return filteredData
    });    
    /* Start Change for Dynamically added Child */
    // let siteParentRoles = this.rolesService.siteRoleInfo.value.filter(siteRole => siteRole.SiteRole.SiteId === node.ParentId).map(function (filteredData) {
    //   return filteredData
    // });

    let siteParentRoles = [];
   // if(siteParentRoles.length===0 && this.allTreeNode.length>0){ 
    if(this.allTreeNode.length>0){ 
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
      let currentSiteId= parentSiteId;
      while( currentSiteId!=null ){          
        siteParentRoles=this.rolesService.siteRoleInfo.value.filter(siteRole => siteRole.SiteRole.SiteId === currentSiteId).map(function (filteredData) {
            return filteredData
          });            
        parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
        currentSiteId= parentSiteId;
        rolesList=rolesList.concat(siteParentRoles);
      }      
    }

    rolesList=rolesList.concat(siteParentRoles);
    rolesList= Array.from(new Set(rolesList.map(role =>role.SiteRole.RoleId))).map(roleId =>{
      return {
        SiteRole:{
          SiteId:node.NodeId,
          RoleId:roleId,
          RoleName:rolesList.find(role=>role.SiteRole.RoleId===roleId).SiteRole.RoleName
        }
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
    let ldapGroupList = this.rolesService.siteLdapGroupInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === node.NodeId).map(function (filteredData) {
      return filteredData
    });   
     /* Start Change for Dynamically added Child */
    //  let siteParentLdapGroup = this.rolesService.siteLdapGroupInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === node.ParentId).map(function (filteredData) {
    //   return filteredData
    // });

    let siteParentLdapGroup = [];
        if(siteParentLdapGroup.length===0 && this.allTreeNode.length>0){ 
          let parentSiteId=this.allTreeNode.find(site=>site.NodeId===node.NodeId).ParentId;
          let currentSiteId= parentSiteId;
          while(currentSiteId!=null ){          
            siteParentLdapGroup=this.rolesService.siteLdapGroupInfo.value.filter(siteLdapGroup => siteLdapGroup.SiteLdapGroup.SiteId === currentSiteId).map(function (filteredData) {
                return filteredData
              });
            parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
            currentSiteId= parentSiteId;
            ldapGroupList=ldapGroupList.concat(siteParentLdapGroup);
          }      
        }
    
    ldapGroupList=ldapGroupList.concat(siteParentLdapGroup);
    
    ldapGroupList= Array.from(new Set(ldapGroupList.map(ldap =>ldap.SiteLdapGroup.LdapGroupId))).map(ldapId =>{
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

  OnLdapGroupSelected(ldapId,siteId){
    this.selectedLdapId=ldapId;
    this.selectedLdapNodeId=siteId;
    this.selectedLdapParentId=siteId;
    let mappedLdapAppPrivileges=this.rolesService.siteLdapPrivilgeInfo.value
                             .filter(siteLdapPrivilege => (siteLdapPrivilege.SiteLdapPrivilege.SiteId === siteId && siteLdapPrivilege.SiteLdapPrivilege.LdapGroupId===ldapId))
                             .map(function (filteredData) {
                              return {
                                ApplicationId:filteredData.SiteLdapPrivilege.ApplicationId,
                                ApplicationName:filteredData.SiteLdapPrivilege.ApplicationName,
                                PrivilegeName:filteredData.SiteLdapPrivilege.PrivilegeName
                              }
                            });

    // if(mappedLdapAppPrivileges.length===0){
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===this.selectedLdapParentId).ParentId;
      let currentSiteId= parentSiteId;
      // while(mappedLdapAppPrivileges.length==0 && currentSiteId!=null ){        
        while(currentSiteId!=null ){        
        let appPrivileges=this.rolesService.siteLdapPrivilgeInfo.value
                .filter(siteLdapPrivilege => (siteLdapPrivilege.SiteLdapPrivilege.SiteId === currentSiteId && siteLdapPrivilege.SiteLdapPrivilege.LdapGroupId===ldapId))
                .map(function (filteredData) {
                return {
                  ApplicationId:filteredData.SiteLdapPrivilege.ApplicationId,
                  ApplicationName:filteredData.SiteLdapPrivilege.ApplicationName,
                  PrivilegeName:filteredData.SiteLdapPrivilege.PrivilegeName
                }
              });
        mappedLdapAppPrivileges=mappedLdapAppPrivileges.concat(appPrivileges);
        this.selectedLdapParentId=parentSiteId;
        parentSiteId=this.allTreeNode.find(site=>site.NodeId===this.selectedLdapParentId).ParentId;
        currentSiteId= parentSiteId;
      }      
    // }
    this.mappedLdapApplication = Array.from(new Set(mappedLdapAppPrivileges.map(application => application.ApplicationId ))).map(applicationId =>{
      return {
        ApplicationName:mappedLdapAppPrivileges.find(application => application.ApplicationId===applicationId).ApplicationName,
        ApplicationId:applicationId,
        ApplicationCode:""
      }
    });    
    this.selectedLdapApplicationId=(this.mappedLdapApplication.length>0)?this.mappedLdapApplication[0].ApplicationId:0;
  }

  GetLdapApplicationPrivileges(applicationId) {
    // let mappedLdapAppPrivileges=this.rolesService.siteLdapPrivilgeInfo.value
    //                          .filter(siteLdapPrivilege => (siteLdapPrivilege.SiteLdapPrivilege.SiteId === this.selectedLdapParentId && siteLdapPrivilege.SiteLdapPrivilege.LdapGroupId===this.selectedLdapId))
    //                          .map(function (filteredData) {
    //                           return {
    //                             ApplicationId:filteredData.SiteLdapPrivilege.ApplicationId,
    //                             ApplicationName:filteredData.SiteLdapPrivilege.ApplicationName,
    //                             PrivilegeName:filteredData.SiteLdapPrivilege.PrivilegeName
    //                           }
    //                         });
        let mappedLdapAppPrivileges=this.rolesService.siteLdapPrivilgeInfo.value
                                    .filter(siteLdapPrivilege => (siteLdapPrivilege.SiteLdapPrivilege.SiteId === this.selectedLdapNodeId && siteLdapPrivilege.SiteLdapPrivilege.LdapGroupId===this.selectedLdapId && siteLdapPrivilege.SiteLdapPrivilege.ApplicationId===applicationId))
                                    .map(function (filteredData) {
                                    return {
                                      ApplicationId:filteredData.SiteLdapPrivilege.ApplicationId,
                                      ApplicationName:filteredData.SiteLdapPrivilege.ApplicationName,
                                      PrivilegeName:filteredData.SiteLdapPrivilege.PrivilegeName
                                    }
                                  });
        let parentSiteId=this.allTreeNode.find(site=>site.NodeId===this.selectedLdapNodeId).ParentId;
        let currentSiteId= parentSiteId;
        while(currentSiteId!=null){
          let appPrivileges=this.rolesService.siteLdapPrivilgeInfo.value
          .filter(siteLdapPrivilege => (siteLdapPrivilege.SiteLdapPrivilege.SiteId === currentSiteId && siteLdapPrivilege.SiteLdapPrivilege.LdapGroupId===this.selectedLdapId && siteLdapPrivilege.SiteLdapPrivilege.ApplicationId===applicationId))
          .map(function (filteredData) {
          return {
            ApplicationId:filteredData.SiteLdapPrivilege.ApplicationId,
            ApplicationName:filteredData.SiteLdapPrivilege.ApplicationName,
            PrivilegeName:filteredData.SiteLdapPrivilege.PrivilegeName
          }
        });
          mappedLdapAppPrivileges = mappedLdapAppPrivileges.concat(appPrivileges);
          parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
          currentSiteId= parentSiteId;
        }
        return Array.from(new Set(mappedLdapAppPrivileges.map(application=>application.PrivilegeName))).map(privilege =>{
          return {
            PrivilegeName:privilege
          }
        });
    // return mappedLdapAppPrivileges.filter(appPrivilege => appPrivilege.ApplicationId === applicationId).map(
    //   function (filteredData) {
    //     return {
    //       PrivilegeName:filteredData.PrivilegeName
    //     };
    //   });    
  }

  OnUserGroupSelected(userId,siteId){
    this.selectedUserId=userId;
    this.selectedUserNodeId=siteId;
    this.selectedUserParentId=siteId;
    let mappedUserAppPrivileges=this.rolesService.siteUserPrivilegeInfo.value
                             .filter(siteUserPrivilege => (siteUserPrivilege.SiteUserPrivilege.SiteId === siteId && siteUserPrivilege.SiteUserPrivilege.UserId===userId))
                             .map(function (filteredData) {
                              return {
                                ApplicationId:filteredData.SiteUserPrivilege.ApplicationId,
                                ApplicationName:filteredData.SiteUserPrivilege.ApplicationName,
                                PrivilegeName:filteredData.SiteUserPrivilege.PrivilegeName
                              }
                            });
    // if(mappedUserAppPrivileges.length===0){
      let parentSiteId=this.allTreeNode.find(site=>site.NodeId===this.selectedUserParentId).ParentId;
      let currentSiteId= parentSiteId;
      // while(mappedUserAppPrivileges.length==0 && currentSiteId!=null ){     
        while(currentSiteId!=null ){        
        let appPrivileges=this.rolesService.siteUserPrivilegeInfo.value
                             .filter(siteUserPrivilege => (siteUserPrivilege.SiteUserPrivilege.SiteId === currentSiteId && siteUserPrivilege.SiteUserPrivilege.UserId===userId))
                             .map(function (filteredData) {
                              return {
                                ApplicationId:filteredData.SiteUserPrivilege.ApplicationId,
                                ApplicationName:filteredData.SiteUserPrivilege.ApplicationName,
                                PrivilegeName:filteredData.SiteUserPrivilege.PrivilegeName
                              }
                            });
        mappedUserAppPrivileges=mappedUserAppPrivileges.concat(appPrivileges);
        this.selectedUserParentId=parentSiteId;
        parentSiteId=this.allTreeNode.find(site=>site.NodeId===this.selectedUserParentId).ParentId;
        currentSiteId= parentSiteId;
      }      
    // }
    this.mappedUserApplication = Array.from(new Set(mappedUserAppPrivileges.map(application => application.ApplicationId ))).map(applicationId =>{
      return {
        ApplicationName:mappedUserAppPrivileges.find(application => application.ApplicationId===applicationId).ApplicationName,
        ApplicationId:applicationId,
        ApplicationCode:""
      }
    });    
    this.selectedUserApplicationId=(this.mappedUserApplication.length>0)?this.mappedUserApplication[0].ApplicationId:0;
  }

  GetUserApplicationPrivileges(applicationId) {
    // let mappedUserAppPrivileges=this.rolesService.siteUserPrivilegeInfo.value
    //                          .filter(siteUserPrivilege => (siteUserPrivilege.SiteUserPrivilege.SiteId === this.selectedUserParentId && siteUserPrivilege.SiteUserPrivilege.UserId===this.selectedUserId))
    //                          .map(function (filteredData) {
    //                           return {
    //                             ApplicationId:filteredData.SiteUserPrivilege.ApplicationId,
    //                             ApplicationName:filteredData.SiteUserPrivilege.ApplicationName,
    //                             PrivilegeName:filteredData.SiteUserPrivilege.PrivilegeName
    //                           }
    //                         });

    let mappedUserAppPrivileges=this.rolesService.siteUserPrivilegeInfo.value
                            .filter(siteUserPrivilege => (siteUserPrivilege.SiteUserPrivilege.SiteId === this.selectedUserNodeId && siteUserPrivilege.SiteUserPrivilege.UserId===this.selectedUserId && siteUserPrivilege.SiteUserPrivilege.ApplicationId===applicationId))
                            .map(function (filteredData) {
                            return {
                              ApplicationId:filteredData.SiteUserPrivilege.ApplicationId,
                              ApplicationName:filteredData.SiteUserPrivilege.ApplicationName,
                              PrivilegeName:filteredData.SiteUserPrivilege.PrivilegeName
                            }
                          });
    //let mappedUserAppPrivileges=[];
    let parentSiteId=this.allTreeNode.find(site=>site.NodeId===this.selectedUserNodeId).ParentId;
    let currentSiteId= parentSiteId;
    while(currentSiteId!=null){
      let appPrivileges=this.rolesService.siteUserPrivilegeInfo.value
                            .filter(siteUserPrivilege => (siteUserPrivilege.SiteUserPrivilege.SiteId === currentSiteId && siteUserPrivilege.SiteUserPrivilege.UserId===this.selectedUserId && siteUserPrivilege.SiteUserPrivilege.ApplicationId===applicationId))
                            .map(function (filteredData) {
                            return {
                              ApplicationId:filteredData.SiteUserPrivilege.ApplicationId,
                              ApplicationName:filteredData.SiteUserPrivilege.ApplicationName,
                              PrivilegeName:filteredData.SiteUserPrivilege.PrivilegeName
                            }
                          });
      mappedUserAppPrivileges = mappedUserAppPrivileges.concat(appPrivileges);
      parentSiteId=this.allTreeNode.find(site=>site.NodeId===currentSiteId).ParentId;
      currentSiteId= parentSiteId;
    }
    return Array.from(new Set(mappedUserAppPrivileges.map(application=>application.PrivilegeName))).map(privilege =>{
      return {
        PrivilegeName:privilege
      }
    });

    // return mappedUserAppPrivileges.filter(appPrivilege => appPrivilege.ApplicationId === applicationId).map(
    //   function (filteredData) {
    //     return {
    //       PrivilegeName:filteredData.PrivilegeName
    //     };
    //   });    
  }

  OnRoleGroupSelected(roleId,siteId){
    this.selectedRoleId=roleId;
    this.selectedRoleParentId=siteId;
    // let mappedRoleAppPrivileges=this.rolesService.siteRolePrivilegeInfo.value
    //                          .filter(siteRolePrivilege => (siteRolePrivilege.SiteRolePrivilege.SiteId === siteId && siteRolePrivilege.SiteRolePrivilege.RoleId===roleId))
    //                          .map(function (filteredData) {
    //                           return {
    //                             ApplicationId:filteredData.SiteRolePrivilege.ApplicationId,
    //                             ApplicationName:filteredData.SiteRolePrivilege.ApplicationName,
    //                             PrivilegeName:filteredData.SiteRolePrivilege.PrivilegeName
    //                           }
    //                         });

    let mappedRoleAppPrivileges=this.rolesService.siteRolePrivilegeInfo.value
                             .filter(siteRolePrivilege =>(siteRolePrivilege.SiteRolePrivilege.RoleId===roleId))
                             .map(function (filteredData) {
                              return {
                                ApplicationId:filteredData.SiteRolePrivilege.ApplicationId,
                                ApplicationName:filteredData.SiteRolePrivilege.ApplicationName,
                                PrivilegeName:filteredData.SiteRolePrivilege.PrivilegeName
                              }
                            });
    this.mappedRoleApplication = Array.from(new Set(mappedRoleAppPrivileges.map(application => application.ApplicationId ))).map(applicationId =>{
      return {
        ApplicationName:mappedRoleAppPrivileges.find(application => application.ApplicationId===applicationId).ApplicationName,
        ApplicationId:applicationId,
        ApplicationCode:""
      } 
    }); 
    this.selectedRoleApplicationId=(this.mappedRoleApplication.length>0)?this.mappedRoleApplication[0].ApplicationId:0;
  }

  GetRoleApplicationPrivileges(applicationId) {
    // let mappedRoleAppPrivileges=this.rolesService.siteRolePrivilegeInfo.value
    //                          .filter(siteRolePrivilege => (siteRolePrivilege.SiteRolePrivilege.SiteId === this.selectedRoleParentId && siteRolePrivilege.SiteRolePrivilege.RoleId===this.selectedRoleId))
    //                          .map(function (filteredData) {
    //                           return {
    //                             ApplicationId:filteredData.SiteRolePrivilege.ApplicationId,
    //                             ApplicationName:filteredData.SiteRolePrivilege.ApplicationName,
    //                             PrivilegeName:filteredData.SiteRolePrivilege.PrivilegeName
    //                           }
    //                         });

    let mappedRoleAppPrivileges=this.rolesService.siteRolePrivilegeInfo.value
                            .filter(siteRolePrivilege => (siteRolePrivilege.SiteRolePrivilege.RoleId===this.selectedRoleId))
                            .map(function (filteredData) {
                            return {
                              ApplicationId:filteredData.SiteRolePrivilege.ApplicationId,
                              ApplicationName:filteredData.SiteRolePrivilege.ApplicationName,
                              PrivilegeName:filteredData.SiteRolePrivilege.PrivilegeName
                            }
                          });
                           
    let arrayPrivileges= mappedRoleAppPrivileges.filter(appPrivilege => appPrivilege.ApplicationId === applicationId).map(
      function (filteredData) {
        return {
          PrivilegeName:filteredData.PrivilegeName          
        };
      }); 
    return Array.from(new Set(arrayPrivileges.map(privilege=> privilege.PrivilegeName))).map(
      (filteredData)=>{
        return {
          PrivilegeName:arrayPrivileges.find(privilege=>privilege.PrivilegeName===filteredData).PrivilegeName
        }
      }
    )
  }
  
  GetTreeFlatNode(treeData){    
    let isNodeArray=Array.isArray(treeData);
    if(isNodeArray){      
      for(let i=0;i<treeData.length;i++){
        this.allTreeNode.push(treeData[i][0]);
        for(let j=0;j<treeData[i][0].Children.length;j++){
          if(treeData[i][0].Children[j].NodeType.toLowerCase()!="application"){
            let nodes =  this.GetTreeFlatNode(treeData[i][0].Children[j]);
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
