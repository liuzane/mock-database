export interface Product {
  id: number;
  productNo: string;
  name: string;
  price: number;
  stock: number;
  sales: number;
  category: string;
  status: string;
  supplier: string;
  createTime: string;
  description: string;
}

export const products: Product[] = [
  { id: 1, productNo: 'PRD0001', name: '无线蓝牙耳机 Pro', price: 299.00, stock: 150, sales: 320, category: 'electronics', status: 'on_sale', supplier: '深圳科技有限公司', createTime: '2024-01-10 10:30:00', description: '高品质无线蓝牙耳机，支持主动降噪' },
  { id: 2, productNo: 'PRD0002', name: '智能手表运动版', price: 1299.00, stock: 50, sales: 180, category: 'electronics', status: 'on_sale', supplier: '广州智能科技', createTime: '2024-01-09 11:20:00', description: '支持心率监测、GPS定位的运动智能手表' },
  { id: 3, productNo: 'PRD0003', name: '平板电脑 Air', price: 4999.00, stock: 9, sales: 85, category: 'electronics', status: 'low_stock', supplier: '上海电子科技', createTime: '2024-01-08 14:45:00', description: '轻薄便携，高性能平板电脑' },
  { id: 4, productNo: 'PRD0004', name: '机械键盘青轴版', price: 399.00, stock: 80, sales: 210, category: 'electronics', status: 'on_sale', supplier: '东莞电子厂', createTime: '2024-01-07 16:00:00', description: 'RGB背光，青轴机械键盘' },
  { id: 5, productNo: 'PRD0005', name: '纯棉T恤男款', price: 99.00, stock: 500, sales: 1200, category: 'clothing', status: 'on_sale', supplier: '杭州服装有限公司', createTime: '2024-01-06 09:15:00', description: '100%纯棉材质，舒适透气' },
  { id: 6, productNo: 'PRD0006', name: '休闲牛仔裤', price: 199.00, stock: 200, sales: 450, category: 'clothing', status: 'on_sale', supplier: '广州服饰集团', createTime: '2024-01-05 10:30:00', description: '经典版型，百搭款式' },
  { id: 7, productNo: 'PRD0007', name: '运动跑鞋', price: 349.00, stock: 120, sales: 380, category: 'clothing', status: 'off_sale', supplier: '泉州鞋业有限公司', createTime: '2024-01-04 14:00:00', description: '轻便舒适，适合日常运动' },
  { id: 8, productNo: 'PRD0008', name: '纯棉连衣裙', price: 159.00, stock: 80, sales: 260, category: 'clothing', status: 'on_sale', supplier: '深圳女装品牌', createTime: '2024-01-03 15:30:00', description: '优雅大方，适合各种场合' },
  { id: 9, productNo: 'PRD0009', name: '多功能料理机', price: 299.00, stock: 60, sales: 150, category: 'home', status: 'on_sale', supplier: '宁波家电集团', createTime: '2024-01-02 09:00:00', description: '一机多用，厨房好帮手' },
  { id: 10, productNo: 'PRD0010', name: '智能台灯', price: 179.00, stock: 200, sales: 520, category: 'home', status: 'on_sale', supplier: '中山照明科技', createTime: '2024-01-01 11:20:00', description: '护眼无频闪，智能调光' },
  { id: 11, productNo: 'PRD0011', name: '收纳箱套装', price: 89.00, stock: 300, sales: 890, category: 'home', status: 'on_sale', supplier: '义乌家居用品', createTime: '2023-12-31 14:45:00', description: '多规格收纳，整洁家居' },
  { id: 12, productNo: 'PRD0012', name: '乳胶枕', price: 249.00, stock: 0, sales: 180, category: 'home', status: 'out_of_stock', supplier: '南通家纺集团', createTime: '2023-12-30 16:30:00', description: '天然乳胶，舒适睡眠' },
  { id: 13, productNo: 'PRD0013', name: '保湿面霜', price: 199.00, stock: 150, sales: 650, category: 'beauty', status: 'on_sale', supplier: '上海美妆公司', createTime: '2023-12-29 10:15:00', description: '深层补水，滋润肌肤' },
  { id: 14, productNo: 'PRD0014', name: '口红礼盒', price: 299.00, stock: 80, sales: 320, category: 'beauty', status: 'on_sale', supplier: '广州化妆品集团', createTime: '2023-12-28 11:45:00', description: '多种色号，精美礼盒包装' },
  { id: 15, productNo: 'PRD0015', name: '精华液', price: 399.00, stock: 60, sales: 240, category: 'beauty', status: 'off_sale', supplier: '杭州美妆科技', createTime: '2023-12-27 14:20:00', description: '紧致肌肤，提亮肤色' },
  { id: 16, productNo: 'PRD0016', name: '面膜套装', price: 129.00, stock: 200, sales: 780, category: 'beauty', status: 'on_sale', supplier: '深圳护肤品牌', createTime: '2023-12-26 15:50:00', description: '补水保湿，修护肌肤' },
  { id: 17, productNo: 'PRD0017', name: '坚果礼盒', price: 168.00, stock: 100, sales: 420, category: 'food', status: 'on_sale', supplier: '临安坚果厂', createTime: '2023-12-25 09:00:00', description: '精选坚果，营养健康' },
  { id: 18, productNo: 'PRD0018', name: '有机茶叶', price: 298.00, stock: 50, sales: 150, category: 'food', status: 'on_sale', supplier: '福建茶厂', createTime: '2023-12-24 10:30:00', description: '高山有机茶园，品质保证' },
  { id: 19, productNo: 'PRD0019', name: '进口巧克力', price: 89.00, stock: 180, sales: 560, category: 'food', status: 'on_sale', supplier: '上海食品贸易', createTime: '2023-12-23 14:00:00', description: '比利时进口，纯正可可' },
  { id: 20, productNo: 'PRD0020', name: '蜂蜜礼盒', price: 158.00, stock: 0, sales: 280, category: 'food', status: 'out_of_stock', supplier: '浙江蜂业公司', createTime: '2023-12-22 16:30:00', description: '天然蜂蜜，滋补佳品' },
];
