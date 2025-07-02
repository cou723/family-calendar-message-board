// セルレンダリング用データの型定義
export interface CellLayout {
  startHour: number;
  endHour: number;
  cellHeight: number;
  headerHeight: number;
}

// 家族メンバー情報の型定義
export interface FamilyMember {
  member: string;
  name: string;
  bgColor: string;
}