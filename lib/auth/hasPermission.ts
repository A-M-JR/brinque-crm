// lib/auth/hasPermission.ts

// --- Tipagens Corrigidas para Flexibilidade ---

// A estrutura de uma permissão granular
type GranularPermission = {
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

// A tipagem correta para o objeto de permissões, que pode ter valores mistos (boolean ou objeto)
type GroupPermissions = Record<string, boolean | GranularPermission>;

// Define as ações possíveis para maior segurança de tipos
type PermissionAction = 'view' | 'edit' | 'delete';

export function hasPermission(
  moduleKey: string | null,
  action: PermissionAction,
  groupPermissions: GroupPermissions = {}, // Usa a nova tipagem flexível
  franchiseModules: string[] = []
): boolean {
  // Se não for necessária uma permissão específica, permite o acesso
  if (!moduleKey) {
    return true;
  }

  // --- VERIFICAÇÃO CORRIGIDA ---
  // Passo 1: Verifica se o módulo está habilitado para a empresa (franchise).
  const moduleIsEnabledForFranchise = franchiseModules.includes(moduleKey);
  if (!moduleIsEnabledForFranchise) {
    return false;
  }

  // Passo 2: Se o módulo estiver habilitado, verifica as permissões do grupo do utilizador.
  const permissionsForModule = groupPermissions[moduleKey];

  // Se não houver nenhuma entrada de permissão para este módulo no grupo, o acesso é negado.
  if (!permissionsForModule) {
    return false;
  }

  // --- LÓGICA ROBUSTA PARA LIDAR COM TIPOS DE DADOS INCONSISTENTES ---
  // Verifica se a permissão é um objeto (formato granular) ou um booleano (formato antigo/simples).
  if (typeof permissionsForModule === 'object' && permissionsForModule !== null) {
    // É o formato granular { can_view: ..., ... }
    // A tipagem 'as GranularPermission' ajuda o TypeScript a entender a estrutura do objeto.
    const granularPerms = permissionsForModule as GranularPermission;
    switch (action) {
      case 'view':
        return granularPerms.can_view === true;
      case 'edit':
        return granularPerms.can_edit === true;
      case 'delete':
        return granularPerms.can_delete === true;
      default:
        return false;
    }
  } else if (typeof permissionsForModule === 'boolean') {
    // É o formato antigo, um simples booleano.
    // Neste caso, se a permissão for `true`, consideramos que o utilizador tem acesso total (view, edit, delete).
    return permissionsForModule === true;
  }

  // Se não for nem objeto nem booleano, nega o acesso por segurança.
  return false;
}
