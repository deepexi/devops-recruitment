<template>
  <div class="wrapper">
    <div class="left">
      <div class="defaultList">
        <div class="title">默认列表</div>
        <ul class="list">
          <li
            :class="{active: currentLi == 'allHost'}"
            @click="switch2('allHost')"
          >
            全部主机({{ defaultHost.totalCount }})
          </li>
          <li
            :class="{active: currentLi == 'freeHost'}"
            @click="switch2('freeHost')"
          >
            空闲主机池({{ defaultHost.freeCount }})
          </li>
          <li
            :class="{active: currentLi === 'baseFacilty'}"
            @click="switch2('baseFacilty')"
          >
            企业基础设施({{ defaultHost.infrHostCount }})
          </li>
        </ul>
      </div>
      <div class="project-list">
        <div class="title">工程列表</div>
        <el-input placeholder="" v-model="filterText" size="small"> </el-input>
        <el-tree
          class="project-tree"
          node-key="name"
          ref="projectTree"
          accordion
          lazy
          highlight-current
          :props="projectProps"
          :filter-node-method="searchProject"
          :load="loadTreeData"
          @node-click="nodeClick"
        >
          <span slot-scope="{node, data}">
            <span>{{ node.data.name }}</span> （{{ node.data.count }}）
          </span>
        </el-tree>
      </div>
    </div>
    <div class="right">
      <el-data-table
        v-bind="hostTableConfig"
        :searchForm="searchForm"
        :customQuery="customQuery"
        ref="dataTable"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultHost: {},
      projectProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      filterText: '',
      hostTableConfig: {
        url: '/hire/hostList',
        dataPath: 'payload.list',
        totalPath: 'payload.totalPage',
        hasNew: false,
        hasOperation: false,
        columns: [
          {
            label: '外网IP',
            prop: 'hostIp'
          },
          {
            label: '内网IP',
            prop: 'localIp'
          },
          {
            label: '分类标签',
            prop: 'categoryTag'
          },
          {
            label: '主机状态',
            prop: 'status'
          },
          {
            label: '所属业务分组',
            prop: 'group',
            width: '200px'
          }
        ],
        form: []
      },
      searchForm: [
        {
          id: 'ip',
          label: '内/外网ip',
          type: 'input'
        },
        {
          id: 'categoryTag',
          label: '分类标签',
          type: 'select',
          options: []
        }
      ],
      customQuery: {
        type: 'allHost'
      },
      currentLi: 'allHost'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.projectTree.filter(val)
    }
  },
  mounted() {
    this.getDefaultCount()
    this.getCategoryTags()
  },
  methods: {
    getDefaultCount() {
      this.$axios.$get('/hire/getHostCount').then(res => {
        this.defaultHost = res.payload
      })
    },
    searchProject(value, data) {
      if (!value) return true
      return data[this.projectProps.label].indexOf(value) !== -1
    },
    loadTreeData(node, resolve) {
      if (node.level === 0) {
        this.$axios.$get('/hire/projectList').then(res => {
          resolve(
            res.payload.list.map(item => {
              return {
                name: item.name,
                id: item.id,
                count: item.projectTotalCount,
                type: 'project all',
                children: [
                  {
                    name: '空闲主机',
                    count: item.projectFreeCount,
                    type: 'project free',
                    id: item.id,
                    leaf: true
                  },
                  {
                    name: '工程基础设施',
                    count: item.projectInfrCount,
                    type: 'project facilty',
                    id: item.id,
                    leaf: true
                  }
                ]
              }
            })
          )
        })
      } else if (node.level === 1) {
        this.$axios
          .$get('/hire/enviroments', {params: {id: node.data.id}})
          .then(res => {
            resolve(
              node.data.children.concat(
                res.payload.map(item => {
                  return {
                    name: item.name,
                    count: item.envTotalCount,
                    id: item.id,
                    type: 'enviroment all',
                    children: [
                      {
                        name: '空闲主机',
                        count: item.envFreeCount,
                        type: 'enviroment free',
                        id: item.id,
                        leaf: true
                      },
                      {
                        name: '环境基础设施',
                        count: item.envInfrCount,
                        type: 'enviroment facilty',
                        id: item.id,
                        leaf: true
                      },
                      {
                        name: '服务主机',
                        count: item.envServiceCount,
                        type: 'enviroment service',
                        id: item.id,
                        leaf: true
                      }
                    ]
                  }
                })
              )
            )
          })
      } else if (node.level === 2) {
        resolve(node.data.children)
      }
    },
    getCategoryTags() {
      this.$axios.$get('/hire/categoryTags').then(res => {
        this.searchForm[1].options = res.payload.map(item => {
          return {
            value: item,
            label: item
          }
        })
      })
    },
    switch2(where) {
      this.customQuery.type = where
      this.currentLi = where
      this.$refs.dataTable.resetSearch()
    },
    nodeClick(data) {
      this.customQuery.type = data.type
      this.customQuery.id = data.id
      this.currentLi = data.type
      this.$refs.dataTable.resetSearch()
    }
  }
}
</script>
<style lang="less">
.wrapper {
  padding: 8px;
  display: flex;

  .title {
    margin-bottom: 8px;
    color: #999;
    font-size: 14px;
  }

  .left {
    width: 250px;
    padding: 24px;

    .defaultList {
      margin-bottom: 16px;

      .list {
        li {
          cursor: pointer;

          &:hover {
            background: #dedede;
          }

          &.active {
            background: #f2f5ff;

            &:hover {
              background: #dedede;
            }
          }
        }
      }
    }
  }

  .right {
    padding: 24px;
  }
}
</style>
