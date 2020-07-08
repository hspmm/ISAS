import {  Component,  OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {  Router, NavigationEnd} from '@angular/router';
import {  UsersService} from 'src/app/shared/users/users.service';
import {  UserFullDetails, UserBasicDetails, RoleDetails, RolePrivilegeDetails, UserList, LogInfo} from 'src/app/shared/users/user-Info';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {  FormGroup,  FormControl,  Validators, FormBuilder} from '@angular/forms';

/* For Tree Structure */
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { PrivilegesService } from 'src/app/shared/privileges/privileges.service';
import { PrivilegeInfo } from 'src/app/shared/privileges/privilege-Info';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { RolesService } from 'src/app/shared/roles/roles.service';
import { PasswordDialogComponent } from 'src/app/password-dialog/password-dialog.component';

export class TreeNode {
  NodeName:string;
  NodeId:number;
  NodeType:string;
  Children: TreeNode[];  
  Privileges:PrivilegeInfo[];
  ApplicationId:number;
  Selected:boolean;
  TotalCount: number;
}

export class TreeFlatNode {
  NodeName:string;
  NodeId:number;
  NodeType:string;
  Level: number;
  Expandable: boolean;
  Selected:boolean;
  TotalCount: number;
}

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss'],
  providers:[]
})

export class UserdetailsComponent implements OnInit {

  selectedTabIndex:number=0;

  userFullInformation:UserFullDetails;
  userDetails:UserBasicDetails;
  availableRoles:RoleDetails[];
  mappedRoles:RoleDetails[];
  rolesList:RoleDetails[];
 // logList:LogInfo[];
  statusMessage: string;
 
  showMessagePopup:any;

  userMappingForm:FormGroup;

  displayedColumns: string[] = [ 'Activities','Application', 'DateTime'];
  tableDataSource;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  
  passwordMatchValidator = function(formControl:FormControl) {
        const password: string = formControl.get('Password').value; // get password from our password form control
        const confirmPassword: string = formControl.get('ConfirmPassword').value; // get password from our confirmPassword form control
        // compare is the password math
        if ((password !== confirmPassword)&& password !=null && confirmPassword!=null) {
          // if they don't match, set an error in our confirmPassword form control

          formControl.get('ConfirmPassword').setErrors({ 'mismatch': true });
        }
  }

 /** Map from flat node to nested node. This helps us finding the nested node to be modified */
 flatNodeMap = new Map<TreeFlatNode, TreeNode>();

 /** Map from nested node to flattened node. This helps us to keep the same object for selection */
 nestedNodeMap = new Map<TreeNode, TreeFlatNode>();

 /** A selected parent node to be inserted */
 selectedParent: TreeFlatNode | null = null;

 treeControl: FlatTreeControl<TreeFlatNode>;

 treeFlattener: MatTreeFlattener<TreeNode, TreeFlatNode>;

 dataSource: MatTreeFlatDataSource<TreeNode, TreeFlatNode>;

 currentDate=new Date();

 /** The selection for checklist */
 checklistSelection = new SelectionModel<TreeFlatNode>(true /* multiple */);

