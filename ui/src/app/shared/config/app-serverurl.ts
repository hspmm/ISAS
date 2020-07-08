
export function AppServerUrl(){
      return{ 
          roles : '/roles',       
          users: '/users',
          logoutUrl: '/api/v1/user/logout',
          ecConfigUrl : '/api/v1/server/app/info',
          detectPluginsListUrl: '/api/v1/plugins/detect',
          setEnableAndDisablePluginServiceUrl: '/api/v1/plugins/services/activate',
          restartAllPluginServices : '/api/v1/plugins/services/restart/all',
          restartIndividualPluginServices : '/api/v1/plugins/services/restart/',
          heirarchyUrl: '/api/v1/hierarchy',
          addHeirarchyNodeUrl: '/api/v1/hierarchy/node/add',
          bulkCreateHeirarchyNodesUrl: '/api/v1/hierarchy/node/add/bulk',
          updateHierarchyNodeUrl: '/api/v1/hierarchy/node/update',
          deleteHierarchyNodeUrl: '/api/v1/hierarchy/node/delete/',
          hierarchyLevelUrl: '/api/v1/hierarchy/hierarchyLevel',
          importFacilities : '/api/v1/facilities/list/import',
          updateNodeParentId : '/api/v1/hierarchy/node/update/parentId'
        }    
    }