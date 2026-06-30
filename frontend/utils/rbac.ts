import { CurrentUser } from '@/types/auth';
import { NavigationGroup } from '@/config/navigation';

export function hasRole(user: CurrentUser | null, role: string): boolean {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
}

export function hasAnyRole(user: CurrentUser | null, roles: string[]): boolean {
  if (!user || !user.roles) return false;
  return roles.some((role) => user.roles.includes(role));
}

export function hasPermission(user: CurrentUser | null, permission: string): boolean {
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: CurrentUser | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.some((perm) => user.permissions.includes(perm));
}

export function hasAllPermissions(user: CurrentUser | null, permissions: string[]): boolean {
  if (!user || !user.permissions) return false;
  return permissions.every((perm) => user.permissions.includes(perm));
}

export function filterNavigation(
  config: NavigationGroup[],
  user: CurrentUser | null
): NavigationGroup[] {
  return config
    .map((group) => {
      const filteredItems = group.items
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              const roleOk = !child.requiredRoles || hasAnyRole(user, child.requiredRoles);
              const permOk =
                !child.requiredPermissions || hasAllPermissions(user, child.requiredPermissions);
              return roleOk && permOk;
            });
            return { ...item, children: filteredChildren };
          }
          return item;
        })
        .filter((item) => {
          const roleOk = !item.requiredRoles || hasAnyRole(user, item.requiredRoles);
          const permOk =
            !item.requiredPermissions || hasAllPermissions(user, item.requiredPermissions);

          if (item.children && item.children.length === 0) {
            return false;
          }

          return roleOk && permOk;
        });

      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);
}