  constructor(private usersService: UsersService, private router:Router, private privilegeService:PrivilegesService,private fb: FormBuilder,private roleService:RolesService,public dialog: MatDialog) {
    // this.tableDataSource = new MatTableDataSource([{"Application":"Meds","Activity": new Date((new Date().getTime()-10*6000)).toLocaleString()+"- Login"},
    //                                                {"Application":"Meds","Activity": new Date().toLocaleString()+"- Logout"}]);

    this.userMappingForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      MiddleName: new FormControl(''),
      LastName: new FormControl('', Validators.required),
      MobileNumber: new FormControl('',Validators.compose([Validators.required,Validators.pattern('[0-9]{10}')])),
      EmailId: new FormControl('', Validators.compose([Validators.required,Validators.email])),
      LoginId: new FormControl('', Validators.required),
      // Password: new FormControl('', Validators.compose([ Validators.required,this.passwordMatchValidator.bind(this)])),
      // ConfirmPassword: new FormControl('', Validators.compose([Validators.required,this.passwordMatchValidator.bind(this)])),
      Password: new FormControl('', Validators.compose([ Validators.required,Validators.minLength(8)])),
      ConfirmPassword: new FormControl('', Validators.compose([Validators.required])),
      AccountLocked:new FormControl(''),
      Disabled:new FormControl(''),
      EmailSelected:new FormControl('')    
    },{
      validator:this.passwordMatchValidator
    });    
  }

  ngOnInit() {             
    this.privilegeService.getApplicationPrivilegesList();  
    this.privilegeService.applicationPrivileges.subscribe((applicationPrivilegeList)=>{
    }); 

    this.usersService.selectedUserId.subscribe((userId)=>{
      this.selectedTabIndex=0;
      if(userId==0)
      {        
        this.GetRolesInfo();        
      }
      else
      {
        this.GetUserInfo();
      }
    });  
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
    this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TreeFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    if(this.roleService.siteTreeErrorMessage.value==='' && this.roleService.siteInfo.value.length===0){
    this.roleService.getSiteInfoFromEC((res, err) => {
      if (err) {
      } else {        
      }
    });
    }
    this.roleService.siteInfo.subscribe((siteInfo)=>{
      this.GetSiteInfo();    
    });
  }

  buildFileTree(serviceData:any, level: number) { 
  let finalTreeData:TreeNode[]=[];
   let totalObjectCount=Object.keys(serviceData).length;
   for(var i=0;i<totalObjectCount;i++)
   {
    const nodeData=Array.isArray(serviceData[i])?serviceData[i][0]:serviceData[i];

    const node = new TreeNode();
    node.NodeId=nodeData.NodeId;
    node.NodeName=nodeData.NodeName;
    node.NodeType=nodeData.NodeType;
    //node.Children=this.buildFileTree(serviceData[i].children,level+1);
    node.ApplicationId=nodeData.ApplicationVersionId;
   // node.Privileges=[];
    node.Selected=false;
    node.TotalCount=0
    let parentNodeId= nodeData.ParentId;
    if(node.NodeType.toLowerCase()==='application')
    {    
     let privileges= this.privilegeService.applicationPrivileges.value.filter(appPrivilege => appPrivilege.ApplicationPrivileges.Application.ApplicationVersionId===nodeData.ApplicationVersionId).map(function(filteredData){
        return filteredData.ApplicationPrivileges.Privileges;
      });
       //node.Privileges=privileges;
      node.Children=this.buildPrivilegeTree(privileges,level+1, parentNodeId);
      node.TotalCount= node.Children.filter(privilege => privilege.Selected===true).length;
    }
    else{
      node.Children=this.buildFileTree(nodeData.Children,level+1);
    }
    finalTreeData.push(node);
   }
    return finalTreeData; 
  }

  buildPrivilegeTree(privilegeData:any, level: number, parentNodeId: number) {  
    let finalTreeData:TreeNode[]=[];
    if(privilegeData.length>0)
    {
      let totalObjectCount=privilegeData[0].length;
      for(var i=0;i<totalObjectCount;i++)
      {
        const node = new TreeNode();
        node.NodeId=privilegeData[0][i].Privilege.PrivilegeId;
        node.NodeName=privilegeData[0][i].Privilege.PrivilegeName;
        node.NodeType="privilege";
        node.Children=[];
        node.ApplicationId=0;      
        node.Selected=((this.usersService.rolePrivilegeInfo.value.filter(value => value.SitePrivileges.ApplicationPrivilegeId===node.NodeId && value.SitePrivileges.SiteId===parentNodeId)).length>0)?true:false;
        
        finalTreeData.push(node);
      }
        return finalTreeData; 
      }
      else{
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
    const flatNode = existingNode && existingNode.NodeName === node.NodeName
        ? existingNode
        : new TreeFlatNode();
    flatNode.NodeName = node.NodeName;
    flatNode.NodeType=node.NodeType;
    flatNode.NodeId=node.NodeId;
    flatNode.Level = level;
    flatNode.Expandable = (node.Children.length>0);
    flatNode.Selected=node.Selected;
    flatNode.TotalCount=node.TotalCount;
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
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeFlatNode): void {
   this.checklistSelection.toggle(node);
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
 

  // backgroundColor = "#036bc0";
  // color="white";

  drop(event: CdkDragDrop<RoleDetails[]>) {    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    
    this.mappedRoles.sort((role1,role2)=>{
      if(role1.Role.RoleName.toLocaleLowerCase() > role2.Role.RoleName.toLocaleLowerCase())
      {
         return 1;
      }
      else if(role1.Role.RoleName.toLocaleLowerCase() < role2.Role.RoleName.toLocaleLowerCase()){
        return -1;
      }      
      return 0;
    });

    this.availableRoles.sort((role1,role2)=>{
      if(role1.Role.RoleName.toLocaleLowerCase() > role2.Role.RoleName.toLocaleLowerCase())
      {
         return 1;
      }
      else if(role1.Role.RoleName.toLocaleLowerCase() < role2.Role.RoleName.toLocaleLowerCase()){
        return -1;
      }      
      return 0;
    });
  
    this.MapAssignedPrivileges();
    //this.GetSiteInfo();
  }
  
  
  GetUserInfo() {
    this.usersService.getUserInfo((response: UserFullDetails, err) => {
      if (err) {
        this.tableDataSource = new MatTableDataSource();
      } else {
        this.userFullInformation = response; 
        this.userDetails=response.UserDetails[0];
        this.userMappingForm.patchValue({
          FirstName:this.userDetails.FirstName,
          MiddleName:this.userDetails.MiddleName,
          LastName:this.userDetails.LastName,
          MobileNumber:this.userDetails.PhoneNumber,
          EmailId:this.userDetails.EmailAddress,
          LoginId:this.userDetails.UserName,
          Password:this.userDetails.Password,
          ConfirmPassword:this.userDetails.Password,
          AccountLocked:this.userDetails.IsAccountLocked,
          Disabled:this.userDetails.IsAccountDisabled,
          EmailSelected:this.userDetails.IsEmailSelected
        });
        this.ChangeEmailSelected();

        Object.values(this.userMappingForm.controls).forEach(control => {
          control.markAsTouched();          
          control.setErrors(null);
        });
        this.availableRoles=response.Roles.AvailableRoles;
        this.mappedRoles=response.Roles.MappedRoles;
        this.tableDataSource = new MatTableDataSource(response.Logs);
        this.tableDataSource.paginator=this.paginator;
        this.tableDataSource.sort=this.sort;
 
        //this.GetSiteInfo();
        this.MapAssignedPrivileges();
      }
    });
  }

  GetRolesInfo() {
    this.usersService.getRolesList((res:RoleDetails[],err)=>{
      if(err){      
      }
      else{   
        if(res.length==0)
        {
          this.statusMessage="No Roles Available.";
        }   
        else{
          this.availableRoles=res;         
        }    
        this.mappedRoles=[];   
             
        this.userMappingForm.reset();
        this.ChangeEmailSelected();
        //this.GetSiteInfo(); 
        this.MapAssignedPrivileges();
      }
    });
  }

  GetSiteInfo()
  {
    //this.GetPrivilegesForRoles();
    const data = this.buildFileTree(this.roleService.siteInfo.value, 0);
    this.dataSource.data = data;
    this.treeControl.expand(this.treeControl.dataNodes[0])
  }

  GetPrivilegesForRoles()
  {
    let rolesRequest=[];
      if(this.mappedRoles){
        this.mappedRoles.forEach(role =>{
              let request={Role:{RoleId:role.Role.RoleId}};
              rolesRequest.push(request);
        });
        if(rolesRequest.length>0)
        {
            this.usersService.getRolesPrivilegesList(rolesRequest,(response: RolePrivilegeDetails[], err) => {
              if (err) {
              } else {    
                this.GetSiteInfo();
              }
            });
          }
          else{
            this.usersService.rolePrivilegeInfo.next([]);
            this.GetSiteInfo();
          }
      }
  }

  MapAssignedPrivileges()
  {
      this.GetPrivilegesForRoles();
  }

  OnCancelClick(userForm)
  {
    this.usersService.setUserId(0);
    //userForm.resetForm();  
  } 

  OnSaveClick()
  {
    let userBasicDetails={
      firstname:this.userMappingForm.controls.FirstName.value,
      middlename:this.userMappingForm.controls.MiddleName.value,
      lastname:this.userMappingForm.controls.LastName.value,
      mobilenumber:this.userMappingForm.controls.MobileNumber.value,
      emailid:this.userMappingForm.controls.EmailId.value,
      isemailselected:(this.userMappingForm.controls.EmailSelected.value===null || this.userMappingForm.controls.EmailSelected.value===undefined)?false:this.userMappingForm.controls.EmailSelected.value,
      loginid:this.userMappingForm.controls.LoginId.value,
      password:this.userMappingForm.controls.Password.value,
      isaccountlocked:(this.userMappingForm.controls.AccountLocked.value===null|| this.userMappingForm.controls.AccountLocked.value===undefined)?false:this.userMappingForm.controls.AccountLocked.value,
      isaccountdisabled:(this.userMappingForm.controls.Disabled.value===null || this.userMappingForm.controls.Disabled.value===undefined)?false:this.userMappingForm.controls.Disabled.value,
    };
    let userRolesDetails=[];
    if(this.mappedRoles){
      this.mappedRoles.forEach(role =>{
            let request={Role:{RoleId:role.Role.RoleId}};
            userRolesDetails.push(request);
      });
    }

    let userDetails={
      UserBasicDetails:userBasicDetails,
      UserRolesDetails:userRolesDetails
    };
    this.usersService.saveUserDetails(userDetails,(response, err) => {
      if (err) {
        this.showMessagePopup={
          show:true,
          message:(err.error.RegistrationResponse)?err.error.RegistrationResponse.ErrorText:err.error.Error.Message,
          status:false
        };
        this.DismissMessagePopup();      
      } else {  
      //   if(response.isNewUser===false)
      //   {
      //     this.showMessagePopup={show:true,message:"This User already exists!!.", status:false};
      //   }
      //   else
      //   {
          this.showMessagePopup={show:true,message:"Saved Successfully!!.", status:true};
         
        // }
       
        this.DismissMessagePopup();
      // alert(response.status);

      }
      this.usersService.getUserList((res:UserList[],err)=>{
        if(err){       
        }
        else{ 
          if(response)
          {
           this.usersService.setUserId(response.UserId);
          }                
          if(res.length==0)
          {
            this.statusMessage="No users Available. Please create new user.";
          }        
        }
      });
    });
  }
  
  OnUpdateClick()
  {
    let userBasicDetails={
      userid:this.usersService.selectedUserId.value,
      firstname:this.userMappingForm.controls.FirstName.value,
      middlename:this.userMappingForm.controls.MiddleName.value,
      lastname:this.userMappingForm.controls.LastName.value,
      mobilenumber:this.userMappingForm.controls.MobileNumber.value,
      emailid:this.userMappingForm.controls.EmailId.value,
      isemailselected:(this.userMappingForm.controls.EmailSelected.value===null || this.userMappingForm.controls.EmailSelected.value===undefined)?false:this.userMappingForm.controls.EmailSelected.value,
      loginid:this.userMappingForm.controls.LoginId.value,
      password:this.userMappingForm.controls.Password.value,
      isaccountlocked:(this.userMappingForm.controls.AccountLocked.value===null|| this.userMappingForm.controls.AccountLocked.value===undefined)?false:this.userMappingForm.controls.AccountLocked.value,
      isaccountdisabled:(this.userMappingForm.controls.Disabled.value===null || this.userMappingForm.controls.Disabled.value===undefined)?false:this.userMappingForm.controls.Disabled.value,

    };
    let userRolesDetails=[];
    if(this.mappedRoles){
      this.mappedRoles.forEach(role =>{
            let request={Role:{RoleId:role.Role.RoleId}};
            userRolesDetails.push(request);
      });
    }

    let userDetails={
      UserBasicDetails:userBasicDetails,
      UserRolesDetails:userRolesDetails
    };
    this.usersService.updateUserDetails(userDetails,(response, err) => {
      if (err) {
        this.showMessagePopup={
          show:true,
          message:(err.error.UserUpdateResponse)?err.error.UserUpdateResponse.ErrorText:err.error.Error.Message, 
          status:false
        };
        this.DismissMessagePopup();
      } else {   
        // if(response.RegistrationResponse.isNewUser===false)
        // {
        //   this.showMessagePopup={show:true,message:"This Username or E-mail Id already exists!!.", status:false};
        // }
        // else
        // {
          this.showMessagePopup={show:true,message:"Updated Successfully!!.", status:true};
        // }

      
        this.DismissMessagePopup();
       
      // alert(response.status);

      }
      this.usersService.getUserList((res:UserList[],err)=>{
        if(err){       
        }
        else{
          if(response)
         {
          this.usersService.setUserId(response.UserId);
         }         
          if(res.length==0)
          {
            this.statusMessage="No users Available. Please create new user.";
          }        
        }
      });
    });
  }

  OnResetPasswordClick(){
    let dialogResponse:boolean;

    const dialogRef = this.dialog.open(PasswordDialogComponent);

    dialogRef.afterClosed().subscribe(dialogResult => {
      dialogResponse = dialogResult;
      if(dialogResponse===true)
      {
       //alert("Reset Password True");
       this.showMessagePopup={show:true,message:"Password Updated Successfully!!.", status:true};     
       this.DismissMessagePopup();
      }
      else
      {
        //alert("Reset Password False");
      }
    });
  }

  ChangeEmailSelected()
  {
    if(this.userMappingForm.controls.EmailSelected.value===true)
    {
     // this.userMappingForm.controls.LoginId.setValue(this.userMappingForm.controls.EmailId.value);
     this.userMappingForm.controls.LoginId.disable();
    }
    else{
      this.userMappingForm.controls.LoginId.enable();
    }
  }

  DismissMessagePopup(){
  setTimeout(() => {
    this.showMessagePopup.show=false;
  }, 2000);
  }
  
}
