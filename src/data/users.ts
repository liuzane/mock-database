export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  roleId: number;
  createTime: string;
  lastLoginTime: string;
}

const users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '16602100001', status: 'active', role: '超级管理员', roleId: 1, createTime: '2024-01-01 10:00:00', lastLoginTime: '2024-01-15 14:30:00' },
  { id: 2, name: '李四', email: 'lisi@example.com', phone: '16602100002', status: 'active', role: '管理员', roleId: 2, createTime: '2024-01-02 10:00:00', lastLoginTime: '2024-01-14 16:20:00' },
  { id: 3, name: '王五', email: 'wangwu@example.com', phone: '16602100003', status: 'disabled', role: '产品经理', roleId: 3, createTime: '2024-01-03 10:00:00', lastLoginTime: '2024-01-10 09:15:00' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '16602100004', status: 'active', role: '运营专员', roleId: 4, createTime: '2024-01-04 10:00:00', lastLoginTime: '2024-01-15 10:00:00' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', phone: '16602100005', status: 'active', role: '普通用户', roleId: 5, createTime: '2024-01-05 10:00:00', lastLoginTime: '-' },
  { id: 6, name: '周八', email: 'zhouba@example.com', phone: '16602100006', status: 'active', role: '访客', roleId: 6, createTime: '2024-01-06 10:00:00', lastLoginTime: '2024-01-13 11:45:00' },
  { id: 7, name: '吴九', email: 'wujiu@example.com', phone: '16602100007', status: 'active', role: '数据分析师', roleId: 7, createTime: '2024-01-07 10:00:00', lastLoginTime: '2024-01-15 09:30:00' },
  { id: 8, name: '郑十', email: 'zhengshi@example.com', phone: '16602100008', status: 'disabled', role: '财务人员', roleId: 8, createTime: '2024-01-08 10:00:00', lastLoginTime: '2024-01-09 17:00:00' },
  { id: 9, name: '冯十一', email: 'fengshiyi@example.com', phone: '16602100009', status: 'active', role: '管理员', roleId: 2, createTime: '2024-01-09 10:00:00', lastLoginTime: '2024-01-14 13:20:00' },
  { id: 10, name: '陈十二', email: 'chenshier@example.com', phone: '16602100010', status: 'active', role: '普通用户', roleId: 5, createTime: '2024-01-10 10:00:00', lastLoginTime: '-' },
  { id: 11, name: '褚十三', email: 'chushisan@example.com', phone: '16602100011', status: 'active', role: '运营专员', roleId: 4, createTime: '2024-01-11 10:00:00', lastLoginTime: '2024-01-15 11:00:00' },
  { id: 12, name: '卫十四', email: 'weishisi@example.com', phone: '16602100012', status: 'active', role: '产品经理', roleId: 3, createTime: '2024-01-12 10:00:00', lastLoginTime: '2024-01-15 08:30:00' },
  { id: 13, name: '蒋十五', email: 'jiangshiwu@example.com', phone: '16602100013', status: 'disabled', role: '访客', roleId: 6, createTime: '2024-01-13 10:00:00', lastLoginTime: '2024-01-12 15:45:00' },
  { id: 14, name: '沈十六', email: 'shenshiliu@example.com', phone: '16602100014', status: 'active', role: '普通用户', roleId: 5, createTime: '2024-01-14 10:00:00', lastLoginTime: '2024-01-15 12:00:00' },
  { id: 15, name: '韩十七', email: 'hanshiqi@example.com', phone: '16602100015', status: 'active', role: '普通用户', roleId: 5, createTime: '2024-01-15 10:00:00', lastLoginTime: '-' },
  { id: 16, name: '杨十八', email: 'yangshiba@example.com', phone: '16602100016', status: 'active', role: '数据分析师', roleId: 7, createTime: '2024-01-15 11:00:00', lastLoginTime: '2024-01-15 14:00:00' },
];

export default users;
