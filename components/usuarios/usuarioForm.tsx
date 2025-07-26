"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type UsuarioFormData = {
  id?: number
  name: string
  email: string
  type: string // "admin_master" | "distribuidor" | "revendedor" | "usuario"
  password?: string
  id_status?: number
  group_id: number | null
  franchise_id?: number
}

type UsuarioFormProps = {
  initialData?: Partial<UsuarioFormData>
  onSubmit: (data: UsuarioFormData) => void | Promise<void>
  loading?: boolean
  editMode?: boolean
  gruposPermissao: { id: number; name: string }[]
}

export function UsuarioForm({ initialData = {}, onSubmit, loading = false, editMode = false, gruposPermissao }: UsuarioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<UsuarioFormData>({
    defaultValues: {
      id: initialData.id ?? undefined,
      name: initialData.name ?? "",
      email: initialData.email ?? "",
      type: initialData.type ?? "usuario",
      password: "",
      id_status: initialData.id_status ?? 1,
      group_id: initialData.group_id ?? 1,
    }
  })

  // Atualiza o form se dados mudarem (edição)
  // Poderia usar reset() também se quiser atualizar todos os campos de uma vez

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {editMode && (
        <input type="hidden" {...register("id")} />
      )}

      <div>
        <label className="block font-medium mb-1">Nome</label>
        <Input {...register("name", { required: "Nome obrigatório" })} disabled={loading} />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">E-mail</label>
        <Input {...register("email", { required: "E-mail obrigatório" })} type="email" disabled={loading} />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">Função</label>
        <select
          {...register("type", { required: "Função obrigatória" })}
          className="border rounded px-2 py-1 w-full"
          disabled={loading}
        >
          <option value="usuario">Usuário</option>
          <option value="revendedor">Revendedor</option>
          <option value="distribuidor">Distribuidor</option>
          <option value="admin_master">Admin Master</option>
        </select>
        {errors.type && <span className="text-xs text-red-500">{errors.type.message}</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">Grupo de Permissões</label>
        <select
          {...register("group_id", { required: "Grupo de permissões obrigatório" })}
          className="border rounded px-2 py-1 w-full"
          disabled={loading}
        >
          {gruposPermissao.map(grupo => (
            <option key={grupo.id} value={grupo.id}>{grupo.name}</option>
          ))}
        </select>
        {errors.group_id && <span className="text-xs text-red-500">{errors.group_id.message}</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">Senha</label>
        <Input
          {...register("password", editMode ? {} : { required: "Senha obrigatória" })}
          type="password"
          autoComplete="new-password"
          disabled={loading}
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
      </div>

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          {...register("id_status")}
          className="border rounded px-2 py-1 w-full"
          disabled={loading}
        >
          <option value={1}>Ativo</option>
          <option value={2}>Inativo</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Salvando..." : editMode ? "Atualizar" : "Salvar"}
      </Button>
    </form>
  )
}

export default UsuarioForm
