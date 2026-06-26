export interface Role {
  id: number;
  name: string;
  code: string;
  status: string;
  userCount: number;
  createTime: string;
  description: string;
}

export const roles: Role[] = [
  { id: 1, name: '超级管理员', code: 'super_admin', status: 'active', userCount: 2, createTime: '2024-01-01 10:00:00', description: '拥有所有系统权限' },
  { id: 2, name: '管理员', code: 'admin', status: 'active', userCount: 5, createTime: '2024-01-02 10:00:00', description: '管理后台用户和配置' },
  { id: 3, name: '产品经理', code: 'product_manager', status: 'active', userCount: 8, createTime: '2024-01-03 10:00:00', description: '产品管理和需求分析' },
  { id: 4, name: '运营专员', code: 'operation', status: 'active', userCount: 15, createTime: '2024-01-04 10:00:00', description: '日常运营管理' },
  { id: 5, name: '普通用户', code: 'user', status: 'inactive', userCount: 120, createTime: '2024-01-05 10:00:00', description: '基础权限用户' },
  { id: 6, name: '访客', code: 'guest', status: 'active', userCount: 50, createTime: '2024-01-06 10:00:00', description: '仅可查看公开内容' },
  { id: 7, name: '数据分析师', code: 'analyst', status: 'active', userCount: 3, createTime: '2024-01-07 10:00:00', description: '查看数据分析报表' },
  { id: 8, name: '财务人员', code: 'finance', status: 'inactive', userCount: 4, createTime: '2024-01-08 10:00:00', description: '财务管理相关权限' },
];
