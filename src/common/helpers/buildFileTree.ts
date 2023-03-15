export interface TreeNode {
  id: string;
  name: string;
  type: string;
  children: TreeNode[] | null;
  parentId: string | null;
}

export function buildFileTree(
  flatList: {
    id: string;
    name: string;
    type: string;
    parentId: string | null;
  }[]
): TreeNode[] {
  const tree: TreeNode[] = [];

  const map = new Map<string, TreeNode>();
  for (const item of flatList) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of map.values()) {
    if (item.parentId === null) {
      tree.push(item);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children?.push(item);
      }
    }
  }

  return tree;
}
