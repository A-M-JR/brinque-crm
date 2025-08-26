"use client"

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Store } from '@/lib/supabase/stores';
import { Franchise } from '@/lib/supabase/franchises';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Palette, Instagram, MessageSquare } from 'lucide-react';

export type StoreFormData = Omit<Store, 'id' | 'created_at' | 'franchise' | 'config'>;

type StoreFormProps = {
    initialData?: StoreFormData;
    franchises: Franchise[];
    onSubmit: (data: StoreFormData) => Promise<void>;
    loading: boolean;
};

export function StoreForm({ initialData, franchises, onSubmit, loading }: StoreFormProps) {
    const { register, handleSubmit, control, formState: { errors } } = useForm<StoreFormData>({
        // 👇 ALTERAÇÃO AQUI: Valores padrão agora são de primeiro nível
        defaultValues: initialData || {
            name: '',
            slug: '',
            franchise_id: undefined,
            is_active: true,
            primary_color: '#000000', 
            secondary_color: '#ffffff',
            instagram_user: '',
            whatsapp_number: ''
        }
    });

    const isEditMode = !!initialData;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informações da Loja</CardTitle>
                    <CardDescription>Dados principais que serão usados para identificar e acessar a loja.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="franchise_id">Franquia Responsável</Label>
                        <Controller
                            name="franchise_id"
                            control={control}
                            rules={{ required: "É obrigatório vincular a uma franquia." }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value?.toString()}
                                    disabled={isEditMode}
                                >
                                    <SelectTrigger><SelectValue placeholder="Selecione uma franquia..." /></SelectTrigger>
                                    <SelectContent>
                                        {franchises.map(f => <SelectItem key={f.id} value={f.id.toString()}>{f.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.franchise_id && <p className="text-sm text-red-500 mt-1">{errors.franchise_id.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nome da Loja</Label>
                            <Input id="name" {...register("name", { required: "O nome é obrigatório" })} />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="slug">URL da Loja (Slug)</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="slug" {...register("slug", { required: "A URL é obrigatória" })} className="pl-9" />
                            </div>
                            {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea id="description" {...register("description")} placeholder="Fale um pouco sobre a loja..." />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Controller name="is_active" control={control} render={({ field }) => <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />} />
                        <Label htmlFor="is_active">Loja Ativa e Visível para Clientes</Label>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Personalização e Contato</CardTitle>
                    <CardDescription>Defina a identidade visual e os links de contato da loja.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="logo_url">URL do Logo</Label>
                            <Input id="logo_url" {...register("logo_url")} placeholder="https://exemplo.com/logo.png" />
                        </div>
                        <div>
                            <Label htmlFor="banner_url">URL do Banner Principal</Label>
                            <Input id="banner_url" {...register("banner_url")} placeholder="https://exemplo.com/banner.png" />
                        </div>
                        <div>
                            <Label htmlFor="instagram_user">Instagram</Label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                {/* 👇 ALTERAÇÃO AQUI 👇 */}
                                <Input id="instagram_user" {...register("instagram_user")} placeholder="usuario_do_instagram" className="pl-9" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="whatsapp_number">WhatsApp</Label>
                             <div className="relative">
                                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                {/* 👇 ALTERAÇÃO AQUI 👇 */}
                                <Input id="whatsapp_number" {...register("whatsapp_number")} placeholder="5511999998888" className="pl-9" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="primary_color">Cor Primária</Label>
                            {/* 👇 ALTERAÇÃO AQUI 👇 */}
                            <Controller name="primary_color" control={control} render={({ field }) => <Input type="color" {...field} value={field.value || ''} className="p-1 h-10" />} />
                        </div>
                        <div>
                            <Label htmlFor="secondary_color">Cor Secundária</Label>
                            {/* 👇 ALTERAÇÃO AQUI 👇 */}
                            <Controller name="secondary_color" control={control} render={({ field }) => <Input type="color" {...field} value={field.value || ''} className="p-1 h-10" />} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Loja"}
                </Button>
            </div>
        </form>
    );
}